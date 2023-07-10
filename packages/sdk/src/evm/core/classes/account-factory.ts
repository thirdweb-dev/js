import type { IAccountFactory } from "@thirdweb-dev/contracts-js";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { FEATURE_ACCOUNT_FACTORY } from "../../constants/thirdweb-features";

import { ContractEvents } from "./contract-events";
import { ContractWrapper } from "./contract-wrapper";
import { buildTransactionFunction } from "../../common/transactions";
import { Transaction } from "./transactions";
import { TransactionResultWithAddress } from "../types";
import { type BytesLike, utils } from "ethers";
import { AccountCreatedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/AccountFactory";
import type { AccountEvent } from "../../types/account";
import { isContractDeployed } from "../../common/any-evm-utils/isContractDeployed";

export class AccountFactory<TContract extends IAccountFactory>
  implements DetectableFeature
{
  featureName = FEATURE_ACCOUNT_FACTORY.name;
  private contractWrapper: ContractWrapper<IAccountFactory>;

  // utilities
  public events: ContractEvents<IAccountFactory>;

  constructor(contractWrapper: ContractWrapper<TContract>) {
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
    return this.contractWrapper.readContract.getAddress(admin, data);
  }

  /**
   * Get all signers who have authority on the given account
   *
   * @example
   * ```javascript
   * const allSigners = await contract.accountFactory.getAssociatedSigners(admin);
   * ```
   * @param account - The account address.
   * @returns all signers who have authority on the given account.
   *
   * @twfeature AccountFactory
   */
  public async getAssociatedSigners(account: string): Promise<string[]> {
    return this.contractWrapper.readContract.getSignersOfAccount(account);
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
    return this.contractWrapper.readContract.getAccountsOfSigner(signer);
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
  public async getAllAccounts(): Promise<AccountEvent[]> {
    const allAccounts =
      await this.contractWrapper.readContract.getAllAccounts();

    /**
     * Note: an account can have multiple admins. In this function, we only return the first signer associated with
     *       the account. This should be the admin that created the account, unless this admin has lost their admin status.
     */
    return await Promise.all(
      allAccounts.map(async (account) => {
        const assosiatedSigners = await this.getAssociatedSigners(account);
        const admin = assosiatedSigners[0];

        return { account, admin };
      }),
    );
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
   *  ```javascript
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
