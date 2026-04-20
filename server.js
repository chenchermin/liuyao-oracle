const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { execFile } = require("child_process");
const { promisify } = require("util");
const { callOpenAIWithCurl, streamOpenAIWithCurl, extractResponseText } = require("./openai-curl");

const root = __dirname;
loadEnvFile(path.join(root, ".env"));

const execFileAsync = promisify(execFile);
const port = Number(process.env.PORT || 3000);
const model = process.env.AI_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";
const baseUrl = process.env.AI_API_BASE_URL || "https://openrouter.ai/api/v1";
const dbPath = path.join(root, "data", "readings.db");
const adminPassword = process.env.ADMIN_PASSWORD || "";
const adminSecret = process.env.ADMIN_SESSION_SECRET || adminPassword || "local-admin-secret";
const adminSessionMaxAge = 7 * 24 * 60 * 60;
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/admin/login") {
      await handleAdminLogin(req, res);
      return;
    }

    if (req.method === "POST" && req.url === "/api/admin/logout") {
      handleAdminLogout(res);
      return;
    }

    if (req.method === "GET" && req.url === "/api/admin/session") {
      sendJson(res, 200, { authenticated: isAdminAuthenticated(req), configured: Boolean(adminPassword) });
      return;
    }

    if (req.method === "POST" && req.url === "/api/analyze") {
      await handleAnalyze(req, res);
      return;
    }

    if (req.method === "POST" && req.url === "/api/public/records") {
      await handleCreateRecord(req, res);
      return;
    }

    if (req.method === "POST" && req.url === "/api/records") {
      if (!requireAdmin(req, res)) return;
      await handleCreateRecord(req, res);
      return;
    }

    if (req.method === "GET" && req.url === "/api/records") {
      if (!requireAdmin(req, res)) return;
      await handleListRecords(res);
      return;
    }

    if (req.method === "GET" && req.url.startsWith("/api/records/")) {
      if (!requireAdmin(req, res)) return;
      await handleGetRecord(req, res);
      return;
    }

    if (req.method === "GET") {
      await serveStatic(req, res);
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
});

server.listen(port, () => {
  console.log(`六爻页面已启动：http://localhost:${port}`);
});

const databaseReady = initDatabase();

async function handleAdminLogin(req, res) {
  if (!adminPassword) {
    sendJson(res, 500, { error: "后台未配置 ADMIN_PASSWORD 环境变量。" });
    return;
  }

  const body = await readJson(req);
  if (String(body.password || "") !== adminPassword) {
    sendJson(res, 401, { error: "后台密码不正确。" });
    return;
  }

  const token = createAdminToken();
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Set-Cookie": `admin_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${adminSessionMaxAge}`,
  });
  res.end(JSON.stringify({ ok: true }));
}

function handleAdminLogout(res) {
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Set-Cookie": "admin_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
  });
  res.end(JSON.stringify({ ok: true }));
}

function requireAdmin(req, res) {
  if (isAdminAuthenticated(req)) return true;
  sendJson(res, 401, { error: "请先登录后台。" });
  return false;
}

function isAdminAuthenticated(req) {
  if (!adminPassword) return false;
  const token = parseCookies(req.headers.cookie || "").admin_session;
  if (!token) return false;

  const [timestamp, signature] = token.split(".");
  const issuedAt = Number(timestamp);
  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > adminSessionMaxAge * 1000) return false;

  const expected = signAdminSession(timestamp);
  return timingSafeEqual(signature, expected);
}

function createAdminToken() {
  const timestamp = String(Date.now());
  return `${timestamp}.${signAdminSession(timestamp)}`;
}

function signAdminSession(value) {
  return crypto.createHmac("sha256", adminSecret).update(value).digest("hex");
}

function timingSafeEqual(left, right) {
  if (!left || !right) return false;
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function parseCookies(cookieHeader) {
  return cookieHeader.split(";").reduce((cookies, item) => {
    const separatorIndex = item.indexOf("=");
    if (separatorIndex === -1) return cookies;
    const key = item.slice(0, separatorIndex).trim();
    const value = item.slice(separatorIndex + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});
}

async function handleAnalyze(req, res) {
  const apiKey = process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.SILICONFLOW_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, { error: "后端缺少 AI_API_KEY 或 OPENROUTER_API_KEY 环境变量。" });
    return;
  }

  const body = await readJson(req);
  const prompt = String(body.prompt || "").trim();
  if (!prompt) {
    sendJson(res, 400, { error: "缺少 prompt。" });
    return;
  }

  if (body.stream) {
    await streamAnalyze(res, { apiKey, model: body.model || model, prompt });
    return;
  }

  const data = await callOpenAIWithCurl({ apiKey, model: body.model || model, input: prompt, baseUrl });
  sendJson(res, 200, { text: extractResponseText(data), raw: data });
}

async function streamAnalyze(res, { apiKey, model, prompt }) {
  let started = false;

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "X-Content-Type-Options": "nosniff",
  });
  res.flushHeaders?.();
  res.socket?.setNoDelay?.(true);
  res.write("event: ready\ndata: {}\n\n");

  try {
    await streamOpenAIWithCurl({
      apiKey,
      model,
      input: prompt,
      baseUrl,
      onText(text) {
        started = true;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      },
    });
    res.write("event: done\ndata: {}\n\n");
    res.end();
  } catch (error) {
    if (!started) {
      res.write(`event: error\ndata: ${JSON.stringify({ error: error.message || "AI 平台请求失败。" })}\n\n`);
    }
    res.end();
  }
}

async function handleCreateRecord(req, res) {
  const body = await readJson(req);
  const record = normalizeRecord(body);

  await databaseReady;
  const sql = `
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
  `;
  const rows = await runSqlJson(sql);
  sendJson(res, 201, { id: rows[0]?.id || null });
}

async function handleListRecords(res) {
  await databaseReady;
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
      status,
      error
    FROM readings
    ORDER BY id DESC
    LIMIT 300;
  `);
  sendJson(res, 200, { records: rows });
}

async function handleGetRecord(req, res) {
  const id = Number(req.url.split("/").pop());
  if (!Number.isInteger(id) || id <= 0) {
    sendJson(res, 400, { error: "记录 ID 无效。" });
    return;
  }

  await databaseReady;
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

  if (!rows.length) {
    sendJson(res, 404, { error: "记录不存在。" });
    return;
  }

  const record = rows[0];
  record.lines = parseJson(record.linesJson, []);
  record.castData = parseJson(record.castJson, null);
  delete record.linesJson;
  delete record.castJson;
  sendJson(res, 200, { record });
}

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

async function initDatabase() {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await runSql(`
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

async function runSql(sql) {
  await execFileAsync("sqlite3", [dbPath, sql], { maxBuffer: 10 * 1024 * 1024 });
}

async function runSqlJson(sql) {
  const { stdout } = await execFileAsync("sqlite3", ["-json", dbPath, sql], { maxBuffer: 20 * 1024 * 1024 });
  return stdout.trim() ? JSON.parse(stdout) : [];
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

async function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
  const safePath = path.normalize(urlPath === "/" ? "/index.html" : urlPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (isAdminAsset(urlPath) && !isAdminAuthenticated(req)) {
    if (urlPath === "/admin.html") {
      res.writeHead(302, { Location: "/admin-login.html" });
      res.end();
      return;
    }

    res.writeHead(401, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("请先登录后台。");
    return;
  }

  try {
    const content = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    res.end(content);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

function isAdminAsset(urlPath) {
  return ["/admin.html", "/admin.js", "/admin.css"].includes(urlPath);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy(new Error("请求体过大。"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("JSON 格式错误。"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function loadEnvFile(filePath) {
  let content = "";
  try {
    content = require("fs").readFileSync(filePath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`读取 .env 失败：${error.message}`);
    }
    return;
  }

  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (!key || process.env[key] !== undefined) return;

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
}
