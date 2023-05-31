import type { IAccountFactory } from "@thirdweb-dev/contracts-js";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { FEATURE_SMART_WALLET_FACTORY } from "../../constants/thirdweb-features";

import { ContractEvents } from "./contract-events";
import { ContractWrapper } from "./contract-wrapper";
import { buildTransactionFunction } from "../../common/transactions";
import { Transaction } from "./transactions";
import { TransactionResultWithAddress } from "../types";
import { BytesLike, ethers } from "ethers";
import { AccountCreatedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/AccountFactory";
import { AccountEvent } from "../../types";
import { isContractDeployed } from "../../common";

export class SmartWalletFactory<TContract extends IAccountFactory> implements DetectableFeature {

  featureName = FEATURE_SMART_WALLET_FACTORY.name;
  private contractWrapper: ContractWrapper<IAccountFactory>;

  // utilities
  public events: ContractEvents<IAccountFactory>;

  constructor(
    contractWrapper: ContractWrapper<TContract>,
  ) {
    this.contractWrapper = contractWrapper;
    
    this.events = new ContractEvents(this.contractWrapper);
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

	/*********************************
   * READ FUNCTIONS
   *******************************/

	// TODO: Write documentation for function.
	public async predictWalletAddress(admin: string, extraData?: BytesLike): Promise<string> {
		let data: BytesLike = ethers.utils.toUtf8Bytes("");
		if(extraData) {
			data = extraData;
		}
		return this.contractWrapper.readContract.getAddress(admin, data);
	}

	// TODO: Write documentation for function.
	public async getAssociatedSigners(wallet: string): Promise<string[]> {
		return this.contractWrapper.readContract.getSignersOfAccount(wallet);
	}

	// TODO: Write documentation for function.
	public async getAssociatedWallets(signer: string): Promise<string[]> {
		return this.contractWrapper.readContract.getAccountsOfSigner(signer);
	}

  // TODO: Write documentation for function.
  public async getAllWallets(): Promise<AccountEvent[]> {
    const filter = {
      fromBlock: 0,
      toBlock: "latest",
    }

    const events = await this.events.getEvents("AccountCreated", filter);
    console.log(events);

    return events.map((event) => {
      return { account: event.data.account, admin: event.data.accountAdmin };
    });
  }

  // TODO: Write documentation for function.
  public async isWalletDeployed(admin: string, extraData?: BytesLike): Promise<boolean> {
    const addr = await this.predictWalletAddress(admin, extraData);
    return isContractDeployed(addr, this.contractWrapper.getProvider());
  }

	/*********************************
   * WRITE FUNCTIONS
   *******************************/

	// TODO: Write documentation for function.
	createWallet = buildTransactionFunction(
		async (
			walletAdmin: string,
			extraData?: BytesLike,
		): Promise<Transaction<TransactionResultWithAddress>> => {

      if(await this.isWalletDeployed(walletAdmin, extraData)) {
        throw new Error(`Wallet already deployed for admin: ${walletAdmin}`);
      }


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