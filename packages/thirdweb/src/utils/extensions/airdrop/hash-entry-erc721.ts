import { encodePacked } from "viem";
import { keccak256 } from "../../hashing/keccak256.js";
import type { SnapshotEntryERC721 } from "./types.js";

export async function hashEntryERC721(options: { entry: SnapshotEntryERC721 }) {
  return keccak256(
    encodePacked(
      ["address", "uint256"],
      [options.entry.recipient, BigInt(options.entry.tokenId)],
    ),
  );
}
