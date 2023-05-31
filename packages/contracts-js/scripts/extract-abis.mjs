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
  const libFolder = resolve(
    "node_modules",
    "@thirdweb-dev/contracts/abi",
  );
  const destinationFolder = "./dist/abis";
  if (existsSync(destinationFolder)) {
    rmSync(destinationFolder, { recursive: true });
  }
  mkdirSync(destinationFolder);
  const abiFiles = readdirSync(libFolder);
  for (const abiFile of abiFiles) {
    const contractJsonFile = readFileSync(join(libFolder, abiFile), "utf-8");
    const contractJson = JSON.parse(contractJsonFile);
    const abi = contractJson.abi;

    const content = JSON.stringify(abi, null, 2);

    // for backward compatibility
    writeFileSync(
      join(destinationFolder, basename(abiFile)),
      content,
    );

    writeFileSync(
      join(destinationFolder, basename(abiFile).replace('.json', '.js')),
      `module.exports = ${content}`,
    );
  }
};

main();
