function sendJson(res, status, data, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...headers });
  res.end(JSON.stringify(data));
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

function methodNotAllowed(res) {
  sendJson(res, 405, { error: "Method not allowed" });
}

function handleError(res, error) {
  sendJson(res, 500, { error: error.message || "Internal server error" });
}

module.exports = { sendJson, readJson, methodNotAllowed, handleError };
