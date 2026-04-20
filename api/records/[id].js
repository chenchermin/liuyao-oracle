const { isAdminAuthenticated } = require("../../lib/auth");
const { getRecord } = require("../../lib/records");
const { sendJson, methodNotAllowed, handleError } = require("../../lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    methodNotAllowed(res);
    return;
  }

  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "请先登录后台。" });
    return;
  }

  try {
    const id = Number(req.query?.id || req.url.split("/").pop());
    if (!Number.isInteger(id) || id <= 0) {
      sendJson(res, 400, { error: "记录 ID 无效。" });
      return;
    }

    const record = await getRecord(id);
    if (!record) {
      sendJson(res, 404, { error: "记录不存在。" });
      return;
    }

    sendJson(res, 200, { record });
  } catch (error) {
    handleError(res, error);
  }
};
