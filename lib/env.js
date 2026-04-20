const fs = require("fs");
const path = require("path");

function loadEnvFile(filePath = path.join(process.cwd(), ".env")) {
  let content = "";
  try {
    content = fs.readFileSync(filePath, "utf8");
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

module.exports = { loadEnvFile };
