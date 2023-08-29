import type { Chain } from "@paperxyz/sdk-common-utilities";
import type { ClientIdWithQuerierAndChainType } from "../../interfaces/EmbeddedWallets/EmbeddedWallets";
import type {
  CallContractReturnType,
  ContractCallInputType,
} from "../../interfaces/EmbeddedWallets/GaslessTransactionMaker";
import type { EmbeddedWalletIframeCommunicator } from "../../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator";

export type GaslessTransactionQuerierTypes = {
  callContract: {
    contractAddress: string;
    method: {
      stub: string;
      args: Array<unknown>;
    };
    chain: Chain;
  };
};

/**
 * @description GaslessTransactionMaker is used to execute gasless transactions from the embedded wallets
 */
export class GaslessTransactionMaker {
  protected chain: Chain;
  protected clientId: string;
  protected gaslessTransactionQuerier: EmbeddedWalletIframeCommunicator<GaslessTransactionQuerierTypes>;
  constructor({ chain, clientId, querier }: ClientIdWithQuerierAndChainType) {
    this.chain = chain;
    this.clientId = clientId;
    this.gaslessTransactionQuerier = querier;
  }
  /**
   * @description
   * Use to call arbitrary contracts on the blockchain. Note that you have to enable {@link https://withpaper.com/dashboard/developers Sponsored Fees} in order for this to work.
   *
   * @param {string} params.contractAddress The address for which the contract call is directed too.
   * @param {string} params.methodInterface the function stub on the contract. This looks something like `function myFunctionName(address user, uint256 tokenId) external payable`. Refer to this {@link https://blog.ricmoo.com/human-readable-contract-abis-in-ethers-js-141902f4d917 ethers.js article} for more.
   * @param {Array} params.methodArgs The arguments that is to be passed to the contract in order that they are to be passed to the contract.
   * @throws if there is an error calling the contract for whatever reason.
   * @returns {{ transactionHash: string }} The transaction hash associated with the successful contract call.
   */
  async callContract({
    contractAddress,
    methodArgs,
    methodInterface,
  }: ContractCallInputType): Promise<CallContractReturnType> {
    return await this.gaslessTransactionQuerier.call<CallContractReturnType>({
      procedureName: "callContract",
      params: {
        chain: this.chain,
        contractAddress,
        method: {
          args: methodArgs,
          stub: methodInterface,
        },
      },
    });
  }
}
