const { adminConfig, createAdminToken, adminCookie } = require("../../lib/auth");
const { readJson, sendJson, methodNotAllowed, handleError } = require("../../lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    methodNotAllowed(res);
    return;
  }

  try {
    const { password } = adminConfig();
    if (!password) {
      sendJson(res, 500, { error: "后台未配置 ADMIN_PASSWORD 环境变量。" });
      return;
    }

    const body = await readJson(req);
    if (String(body.password || "") !== password) {
      sendJson(res, 401, { error: "后台密码不正确。" });
      return;
    }

    sendJson(res, 200, { ok: true }, {
      "Set-Cookie": adminCookie(createAdminToken()),
    });
  } catch (error) {
    handleError(res, error);
  }
};
