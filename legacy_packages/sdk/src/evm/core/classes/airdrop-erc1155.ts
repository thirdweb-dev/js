import type {
  AirdropERC1155,
  IAirdropERC1155,
} from "@thirdweb-dev/contracts-js";
import { AirdropFailedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/AirdropERC1155";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_AIRDROP_ERC1155 } from "../../constants/thirdweb-features";
import { Address } from "../../schema/shared/Address";
import {
  Airdrop1155Content,
  Airdrop1155Output,
} from "../../types/airdrop/airdrop";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./internal/contract-wrapper";
import { Transaction } from "./transactions";

/**
 * @public
 */
export class Airdrop1155<T extends IAirdropERC1155 | AirdropERC1155>
  implements DetectableFeature
{
  featureName = FEATURE_AIRDROP_ERC1155.name;
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
   * Perform airdrop of ERC1155 tokens
   *
   * @example
   * ```javascript
   * // Airdrop content array, with recipients and tokenIds
   * const contents = [
   *      {
   *        recipient: "0xabc...", // first recipient address
   *        tokenId: 0,
   *        amount: "10" // number of tokens
   *      },
   *      {
   *        recipient: "0x123...", // second recipient address
   *        tokenId: 0
   *        amount: "20" // number of tokens
   *      }
   *   ]
   *
   * const tokenAddress = "0x..." // Address of the ERC1155 token being airdropped
   * const tokenOwner = "0x..." // Address of the owner of the tokens being airdropped
   *
   * const output = await contract.airdrop1155.drop(tokenAddress, tokenOwner, contents);
   *
   * // the `output` return value above contains:
   * //     - count of successful and failed drops
   * //     - array containing failed drops, if any
   *
   * ```
   * @param tokenAddress - Address of the ERC1155 token being airdropped
   * @param tokenOwner - Address of the owner of the tokens being airdropped
   * @param contents - Array of recipients and tokenIds to airdrop
   *
   * @returns An array of recipients for who the airdrop failed (empty means all transfers were successful)
   * @twfeature AirdropERC1155
   */
  drop = /* @__PURE__ */ buildTransactionFunction(
    async (
      tokenAddress: string,
      tokenOwner: string,
      contents: Airdrop1155Content[],
    ): Promise<Transaction<Airdrop1155Output>> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "airdropERC1155",
        args: [tokenAddress, tokenOwner, contents],
        parse: (receipt) => {
          const events = this.contractWrapper.parseLogs<AirdropFailedEvent>(
            "AirdropFailed",
            receipt.logs,
          );

          const failedDrops = events.map((e) => {
            return {
              recipient: e.args.recipient,
              tokenId: e.args.tokenId.toNumber(),
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
