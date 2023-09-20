import type { AirdropERC721, IAirdropERC721 } from "@thirdweb-dev/contracts-js";
import { AirdropFailedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/AirdropERC1155";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_AIRDROP_ERC721 } from "../../constants/thirdweb-features";
import { Address } from "../../schema";
import { Airdrop721Content, Airdrop721Output } from "../../types";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";

/**
 * @public
 */
export class Airdrop721<T extends IAirdropERC721 | AirdropERC721>
  implements DetectableFeature
{
  featureName = FEATURE_AIRDROP_ERC721.name;
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
   * Perform airdrop of ERC721 tokens
   *
   * @example
   * ```javascript
   * // Airdrop content array, with recipients and tokenIds
   * const contents = [
   *      {
   *        recipient: "0xabc...", // first recipient address
   *        tokenId: 0
   *      },
   *      {
   *        recipient: "0x123...", // second recipient address
   *        tokenId: 2
   *      }
   *   ]
   *
   * const tokenAddress = "0x..." // Address of the ERC721 token being airdropped
   * const tokenOwner = "0x..." // Address of the owner of the tokens being airdropped
   *
   * const output = await contract.airdrop721.drop(tokenAddress, tokenOwner, contents);
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
   * @twfeature AirdropERC721
   */
  drop = /* @__PURE__ */ buildTransactionFunction(
    async (
      tokenAddress: string,
      tokenOwner: string,
      contents: Airdrop721Content[],
    ): Promise<Transaction<Airdrop721Output>> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "airdropERC721",
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
