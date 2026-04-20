const defaultModel = "nvidia/nemotron-3-super-120b-a12b:free";
const defaultBaseUrl = "https://openrouter.ai/api/v1";

function aiConfig() {
  return {
    apiKey: process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.SILICONFLOW_API_KEY || process.env.OPENAI_API_KEY || "",
    model: process.env.AI_MODEL || defaultModel,
    baseUrl: process.env.AI_API_BASE_URL || defaultBaseUrl,
  };
}

async function callAi({ model, input }) {
  const { apiKey, baseUrl } = aiConfig();
  if (!apiKey) {
    throw new Error("后端缺少 AI_API_KEY 或 OPENROUTER_API_KEY 环境变量。");
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://vercel.app",
      "X-Title": "Liu Yao Oracle",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "user", content: input },
      ],
    }),
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error?.message || `AI 平台请求失败：${response.status}`);
  }

  return data;
}

async function streamAi({ model, input, onText }) {
  const { apiKey, baseUrl } = aiConfig();
  if (!apiKey) {
    throw new Error("后端缺少 AI_API_KEY 或 OPENROUTER_API_KEY 环境变量。");
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://vercel.app",
      "X-Title": "Liu Yao Oracle",
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        { role: "user", content: input },
      ],
    }),
  });

  if (!response.ok || !response.body) {
    const text = await response.text();
    throw new Error(text || `AI 平台请求失败：${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(":") || !trimmed.startsWith("data:")) continue;

      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;

      const data = JSON.parse(payload);
      if (data.error) {
        throw new Error(data.error.message || "AI 平台请求失败。");
      }

      const text = extractStreamText(data);
      if (text) onText(text);
    }
  }
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

module.exports = { aiConfig, callAi, streamAi, extractResponseText };
