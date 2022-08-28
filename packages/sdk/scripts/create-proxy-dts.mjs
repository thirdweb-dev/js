import fs from "fs";

const content = `export * from "../src"`;

fs.writeFileSync("./dist/browser/index.d.ts", content);
fs.writeFileSync("./dist/node/index.d.ts", content);
