import { writeFileSync } from "node:fs";
import { extractContentForLLM } from "../src/app/api/search/extraction/llm-extract";

async function main() {
  console.log(">> Extracting LLM data");
  const rootDir = process.cwd();
  try {
    const { llmContent, llmFullContent } = await extractContentForLLM(rootDir);
    writeFileSync("./public/llms.txt", llmContent);
    writeFileSync("./public/llms-full.txt", llmFullContent);
    console.log(">> LLM files saved successfully");
  } catch (e) {
    console.error("Failed to extract LLM data");
    console.error(e);
  }
}

main();
