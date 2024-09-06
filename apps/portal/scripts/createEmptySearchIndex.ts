import { existsSync, writeFileSync } from "node:fs";

// This is required to load the searchIndex.json on vercel server
// searchIndex.json needs to exist in file system before we run `next build`

const file = "./searchIndex.json";
if (!existsSync(file)) {
  writeFileSync(file, "[]");
}
