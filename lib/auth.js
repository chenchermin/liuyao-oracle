const crypto = require("crypto");

const adminSessionMaxAge = 7 * 24 * 60 * 60;

function adminConfig() {
  const password = process.env.ADMIN_PASSWORD || "";
  return {
    password,
    secret: process.env.ADMIN_SESSION_SECRET || password || "local-admin-secret",
  };
}

function createAdminToken() {
  const timestamp = String(Date.now());
  return `${timestamp}.${signAdminSession(timestamp)}`;
}

function isAdminAuthenticated(req) {
  const { password } = adminConfig();
  if (!password) return false;

  const token = parseCookies(req.headers.cookie || "").admin_session;
  if (!token) return false;

  const [timestamp, signature] = token.split(".");
  const issuedAt = Number(timestamp);
  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > adminSessionMaxAge * 1000) return false;

  return timingSafeEqual(signature, signAdminSession(timestamp));
}

function adminCookie(token) {
  return `admin_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${adminSessionMaxAge}`;
}

function clearAdminCookie() {
  return "admin_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0";
}

function signAdminSession(value) {
  const { secret } = adminConfig();
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
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

module.exports = {
  adminSessionMaxAge,
  adminConfig,
  createAdminToken,
  isAdminAuthenticated,
  adminCookie,
  clearAdminCookie,
};
