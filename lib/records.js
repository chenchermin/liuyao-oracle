const fs = require("fs/promises");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);
const dbPath = path.join(process.cwd(), "data", "readings.db");
let postgresSql;
let databaseReady;
let sqliteQueue = Promise.resolve();

function normalizeRecord(body) {
  const castData = body.castData && typeof body.castData === "object" ? body.castData : {};
  const details = Array.isArray(castData.details) ? castData.details : [];
  const movingLines = details.filter((item) => item?.moving).map((item) => item.position).join("、") || "无";

  return {
    userName: String(body.userName || "").trim(),
    gender: String(body.gender || "").trim(),
    question: String(body.question || "").trim(),
    topic: String(body.topic || "").trim(),
    model: String(body.model || "").trim(),
    baseName: String(castData.base?.name || body.baseName || "").trim(),
    changedName: String(castData.changed?.name || body.changedName || "").trim(),
    movingLines,
    lines: Array.isArray(body.lines) ? body.lines : [],
    castData,
    prompt: String(body.prompt || ""),
    aiText: String(body.aiText || ""),
    status: String(body.status || "success"),
    error: String(body.error || ""),
  };
}

async function createRecord(body) {
  const record = normalizeRecord(body);
  await ensureDatabase();

  if (usesPostgres()) {
    const sql = await getPostgresSql();
    const rows = await sql`
      INSERT INTO readings (
        user_name, gender, question, topic, model, base_name, changed_name,
        moving_lines, lines_json, cast_json, prompt, ai_text, status, error
      ) VALUES (
        ${record.userName},
        ${record.gender},
        ${record.question},
        ${record.topic},
        ${record.model},
        ${record.baseName},
        ${record.changedName},
        ${record.movingLines},
        ${JSON.stringify(record.lines)},
        ${JSON.stringify(record.castData)},
        ${record.prompt},
        ${record.aiText},
        ${record.status},
        ${record.error}
      )
      RETURNING id;
    `;
    return { id: rows[0]?.id || null };
  }

  const rows = await runExclusiveSqlJson(`
    INSERT INTO readings (
      created_at, user_name, gender, question, topic, model, base_name,
      changed_name, moving_lines, lines_json, cast_json, prompt, ai_text,
      status, error
    ) VALUES (
      datetime('now', 'localtime'),
      ${sqlString(record.userName)},
      ${sqlString(record.gender)},
      ${sqlString(record.question)},
      ${sqlString(record.topic)},
      ${sqlString(record.model)},
      ${sqlString(record.baseName)},
      ${sqlString(record.changedName)},
      ${sqlString(record.movingLines)},
      ${sqlString(JSON.stringify(record.lines))},
      ${sqlString(JSON.stringify(record.castData))},
      ${sqlString(record.prompt)},
      ${sqlString(record.aiText)},
      ${sqlString(record.status)},
      ${sqlString(record.error)}
    );
    SELECT last_insert_rowid() AS id;
  `);
  return { id: rows[0]?.id || null };
}

async function listRecords() {
  await ensureDatabase();

  if (usesPostgres()) {
    const sql = await getPostgresSql();
    return sql`
      SELECT
        id,
        to_char(created_at AT TIME ZONE 'Asia/Shanghai', 'YYYY-MM-DD HH24:MI:SS') AS "createdAt",
        user_name AS "userName",
        gender,
        question,
        topic,
        model,
        base_name AS "baseName",
        changed_name AS "changedName",
        moving_lines AS "movingLines",
        status,
        error
      FROM readings
      ORDER BY id DESC
      LIMIT 300;
    `;
  }

  return waitForSqliteWrites().then(() => runSqlJson(`
    SELECT
      id,
      created_at AS createdAt,
      user_name AS userName,
      gender,
      question,
      topic,
      model,
      base_name AS baseName,
      changed_name AS changedName,
      moving_lines AS movingLines,
      status,
      error
    FROM readings
    ORDER BY id DESC
    LIMIT 300;
  `));
}

async function getRecord(id) {
  await ensureDatabase();

  if (usesPostgres()) {
    const sql = await getPostgresSql();
    const rows = await sql`
      SELECT
        id,
        to_char(created_at AT TIME ZONE 'Asia/Shanghai', 'YYYY-MM-DD HH24:MI:SS') AS "createdAt",
        user_name AS "userName",
        gender,
        question,
        topic,
        model,
        base_name AS "baseName",
        changed_name AS "changedName",
        moving_lines AS "movingLines",
        lines_json AS "lines",
        cast_json AS "castData",
        prompt,
        ai_text AS "aiText",
        status,
        error
      FROM readings
      WHERE id = ${id}
      LIMIT 1;
    `;
    return rows[0] || null;
  }

  await waitForSqliteWrites();
  const rows = await runSqlJson(`
    SELECT
      id,
      created_at AS createdAt,
      user_name AS userName,
      gender,
      question,
      topic,
      model,
      base_name AS baseName,
      changed_name AS changedName,
      moving_lines AS movingLines,
      lines_json AS linesJson,
      cast_json AS castJson,
      prompt,
      ai_text AS aiText,
      status,
      error
    FROM readings
    WHERE id = ${id}
    LIMIT 1;
  `);

  if (!rows.length) return null;
  const record = rows[0];
  record.lines = parseJson(record.linesJson, []);
  record.castData = parseJson(record.castJson, null);
  delete record.linesJson;
  delete record.castJson;
  return record;
}

async function ensureDatabase() {
  if (!databaseReady) {
    databaseReady = usesPostgres() ? initPostgres() : initSqlite();
  }
  try {
    return await databaseReady;
  } catch (error) {
    databaseReady = null;
    throw error;
  }
}

async function initPostgres() {
  const sql = await getPostgresSql();
  await sql`
    CREATE TABLE IF NOT EXISTS readings (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      user_name TEXT,
      gender TEXT,
      question TEXT,
      topic TEXT,
      model TEXT,
      base_name TEXT,
      changed_name TEXT,
      moving_lines TEXT,
      lines_json JSONB,
      cast_json JSONB,
      prompt TEXT,
      ai_text TEXT,
      status TEXT NOT NULL DEFAULT 'success',
      error TEXT
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_readings_created_at ON readings(created_at DESC);`;
}

async function initSqlite() {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await runExclusiveSql(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      user_name TEXT,
      gender TEXT,
      question TEXT,
      topic TEXT,
      model TEXT,
      base_name TEXT,
      changed_name TEXT,
      moving_lines TEXT,
      lines_json TEXT,
      cast_json TEXT,
      prompt TEXT,
      ai_text TEXT,
      status TEXT NOT NULL DEFAULT 'success',
      error TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_readings_created_at ON readings(created_at);
  `);
}

async function getPostgresSql() {
  if (!postgresSql) {
    const { neon } = await import("@neondatabase/serverless");
    postgresSql = neon(process.env.DATABASE_URL);
  }
  return postgresSql;
}

function usesPostgres() {
  return Boolean(process.env.DATABASE_URL);
}

async function runSql(sql) {
  await execFileAsync("sqlite3", ["-cmd", "PRAGMA busy_timeout = 5000;", dbPath, sql], { maxBuffer: 10 * 1024 * 1024 });
}

async function runSqlJson(sql) {
  const { stdout } = await execFileAsync("sqlite3", ["-json", "-cmd", "PRAGMA busy_timeout = 5000;", dbPath, sql], { maxBuffer: 20 * 1024 * 1024 });
  return parseSqliteJson(stdout);
}

function runExclusiveSql(sql) {
  const task = sqliteQueue.then(() => runSql(sql));
  sqliteQueue = task.catch(() => {});
  return task;
}

function runExclusiveSqlJson(sql) {
  const task = sqliteQueue.then(() => runSqlJson(sql));
  sqliteQueue = task.catch(() => {});
  return task;
}

function waitForSqliteWrites() {
  return sqliteQueue.catch(() => {});
}

function parseSqliteJson(stdout) {
  const text = String(stdout || "").trim();
  if (!text) return [];

  try {
    return JSON.parse(text);
  } catch {
    const lastArrayIndex = text.lastIndexOf("\n[");
    const start = lastArrayIndex >= 0 ? lastArrayIndex + 1 : text.indexOf("[");
    if (start === -1) return [];
    return JSON.parse(text.slice(start));
  }
}

function sqlString(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function parseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

module.exports = { createRecord, listRecords, getRecord, ensureDatabase };
