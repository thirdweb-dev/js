import { AirdropFailedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/AirdropERC1155";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_AIRDROP_ERC721 } from "../../constants/thirdweb-features";
import { Address } from "../../schema";
import { Airdrop721Content } from "../../types";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
import type {
  AirdropERC721,
  IAirdropERC721,
} from "@thirdweb-dev/contracts-js";

/**
 * @public
 */
export class Airdrop721<T extends IAirdropERC721 | AirdropERC721>
  implements DetectableFeature
{
  featureName = FEATURE_AIRDROP_ERC721.name;
  protected contractWrapper: ContractWrapper<T>;

  constructor(
    contractWrapper: ContractWrapper<T>,
  ) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * @internal
   */
  getAddress(): Address {
    return this.contractWrapper.readContract.address;
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  drop = /* @__PURE__ */ buildTransactionFunction(
    async (tokenAddress: string, tokenOwner: string, contents: Airdrop721Content[]): Promise<Transaction<{recipient: string}[]>> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "airdrop",
        args: [tokenAddress, tokenOwner, contents],
        parse: (receipt) => {
          const events = this.contractWrapper.parseLogs<AirdropFailedEvent>(
            "AirdropFailed",
            receipt.logs,
          );
          return events.map((e) => {
            const recipient = e.args.recipient;
            return {
              recipient,
            };
          });
        },
      });
    },
  );
}
