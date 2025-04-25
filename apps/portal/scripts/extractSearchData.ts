import { writeFileSync } from "node:fs";
import { extractContent } from "../src/app/api/search/extraction";

async function main() {
  const rootDir = process.cwd();
  const { searchData } = await extractContent(rootDir);
  writeFileSync("./searchIndex.json", JSON.stringify(searchData, null, 2));
}

main();
