const { createRecord } = require("../../lib/records");
const { readJson, sendJson, methodNotAllowed, handleError } = require("../../lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    methodNotAllowed(res);
    return;
  }

  try {
    const body = await readJson(req);
    const result = await createRecord(body);
    sendJson(res, 201, result);
  } catch (error) {
    handleError(res, error);
  }
};
