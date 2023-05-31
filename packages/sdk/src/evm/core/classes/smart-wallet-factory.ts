import type { BaseAccountFactory } from "@thirdweb-dev/contracts-js";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { FEATURE_SMART_WALLET_FACTORY } from "../../constants/thirdweb-features";

import { ContractEncoder } from "./contract-encoder";
import { ContractEvents } from "./contract-events";
import { ContractInterceptor } from "./contract-interceptor";
import { ContractWrapper } from "./contract-wrapper";
import { GasCostEstimator } from "./gas-cost-estimator";
import { buildTransactionFunction } from "../../common/transactions";
import { Transaction } from "./transactions";
import { TransactionResultWithAddress } from "../types";
import { BytesLike, ethers } from "ethers";
import { AccountCreatedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/AccountFactory";

export class SmartWalletFactory<TContract extends BaseAccountFactory> implements DetectableFeature {

  featureName = FEATURE_SMART_WALLET_FACTORY.name;
  private contractWrapper: ContractWrapper<BaseAccountFactory>;

  // utilities
  public events: ContractEvents<BaseAccountFactory>;
  public interceptor: ContractInterceptor<BaseAccountFactory>;
  public encoder: ContractEncoder<BaseAccountFactory>;
  public estimator: GasCostEstimator<BaseAccountFactory>;

  constructor(
    contractWrapper: ContractWrapper<TContract>,
  ) {
    this.contractWrapper = contractWrapper;
    
    this.events = new ContractEvents(this.contractWrapper);
		this.interceptor = new ContractInterceptor(this.contractWrapper);
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

	/*********************************
   * READ FUNCTIONS
   *******************************/

	// TODO: Write documentation for function.
	public async getWalletForAdmin(admin: string, extraData?: BytesLike | ""): Promise<string> {
		let data: BytesLike = ethers.utils.toUtf8Bytes("");
		if(extraData) {
			data = extraData;
		}
		return this.contractWrapper.readContract.getAddress(admin, data);
	}

	// TODO: Write documentation for function.
	public async getSignersOfWallet(wallet: string): Promise<string[]> {
		return this.contractWrapper.readContract.getSignersOfAccount(wallet);
	}

	// TODO: Write documentation for function.
	public async getAssociatedWallets(signer: string): Promise<string[]> {
		return this.contractWrapper.readContract.getAccountsOfSigner(signer);
	}

	/*********************************
   * WRITE FUNCTIONS
   *******************************/

	// TODO: Write documentation for function.
	createWallet = buildTransactionFunction(
		async (
			walletAdmin: string,
			extraData?: BytesLike | "",
		): Promise<Transaction<TransactionResultWithAddress>> => {

			let data: BytesLike = ethers.utils.toUtf8Bytes("");
			if(extraData) {
				data = extraData;
			}

			return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "createAccount",
        args: [
          walletAdmin,
					data,
        ],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<AccountCreatedEvent>(
            "AccountCreated",
            receipt?.logs,
          );
          return {
            address: event[0].args.account,
            receipt,
          };
        },
      });
		}
	)
}