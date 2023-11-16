import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { basename, join, resolve } from "path";

const main = () => {
  const sourceFolders = [];
  sourceFolders.push(resolve(
    "node_modules",
    "@thirdweb-dev/contracts/abi",
  ));
  sourceFolders.push(resolve(
    "external_abis",
  ));
  const destinationFolder = "./dist/abis";
  if (existsSync(destinationFolder)) {
    rmSync(destinationFolder, { recursive: true });
  }
  mkdirSync(destinationFolder);
  for(const libFolder of sourceFolders) {
  const abiFiles = readdirSync(libFolder);
  for (const abiFile of abiFiles) {
    const contractJsonFile = readFileSync(join(libFolder, abiFile), "utf-8");
    const contractJson = JSON.parse(contractJsonFile);
    const abi = contractJson.abi;
    writeFileSync(
      join(destinationFolder, basename(abiFile)),
      JSON.stringify(abi, null, 2),
    );
  }
 }
};

main();
