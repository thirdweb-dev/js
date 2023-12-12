import type { IAccountFactory } from "@thirdweb-dev/contracts-js";
import { FEATURE_ACCOUNT_FACTORY } from "../../constants/thirdweb-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";

import { AccountCreatedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/AccountFactory";
import { utils, type BytesLike } from "ethers";
import { isContractDeployed } from "../../common/any-evm-utils/isContractDeployed";
import { buildTransactionFunction } from "../../common/transactions";
import { TransactionResultWithAddress } from "../types";
import { ContractEvents } from "./contract-events";
import { ContractWrapper } from "./internal/contract-wrapper";
import { Transaction } from "./transactions";

/**
 * @internal
 */
export class AccountFactory implements DetectableFeature {
  featureName = FEATURE_ACCOUNT_FACTORY.name;
  private contractWrapper: ContractWrapper<IAccountFactory>;

  // utilities
  public events: ContractEvents<IAccountFactory>;

  constructor(contractWrapper: ContractWrapper<IAccountFactory>) {
    this.contractWrapper = contractWrapper;

    this.events = new ContractEvents(this.contractWrapper);
  }

  getAddress(): string {
    return this.contractWrapper.address;
  }

  /*********************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get the deterministic address of the account that will be created
   *
   * @example
   * ```javascript
   * const accountAddress = await contract.accountFactory.predictAccountAddress(admin);
   * ```
   * @param admin - The admin of the account.
   * @param extraData - (Optional) Extra data to be passed to the account on creation.
   * @returns the deterministic address of the account that will be created for the given admin.
   *
   * @twfeature AccountFactory
   */
  public async predictAccountAddress(
    admin: string,
    extraData?: BytesLike,
  ): Promise<string> {
    let data: BytesLike = utils.toUtf8Bytes("");
    if (extraData) {
      data = extraData;
    }
    return this.contractWrapper.read("getAddress", [admin, data]);
  }

  /**
   * Get all accounts on which the given signer has authority
   *
   * @example
   * ```javascript
   * const allAccounts = await contract.accountFactory.getAssociatedAccounts(admin);
   * ```
   * @param signer - The account address.
   * @returns all accounts on which the given signer has authority.
   *
   * @twfeature AccountFactory
   */
  public async getAssociatedAccounts(signer: string): Promise<string[]> {
    return this.contractWrapper.read("getAccountsOfSigner", [signer]);
  }

  /**
   * Get all accounts
   *
   * @example
   * ```javascript
   * const allAccounts = await contract.accountFactory.getAllAccounts();
   * ```
   *
   * @returns all accounts created via the account factory.
   *
   * @twfeature AccountFactory
   */
  public async getAllAccounts(): Promise<string[]> {
    return await this.contractWrapper.read("getAllAccounts", []);
  }

  /**
   * Check if a account has been deployed for the given admin
   *
   * @param admin - The admin of the account.
   * @param extraData - (Optional) Extra data to be passed to the account on creation.
   * @returns whether the account has been deployed for the given admin.
   */
  public async isAccountDeployed(
    admin: string,
    extraData?: BytesLike,
  ): Promise<boolean> {
    const addr = await this.predictAccountAddress(admin, extraData);
    return isContractDeployed(addr, this.contractWrapper.getProvider());
  }

  /*********************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Create a account
   *
   * @remarks Create a account for an admin. The admin will have complete authority over the account.
   *
   * @param admin - The admin of the account.
   * @param extraData - (Optional) Extra data to be passed to the account on creation.
   *
   * @example
   * ```javascript
   * const tx = await contract.accountFactory.createAccount(admin, extraData);
   * const receipt = tx.receipt();
   * const accountAddress = tx.address;
   * ```
   *
   * @twfeature AccountFactory
   */
  createAccount = /* @__PURE__ */ buildTransactionFunction(
    async (
      accountAdmin: string,
      extraData?: BytesLike,
    ): Promise<Transaction<TransactionResultWithAddress>> => {
      if (await this.isAccountDeployed(accountAdmin, extraData)) {
        throw new Error(`Account already deployed for admin: ${accountAdmin}`);
      }

      let data: BytesLike = utils.toUtf8Bytes("");
      if (extraData) {
        data = extraData;
      }

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "createAccount",
        args: [accountAdmin, data],
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
    },
  );
}
