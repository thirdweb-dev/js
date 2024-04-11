import { encodePacked } from "viem";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import {
  NATIVE_TOKEN_ADDRESS,
  isNativeTokenAddress,
} from "../../../constants/addresses.js";

import { keccak256 } from "../../hashing/keccak256.js";
import { convertQuantity } from "./convert-quantity.js";
import type { AllowlistEntry } from "./types.js";

export async function hashEntry(options: {
  entry: AllowlistEntry;
  chain: Chain;
  client: ThirdwebClient;
}) {
  const currencyAddress = options.entry.currencyAddress || NATIVE_TOKEN_ADDRESS;
  const tokenDecimals = await (async () => {
    if (isNativeTokenAddress(currencyAddress)) {
      return 18;
    }
    const [{ getContract }, { decimals: getDecimals }] = await Promise.all([
      import("../../../contract/contract.js"),
      import("../../../exports/extensions/erc20.js"),
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
        options.entry.address,
        convertQuantity({
          quantity: options.entry.maxClaimable || "unlimited",
          tokenDecimals,
        }),
        convertQuantity({
          quantity: options.entry.price || "unlimited",
          tokenDecimals,
        }),
        currencyAddress,
      ],
    ),
  );
}
