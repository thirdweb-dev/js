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

	/**
   * Get the deterministic address of the smart wallet that will be created for the given admin.
   * 
   * @example
   * ```javascript
   * const walletAddress = await contract.smartWalletFactory.predictWalletAddress(admin);
   * ```
   * @param admin - The admin of the smart wallet.
   * @param extraData - (Optional) Extra data to be passed to the smart wallet on creation.
   * @returns the deterministic address of the smart wallet that will be created for the given admin.
   * 
   * @twfeature SmartWalletFactory
   */
	public async predictWalletAddress(admin: string, extraData?: BytesLike): Promise<string> {
		let data: BytesLike = ethers.utils.toUtf8Bytes("");
		if(extraData) {
			data = extraData;
		}
		return this.contractWrapper.readContract.getAddress(admin, data);
	}

	/**
   * Get all signers who have authority on the given smart wallet.
   * 
   * @example
   * ```javascript
   * const allSigners = await contract.smartWalletFactory.getAssociatedSigners(admin);
   * ```
   * @param wallet - The smart wallet address.
   * @returns all signers who have authority on the given smart wallet.
   * 
   * @twfeature SmartWalletFactory
   */
	public async getAssociatedSigners(wallet: string): Promise<string[]> {
		return this.contractWrapper.readContract.getSignersOfAccount(wallet);
	}

	/**
   * Get all wallets on which the given signer has authority.
   * 
   * @example
   * ```javascript
   * const allWallets = await contract.smartWalletFactory.getAssociatedWallets(admin);
   * ```
   * @param signer - The smart wallet address.
   * @returns all wallets on which the given signer has authority.
   * 
   * @twfeature SmartWalletFactory
   */
	public async getAssociatedWallets(signer: string): Promise<string[]> {
		return this.contractWrapper.readContract.getAccountsOfSigner(signer);
	}

  /**
   * Get all wallets created via the smart wallet factory.
   * 
   * @example
   * ```javascript
   * const allWallets = await contract.smartWalletFactory.getAllWallets();
   * ```
   * 
   * @returns all wallets created via the smart wallet factory.
   * 
   * @twfeature SmartWalletFactory
   */
  public async getAllWallets(): Promise<AccountEvent[]> {
    const filter = {
      fromBlock: 0,
      toBlock: "latest",
    }

    const events = await this.events.getEvents("AccountCreated", filter);

    return events.map((event) => {
      return { account: event.data.account, admin: event.data.accountAdmin };
    });
  }

  /**
   * Determine whether the smart wallet has been deployed for the given admin.
   * 
   * @param admin - The admin of the smart wallet.
   * @param extraData - (Optional) Extra data to be passed to the smart wallet on creation.
   * @returns whether the smart wallet has been deployed for the given admin.
   */
  public async isWalletDeployed(admin: string, extraData?: BytesLike): Promise<boolean> {
    const addr = await this.predictWalletAddress(admin, extraData);
    return isContractDeployed(addr, this.contractWrapper.getProvider());
  }

	/*********************************
   * WRITE FUNCTIONS
   *******************************/

	/**
   * Create a smart wallet.
   * 
   * @remarks Create a smart wallet for an admin. The admin will have complete authority over the smart wallet.
   * 
   * @param admin - The admin of the smart wallet.
   * @param extraData - (Optional) Extra data to be passed to the smart wallet on creation.
   * 
   * @example
   *  ```javascript
   * const tx = await contract.smartWalletFactory.createWallet(admin, extraData);
   * const receipt = tx.receipt();
   * const smartWalletAddress = tx.address;
   * ```
   * 
   * @twfeature SmartWalletFactory
   */
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