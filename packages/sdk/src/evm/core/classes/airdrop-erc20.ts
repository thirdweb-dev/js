import type { AirdropERC20, IAirdropERC20 } from "@thirdweb-dev/contracts-js";
import { AirdropFailedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/AirdropERC1155";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_AIRDROP_ERC20 } from "../../constants/thirdweb-features";
import { Address } from "../../schema";
import { Airdrop20Content, Airdrop20Output } from "../../types";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";

/**
 * @public
 */
export class Airdrop20<T extends IAirdropERC20 | AirdropERC20>
  implements DetectableFeature
{
  featureName = FEATURE_AIRDROP_ERC20.name;
  protected contractWrapper: ContractWrapper<T>;

  constructor(contractWrapper: ContractWrapper<T>) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * @internal
   */
  getAddress(): Address {
    return this.contractWrapper.address;
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Perform airdrop of ERC20 tokens
   *
   * @example
   * ```javascript
   * // Airdrop content array, with recipients and token amounts
   * const contents = [
   *      {
   *        recipient: "0xabc...", // first recipient address
   *        amount: "10" // number of tokens in wei units
   *      },
   *      {
   *        recipient: "0x123...", // second recipient address
   *        amount: "20" // number of tokens in wei units
   *      }
   *   ]
   *
   * const tokenAddress = "0x..." // Address of the ERC20 token being airdropped
   * const tokenOwner = "0x..." // Address of the owner of the tokens being airdropped
   *
   * const output = await contract.airdrop20.drop(tokenAddress, tokenOwner, contents);
   *
   * // the `output` return value above contains:
   * //     - count of successful and failed drops
   * //     - array containing failed drops, if any
   *
   * ```
   * @param tokenAddress
   * @param tokenOwner
   * @param contents
   *
   * @returns an array of recipients for who the airdrop failed (empty means all transfers were successful)
   * @twfeature AirdropERC20
   */
  drop = /* @__PURE__ */ buildTransactionFunction(
    async (
      tokenAddress: string,
      tokenOwner: string,
      contents: Airdrop20Content[],
    ): Promise<Transaction<Airdrop20Output>> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "airdropERC20",
        args: [tokenAddress, tokenOwner, contents],
        parse: (receipt) => {
          const events = this.contractWrapper.parseLogs<AirdropFailedEvent>(
            "AirdropFailed",
            receipt.logs,
          );

          const failedDrops = events.map((e) => {
            return {
              recipient: e.args.recipient,
              amount: e.args.amount.toString(),
            };
          });

          return {
            successfulDropCount: contents.length - failedDrops.length,
            failedDropCount: failedDrops.length,
            failedDrops,
          };
        },
      });
    },
  );
}
