import { encodePacked } from "viem";
import { keccak256 } from "../../hashing/keccak256.js";
import { toUnits } from "../../units.js";
import type { SnapshotEntryERC20 } from "./types.js";

export async function hashEntryERC20(options: {
  entry: SnapshotEntryERC20;
  tokenDecimals?: number;
}) {
  const decimals = options.tokenDecimals || 18;

  return keccak256(
    encodePacked(
      ["address", "uint256"],
      [
        options.entry.recipient,
        convertQuantity({
          quantity: options.entry.amount.toString(),
          tokenDecimals: decimals,
        }),
      ],
    ),
  );
}

function convertQuantity(options: { quantity: string; tokenDecimals: number }) {
  const { quantity, tokenDecimals } = options;
  return toUnits(quantity, tokenDecimals);
}
