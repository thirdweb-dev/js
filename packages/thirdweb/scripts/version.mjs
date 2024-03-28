/* eslint-disable better-tree-shaking/no-top-level-side-effects */
import { readFile, writeFile } from "node:fs/promises";

const packageVersion = JSON.parse(await readFile("./package.json")).version;

await writeFile(
  "./src/version.ts",
  `export const version = "${packageVersion}";\n`,
);
