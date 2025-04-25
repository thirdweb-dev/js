import { writeFileSync } from "node:fs";
import { extractContentForLLM } from "../src/app/api/search/extraction/llm-extract";

async function main() {
  const rootDir = process.cwd();
  const { llmContent, llmFullContent } = await extractContentForLLM(rootDir);
  writeFileSync("./public/llms.txt", llmContent);
  writeFileSync("./public/llms-full.txt", llmFullContent);
}

main();
