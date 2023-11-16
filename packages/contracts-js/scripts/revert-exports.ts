
import {resolve} from "node:path";
import { readdir, readFile, writeFile } from "node:fs/promises";


// enumerate all files in `dist/abis/*.json`
async function getPaths() {
  
  const dir = resolve(__dirname, '../dist/abis');
  const paths = await readdir(dir);
  const jsonPaths = paths.filter(p => p.endsWith('.json'));
  return jsonPaths.map(p => `./dist/abis/${p}`);
}


const [paths, pkg] = await Promise.all([getPaths(), readFile('./package.json', "utf-8")]);

const pkgJson = JSON.parse(pkg);

// for each path add to the `exports` field in `package.json`
const pkgExports = pkgJson.exports || {};
for(const path of paths){
  delete pkgExports[path];
}
pkgJson.exports = pkgExports;
// write the updated `package.json` to disk

await writeFile('./package.json', JSON.stringify(pkgJson, null, 2), "utf-8");