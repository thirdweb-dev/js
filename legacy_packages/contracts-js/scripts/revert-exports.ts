import {  readFile, writeFile } from "node:fs/promises";

const pkgJson = JSON.parse(await readFile('./package.json', "utf-8"));

// for each path add to the `exports` field in `package.json`
const pkgExports = pkgJson.exports || {};
Object.keys(pkgExports).forEach(key => {
  if(key.endsWith(".json") && key !== './package.json'){
    delete pkgExports[key];
  }
})
pkgJson.exports = pkgExports;
// write the updated `package.json` to disk

await writeFile('./package.json', JSON.stringify(pkgJson, null, 2), "utf-8");