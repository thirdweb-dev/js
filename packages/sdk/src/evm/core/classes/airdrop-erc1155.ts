import { AirdropFailedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/AirdropERC1155";
import { NetworkInput } from "..";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_AIRDROP_ERC1155 } from "../../constants/thirdweb-features";
import { Address } from "../../schema";
import { Airdrop1155Content } from "../../types";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { UpdateableNetwork } from "../interfaces/contract";
import { ContractWrapper } from "./contract-wrapper";
import { Transaction } from "./transactions";
import type {
  AirdropERC1155,
  IAirdropERC1155,
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

/**
 * @public
 */
export class Airdrop1155<T extends IAirdropERC1155 | AirdropERC1155>
  implements UpdateableNetwork, DetectableFeature
{
  featureName = FEATURE_AIRDROP_ERC1155.name;
  protected contractWrapper: ContractWrapper<T>;
  protected storage: ThirdwebStorage;

  private _chainId: number;
  get chainId() {
    return this._chainId;
  }

  constructor(
    contractWrapper: ContractWrapper<T>,
    storage: ThirdwebStorage,
    chainId: number,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this._chainId = chainId;
  }

  /**
   * @internal
   */
  onNetworkUpdated(network: NetworkInput): void {
    this.contractWrapper.updateSignerOrProvider(network);
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
