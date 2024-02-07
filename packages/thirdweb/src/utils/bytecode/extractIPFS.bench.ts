import { describe, bench } from "vitest";

import { extractIPFSUri } from "./extractIPFS.js";
import { extractIPFSHashFromBytecode } from "@thirdweb-dev/sdk";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// load up the bytecode for the doodles contract
const doodlesBytecode = readFileSync(
  resolve(__dirname, "../../../test/src/bytecode/doodles.bytecode"),
  "utf-8",
);

describe("extracting IPFS hash from bytecode", () => {
  bench("thirdweb: extractIPFSUri", () => {
    extractIPFSUri(doodlesBytecode);
  });

  bench("@thirdweb-dev/sdk: extractIPFSHashFromBytecode", () => {
    extractIPFSHashFromBytecode(doodlesBytecode);
  });
});
