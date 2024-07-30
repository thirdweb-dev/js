import {
  NATIVE_TOKEN_ADDRESS,
  ZERO_ADDRESS,
} from "../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import { stringToHex } from "../../../utils/encoding/hex.js";
import { randomBytesHex } from "../../../utils/random.js";
import { toWei } from "../../../utils/units.js";
import { encodeEncodeBytesBeforeMintERC20Params } from "../__generated__/ClaimableERC20/read/encodeBytesBeforeMintERC20.js";
import { setClaimCondition } from "../__generated__/ClaimableERC20/write/setClaimCondition.js";
import { mint as generatedMint } from "../__generated__/ERC20Core/write/mint.js";

export type TokenClaimParams = {
  to: string;
  // TODO (modular) add signature claiming
} & ({ quantity: string } | { quantityWei: bigint });

export function claimTo(options: BaseTransactionOptions<TokenClaimParams>) {
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
        startTimestamp: 0,
        endTimestamp: 0,
        recipient: ZERO_ADDRESS,
      };

      return {
        to: options.to,
        amount,
        data: encodeEncodeBytesBeforeMintERC20Params({
          params: {
            request: emptyPayload,
            signature: "0x",
            currency: NATIVE_TOKEN_ADDRESS,
            pricePerUnit: 0n,
            recipientAllowlistProof: [],
          },
        }),
      };
    },
  });
}

export function setClaimConditions(options: BaseTransactionOptions) {
  // TODO (modular) implement
  return setClaimCondition({
    contract: options.contract,
    asyncParams: async () => {
      return {
        claimCondition: {
          startTimestamp: Number(dateToSeconds(new Date())),
          endTimestamp: Number(dateToSeconds(tenYearsFromNow())),
          pricePerUnit: 0n,
          currency: NATIVE_TOKEN_ADDRESS,
          availableSupply: toWei("1000"),
          allowlistMerkleRoot: stringToHex("", { size: 32 }),
          auxData: "",
        },
      };
    },
  });
}
