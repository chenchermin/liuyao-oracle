const adminSessionMaxAge = 7 * 24 * 60 * 60 * 1000;

async function middleware(request) {
  if (await isAdminAuthenticated(request)) {
    return;
  }

  const url = new URL(request.url);
  if (url.pathname === "/admin.html") {
    return Response.redirect(new URL("/admin-login.html", request.url), 302);
  }

  return new Response("请先登录后台。", {
    status: 401,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

async function isAdminAuthenticated(request) {
  const password = process.env.ADMIN_PASSWORD || "";
  if (!password) return false;

  const token = parseCookies(request.headers.get("cookie") || "").admin_session;
  if (!token) return false;

  const [timestamp, signature] = token.split(".");
  const issuedAt = Number(timestamp);
  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > adminSessionMaxAge) return false;

  return signature === await signAdminSession(timestamp);
}

async function signAdminSession(value) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "local-admin-secret";
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
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

module.exports = middleware;
module.exports.config = {
  matcher: ["/admin.html", "/admin.js", "/admin.css"],
};
