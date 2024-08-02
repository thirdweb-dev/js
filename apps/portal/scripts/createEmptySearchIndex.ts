import { existsSync, writeFileSync } from "fs";

// This is required to load the searchIndex.json on vercel server
// searchIndex.json needs to exist in file system before we run `next build`

async function main() {
	if (!existsSync("./searchIndex.json")) {
		writeFileSync("./searchIndex.json", `[]`);
	}
}

main();
