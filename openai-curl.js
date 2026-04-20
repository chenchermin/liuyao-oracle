const { spawn } = require("child_process");

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

function extractResponseText(data) {
  if (data.output_text) return data.output_text;
  if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
  return data.output
    ?.flatMap((item) => item.content || [])
    .map((part) => part.text || "")
    .filter(Boolean)
    .join("\n") || "";
}

module.exports = { callOpenAIWithCurl, extractResponseText };
