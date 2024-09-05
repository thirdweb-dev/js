import fs from "node:fs";
import { formatAbi } from "abitype";

const contract = "ClaimableERC1155";

const file = JSON.parse(
  fs.readFileSync(
    `../../../modular-contracts/out/${contract}.sol/${contract}.json`,
    "utf-8",
  ),
);
const parsed = formatAbi(file.abi);

console.log(parsed);
