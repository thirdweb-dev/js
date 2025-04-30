import { writeFileSync } from "node:fs";
import { extractContent } from "../src/app/api/search/extraction";

async function main() {
  console.log(">> Extracting search data");
  const rootDir = process.cwd();
  try {
    const { searchData } = await extractContent(rootDir);
    writeFileSync("./searchIndex.json", JSON.stringify(searchData, null, 2));
    console.log(">> Search data saved successfully");
  } catch (e) {
    console.error("Failed to extract search data");
    console.error(e);
  }
}

main();
