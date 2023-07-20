import { AirdropFailedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/AirdropERC1155";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_AIRDROP_ERC1155 } from "../../constants/thirdweb-features";
import { Address } from "../../schema";
import { Airdrop1155Content } from "../../types";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
import type {
  AirdropERC1155,
  IAirdropERC1155,
} from "@thirdweb-dev/contracts-js";

/**
 * @public
 */
export class Airdrop1155<T extends IAirdropERC1155 | AirdropERC1155>
  implements DetectableFeature
{
  featureName = FEATURE_AIRDROP_ERC1155.name;
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
    async (tokenAddress: string, tokenOwner: string, contents: Airdrop1155Content[]): Promise<Transaction<{recipient: string}[]>> => {
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
