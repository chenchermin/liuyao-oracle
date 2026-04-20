const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const { loadEnvFile } = require("./lib/env");
const { isAdminAuthenticated } = require("./lib/auth");
const analyze = require("./api/analyze");
const adminLogin = require("./api/admin/login");
const adminLogout = require("./api/admin/logout");
const adminSession = require("./api/admin/session");
const publicRecords = require("./api/public/records");
const recordsIndex = require("./api/records");
const recordById = require("./api/records/[id]");

loadEnvFile(path.join(__dirname, ".env"));

const root = __dirname;
const publicRoot = path.join(root, "public");
const port = Number(process.env.PORT || 3000);
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
};

const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
    req.query = Object.fromEntries(new URL(req.url, `http://localhost:${port}`).searchParams.entries());

    if (pathname === "/api/analyze") return analyze(req, res);
    if (pathname === "/api/admin/login") return adminLogin(req, res);
    if (pathname === "/api/admin/logout") return adminLogout(req, res);
    if (pathname === "/api/admin/session") return adminSession(req, res);
    if (pathname === "/api/public/records") return publicRecords(req, res);
    if (pathname === "/api/records") return recordsIndex(req, res);
    if (pathname.startsWith("/api/records/")) return recordById(req, res);

    if (req.method === "GET") {
      await serveStatic(req, res, pathname);
      return;
    }

    res.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: error.message || "Internal server error" }));
  }
});

server.listen(port, () => {
  console.log(`六爻页面已启动：http://localhost:${port}`);
});

async function serveStatic(req, res, urlPath) {
  const safePath = path.normalize(urlPath === "/" ? "/index.html" : urlPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(publicRoot, safePath);

  if (!filePath.startsWith(publicRoot)) {
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
