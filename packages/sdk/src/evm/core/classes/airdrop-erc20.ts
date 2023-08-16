import { AirdropFailedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/AirdropERC1155";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_AIRDROP_ERC20 } from "../../constants/thirdweb-features";
import { Address } from "../../schema";
import { Airdrop20Content } from "../../types";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
import type { IAirdropERC20, AirdropERC20 } from "@thirdweb-dev/contracts-js";

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
    return this.contractWrapper.readContract.address;
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  drop = /* @__PURE__ */ buildTransactionFunction(
    async (
      tokenAddress: string,
      tokenOwner: string,
      contents: Airdrop20Content[],
    ): Promise<Transaction<{ failedRecipient: string; amount: string }[]>> => {
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
            return {
              failedRecipient: e.args.recipient,
              amount: e.args.amount.toString(),
            };
          });
        },
      });
    },
  );
}
