const { adminConfig, isAdminAuthenticated } = require("../../lib/auth");
const { sendJson, methodNotAllowed } = require("../../lib/http");

module.exports = function handler(req, res) {
  if (req.method !== "GET") {
    methodNotAllowed(res);
    return;
  }

  sendJson(res, 200, {
    authenticated: isAdminAuthenticated(req),
    configured: Boolean(adminConfig().password),
  });
};
