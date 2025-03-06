import { writeFileSync } from "node:fs";
import { extractContent } from "../src/app/api/search/extraction";

async function main() {
  const rootDir = process.cwd();
  const { searchData, llmContent, llmFullContent } =
    await extractContent(rootDir);
  writeFileSync("./searchIndex.json", JSON.stringify(searchData, null, 2));
  writeFileSync("./public/llms.txt", llmContent);
  writeFileSync("./public/llms-full.txt", llmFullContent);
}

main();
