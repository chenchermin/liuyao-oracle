const { aiConfig, callAi, streamAi, extractResponseText } = require("../lib/ai");
const { readJson, sendJson, methodNotAllowed, handleError } = require("../lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    methodNotAllowed(res);
    return;
  }

  try {
    const body = await readJson(req);
    const prompt = String(body.prompt || "").trim();
    if (!prompt) {
      sendJson(res, 400, { error: "缺少 prompt。" });
      return;
    }

    const model = body.model || aiConfig().model;
    if (body.stream) {
      await streamAnalyze(res, { model, prompt });
      return;
    }

    const data = await callAi({ model, input: prompt });
    sendJson(res, 200, { text: extractResponseText(data), raw: data });
  } catch (error) {
    handleError(res, error);
  }
};

async function streamAnalyze(res, { model, prompt }) {
  let started = false;

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "X-Content-Type-Options": "nosniff",
  });
  res.flushHeaders?.();
  res.socket?.setNoDelay?.(true);
  res.write("event: ready\ndata: {}\n\n");

  try {
    await streamAi({
      model,
      input: prompt,
      onText(text) {
        started = true;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      },
    });
    res.write("event: done\ndata: {}\n\n");
    res.end();
  } catch (error) {
    if (!started) {
      res.write(`event: error\ndata: ${JSON.stringify({ error: error.message || "AI 平台请求失败。" })}\n\n`);
    }
    res.end();
  }
}
