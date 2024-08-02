import { writeFileSync } from "fs";
import { extractSearchData } from "../src/app/api/search/extraction";

async function main() {
	const rootDir = process.cwd();
	const websiteData = await extractSearchData(rootDir);
	writeFileSync("./searchIndex.json", JSON.stringify(websiteData, null, 2));
}

main();
