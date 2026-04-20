const model = process.env.AI_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";
const apiKey = process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.SILICONFLOW_API_KEY || process.env.OPENAI_API_KEY;
const baseUrl = process.env.AI_API_BASE_URL || "https://openrouter.ai/api/v1";
const { callOpenAIWithCurl, extractResponseText } = require("./openai-curl");

if (!apiKey) {
  console.error("缺少 AI_API_KEY 或 OPENROUTER_API_KEY 环境变量。");
  process.exit(1);
}

async function main() {
  const data = await callOpenAIWithCurl({
    apiKey,
    model,
    baseUrl,
    input: "请用一句中文回复：OpenAI API 请求测试成功。",
  });
  const text = extractResponseText(data);

  console.log(text || "请求成功，但没有解析到文本。");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
