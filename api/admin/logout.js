const { clearAdminCookie } = require("../../lib/auth");
const { sendJson, methodNotAllowed } = require("../../lib/http");

module.exports = function handler(req, res) {
  if (req.method !== "POST") {
    methodNotAllowed(res);
    return;
  }

  sendJson(res, 200, { ok: true }, {
    "Set-Cookie": clearAdminCookie(),
  });
};
