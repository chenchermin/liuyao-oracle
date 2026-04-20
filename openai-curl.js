const { spawn } = require("child_process");
const { StringDecoder } = require("string_decoder");

function callOpenAIWithCurl({ apiKey, model, input, baseUrl }) {
  const endpoint = `${String(baseUrl || "https://openrouter.ai/api/v1").replace(/\/$/, "")}/chat/completions`;
  return new Promise((resolve, reject) => {
    const curl = spawn("curl", [
      "-sS",
      endpoint,
      "-H",
      "Content-Type: application/json",
      "-H",
      `Authorization: Bearer ${apiKey}`,
      "-H",
      "HTTP-Referer: http://localhost:3000",
      "-H",
      "X-Title: Liu Yao Oracle",
      "-d",
      JSON.stringify({
        model,
        messages: [
          { role: "user", content: input },
        ],
      }),
    ]);

    let stdout = "";
    let stderr = "";
    curl.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    curl.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    curl.on("error", reject);
    curl.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `curl exited with code ${code}`));
        return;
      }

      try {
        const data = JSON.parse(stdout);
        if (data.error) {
          reject(new Error(data.error.message || "AI 平台请求失败。"));
          return;
        }
        resolve(data);
      } catch {
        reject(new Error(stdout || stderr || "AI 平台响应不是 JSON。"));
      }
    });
  });
}

function streamOpenAIWithCurl({ apiKey, model, input, baseUrl, onText }) {
  const endpoint = `${String(baseUrl || "https://openrouter.ai/api/v1").replace(/\/$/, "")}/chat/completions`;
  const curl = spawn("curl", [
    "-sS",
    "-N",
    endpoint,
    "-H",
    "Content-Type: application/json",
    "-H",
    `Authorization: Bearer ${apiKey}`,
    "-H",
    "HTTP-Referer: http://localhost:3000",
    "-H",
    "X-Title: Liu Yao Oracle",
    "-d",
    JSON.stringify({
      model,
      stream: true,
      messages: [
        { role: "user", content: input },
      ],
    }),
  ]);

  let buffer = "";
  let stderr = "";
  let providerError = "";
  const stdoutDecoder = new StringDecoder("utf8");
  const stderrDecoder = new StringDecoder("utf8");

  const processStreamText = (text) => {
    buffer += text;
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || "";

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(":")) return;
      if (!trimmed.startsWith("data:")) return;

      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") return;

      try {
        const data = JSON.parse(payload);
        if (data.error) {
          providerError = data.error.message || "AI 平台请求失败。";
          return;
        }

        const text = extractStreamText(data);
        if (text) onText(text);
      } catch (error) {
        providerError = error.message || "AI 平台流式响应解析失败。";
      }
    });
  };

  curl.stdout.on("data", (chunk) => {
    processStreamText(stdoutDecoder.write(chunk));
  });

  curl.stderr.on("data", (chunk) => {
    stderr += stderrDecoder.write(chunk);
  });

  return new Promise((resolve, reject) => {
    curl.on("error", reject);
    curl.on("close", (code) => {
      const finalOutput = stdoutDecoder.end();
      if (finalOutput) processStreamText(`${finalOutput}\n`);
      stderr += stderrDecoder.end();

      if (providerError) {
        reject(new Error(providerError));
        return;
      }

      if (code !== 0) {
        reject(new Error(stderr || `curl exited with code ${code}`));
        return;
      }

      resolve();
    });
  });
}

function extractStreamText(data) {
  const delta = data.choices?.[0]?.delta;
  if (typeof delta?.content === "string") return delta.content;
  if (Array.isArray(delta?.content)) {
    return delta.content.map((part) => part.text || part.content || "").join("");
  }
  if (typeof data.output_text === "string") return data.output_text;
  return "";
}

function extractResponseText(data) {
  if (data.output_text) return data.output_text;
  if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
  return data.output
    ?.flatMap((item) => item.content || [])
    .map((part) => part.text || "")
    .filter(Boolean)
    .join("\n") || "";
}

module.exports = { callOpenAIWithCurl, streamOpenAIWithCurl, extractResponseText };
