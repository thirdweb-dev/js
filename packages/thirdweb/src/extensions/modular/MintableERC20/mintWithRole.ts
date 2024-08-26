import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import {} from "../../../utils/date.js";
import { randomBytesHex } from "../../../utils/random.js";
import { mint as generatedMint } from "../__generated__/ERC20Core/write/mint.js";
import { encodeBytesBeforeMintERC20Params } from "../__generated__/MintableERC20/encode/encodeBytesBeforeMintERC20.js";

// TODO (modular) - this should be its own module

export type TokenMintParams = {
  to: string;
} & ({ quantity: string } | { quantityWei: bigint });

export function mintWithRole(options: BaseTransactionOptions<TokenMintParams>) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      let amount = 0n;

      // if the quantity is already passed in wei, use it
      if ("quantityWei" in options) {
        amount = options.quantityWei;
      } else if ("quantity" in options) {
        // otherwise convert the quantity to wei using the contract's OWN decimals
        const { convertErc20Amount } = await import(
          "../../../utils/extensions/convert-erc20-amount.js"
        );
        amount = await convertErc20Amount({
          amount: options.quantity,
          client: options.contract.client,
          chain: options.contract.chain,
          erc20Address: options.contract.address,
        });
      }

      const emptyPayload = {
        pricePerUnit: 0n,
        quantity: 0n,
        uid: randomBytesHex(),
        currency: ZERO_ADDRESS,
        recipient: ZERO_ADDRESS,
        startTimestamp: 0,
        endTimestamp: 0,
      };

      return {
        to: options.to,
        amount: BigInt(amount),
        data: encodeBytesBeforeMintERC20Params({
          params: {
            request: emptyPayload,
            signature: "0x",
          },
        }),
      };
    },
  });
}
