const { isAdminAuthenticated } = require("../../lib/auth");
const { createRecord, listRecords } = require("../../lib/records");
const { readJson, sendJson, methodNotAllowed, handleError } = require("../../lib/http");

module.exports = async function handler(req, res) {
  if (!isAdminAuthenticated(req)) {
    sendJson(res, 401, { error: "请先登录后台。" });
    return;
  }

  try {
    if (req.method === "GET") {
      sendJson(res, 200, { records: await listRecords() });
      return;
    }

    if (req.method === "POST") {
      const body = await readJson(req);
      sendJson(res, 201, await createRecord(body));
      return;
    }

    methodNotAllowed(res);
  } catch (error) {
    handleError(res, error);
  }
};
