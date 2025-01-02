import { encodePacked } from "viem";
import { keccak256 } from "../../hashing/keccak256.js";
import type { SnapshotEntryERC1155 } from "./types.js";

export async function hashEntryERC1155(options: {
  entry: SnapshotEntryERC1155;
}) {
  return keccak256(
    encodePacked(
      ["address", "uint256", "uint256"],
      [
        options.entry.recipient,
        BigInt(options.entry.tokenId),
        BigInt(options.entry.amount),
      ],
    ),
  );
}
