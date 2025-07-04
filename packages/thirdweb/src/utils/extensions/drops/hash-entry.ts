import { encodePacked } from "viem";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import {
  isNativeTokenAddress,
  ZERO_ADDRESS,
} from "../../../constants/addresses.js";
import { getAddress } from "../../address.js";
import { keccak256 } from "../../hashing/keccak256.js";
import { convertQuantity } from "./convert-quantity.js";
import type { OverrideEntry } from "./types.js";

export async function hashEntry(options: {
  entry: OverrideEntry;
  chain: Chain;
  client: ThirdwebClient;
  tokenDecimals: number;
}) {
  const currencyAddress = options.entry.currencyAddress || ZERO_ADDRESS;
  const currencyDecimals = await (async () => {
    if (
      isNativeTokenAddress(currencyAddress) ||
      currencyAddress === ZERO_ADDRESS
    ) {
      return 18;
    }
    const [{ getContract }, { decimals: getDecimals }] = await Promise.all([
      import("../../../contract/contract.js"),
      import("../../../extensions/erc20/read/decimals.js"),
    ]);
    const currencyContract = getContract({
      address: currencyAddress,
      chain: options.chain,
      client: options.client,
    });
    return await getDecimals({ contract: currencyContract });
  })();

  return keccak256(
    encodePacked(
      ["address", "uint256", "uint256", "address"],
      [
        getAddress(options.entry.address),
        convertQuantity({
          quantity: options.entry.maxClaimable || "unlimited",
          tokenDecimals: options.tokenDecimals,
        }),
        convertQuantity({
          quantity: options.entry.price || "unlimited",
          tokenDecimals: currencyDecimals,
        }),
        getAddress(currencyAddress),
      ],
    ),
  );
}
