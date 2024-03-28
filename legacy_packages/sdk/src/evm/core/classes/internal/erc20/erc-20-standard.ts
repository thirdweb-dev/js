import type { DropERC20, TokenERC20 } from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { buildTransactionFunction } from "../../../../common/transactions";
import { Address } from "../../../../schema/shared/Address";
import { AddressOrEns } from "../../../../schema/shared/AddressOrEnsSchema";
import { TokenMintInput } from "../../../../schema/tokens/token";
import { Amount, Currency, CurrencyValue } from "../../../../types/currency";
import { BaseERC20, BaseSignatureMintERC20 } from "../../../../types/eips";
import { UpdateableNetwork } from "../../../interfaces/contract";
import { NetworkInput } from "../../../types";
import { ContractWrapper } from "../contract-wrapper";
import { Erc20 } from "../../erc-20";
import { Transaction } from "../../transactions";

/**
 * Standard ERC20 Token functions
 * @remarks Basic functionality for a ERC20 contract that handles all unit transformation for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.token.transfer(walletAddress, amount);
 * ```
 * @public
 */
export class StandardErc20<
  T extends TokenERC20 | DropERC20 | BaseERC20 =
    | BaseERC20
    | BaseSignatureMintERC20,
> implements UpdateableNetwork
{
  protected contractWrapper: ContractWrapper<T>;
  protected storage: ThirdwebStorage;

  public erc20: Erc20<T>;

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
    this.erc20 = new Erc20(this.contractWrapper, this.storage, chainId);
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
    return this.contractWrapper.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get the token Metadata (name, symbol, etc...)
   *
   * @example
   * ```javascript
   * const token = await contract.get();
   * ```
   * @returns The token metadata
   */
  public async get(): Promise<Currency> {
    return this.erc20.get();
  }

  /**
   * Get Token Balance for the currently connected wallet
   *
   * @remarks Get a wallets token balance.
   *
   * @example
   * ```javascript
   * const balance = await contract.balance();
   * ```
   *
   * @returns The balance of a specific wallet.
   */
  public async balance(): Promise<CurrencyValue> {
    return await this.erc20.balance();
  }

  /**
   * Get Token Balance
   *
   * @remarks Get a wallets token balance.
   *
   * @example
   * ```javascript
   * // Address of the wallet to check token balance
   * const walletAddress = "{{wallet_address}}";
   * const balance = await contract.balanceOf(walletAddress);
   * ```
   *
   * @returns The balance of a specific wallet.
   */
  public async balanceOf(address: AddressOrEns): Promise<CurrencyValue> {
    return this.erc20.balanceOf(address);
  }

  /**
   * The total supply for this token
   * @remarks Get how much supply has been minted
   * @example
   * ```javascript
   * const balance = await contract.totalSupply();
   * ```
   */
  public async totalSupply(): Promise<CurrencyValue> {
    return await this.erc20.totalSupply();
  }

  /**
   * Get Token Allowance
   *
   * @remarks Get the allowance of a 'spender' wallet over the connected wallet's funds - the allowance of a different address for a token is the amount of tokens that the `spender` wallet is allowed to spend on behalf of the connected wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet to check token allowance
   * const spenderAddress = "0x...";
   * const allowance = await contract.allowance(spenderAddress);
   * ```
   *
   * @returns The allowance of one wallet over anothers funds.
   */
  public async allowance(spender: AddressOrEns): Promise<CurrencyValue> {
    return await this.erc20.allowance(spender);
  }

  /**
   * Get Token Allowance
   *
   * @remarks Get the allowance of one wallet over another wallet's funds - the allowance of a different address for a token is the amount of tokens that the wallet is allowed to spend on behalf of the specified wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet who owns the funds
   * const owner = "{{wallet_address}}";
   * // Address of the wallet to check token allowance
   * const spender = "0x...";
   * const allowance = await contract.allowanceOf(owner, spender);
   * ```
   *
   * @returns The allowance of one wallet over anothers funds.
   */
  public async allowanceOf(
    owner: AddressOrEns,
    spender: AddressOrEns,
  ): Promise<CurrencyValue> {
    return await this.erc20.allowanceOf(owner, spender);
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Transfer Tokens
   *
   * @remarks Transfer tokens from the connected wallet to another wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet you want to send the tokens to
   * const toAddress = "0x...";
   * // The amount of tokens you want to send
   * const amount = 0.1;
   * await contract.transfer(toAddress, amount);
   * ```
   */
  transfer = /* @__PURE__ */ buildTransactionFunction(
    async (to: AddressOrEns, amount: Amount) => {
      return this.erc20.transfer.prepare(to, amount);
    },
  );

  /**
   * Transfer Tokens From Address
   *
   * @remarks Transfer tokens from one wallet to another
   *
   * @example
   * ```javascript
   * // Address of the wallet sending the tokens
   * const fromAddress = "{{wallet_address}}";
   * // Address of the wallet you want to send the tokens to
   * const toAddress = "0x...";
   * // The number of tokens you want to send
   * const amount = 1.2
   * // Note that the connected wallet must have approval to transfer the tokens of the fromAddress
   * await contract.transferFrom(fromAddress, toAddress, amount);
   * ```
   */
  transferFrom = /* @__PURE__ */ buildTransactionFunction(
    async (from: AddressOrEns, to: AddressOrEns, amount: Amount) => {
      return this.erc20.transferFrom.prepare(from, to, amount);
    },
  );

  /**
   * Allows the specified `spender` wallet to transfer the given `amount` of tokens to another wallet
   *
   * @example
   * ```javascript
   * // Address of the wallet to allow transfers from
   * const spenderAddress = "0x...";
   * // The number of tokens to give as allowance
   * const amount = 100
   * await contract.setAllowance(spenderAddress, amount);
   * ```
   */
  setAllowance = /* @__PURE__ */ buildTransactionFunction(
    async (spender: AddressOrEns, amount: Amount): Promise<Transaction> => {
      return this.erc20.setAllowance.prepare(spender, amount);
    },
  );

  /**
   * Transfer Tokens To Many Wallets
   *
   * @remarks Mint tokens from the connected wallet to many wallets
   *
   * @example
   * ```javascript
   * // Data of the tokens you want to mint
   * const data = [
   *   {
   *     toAddress: "{{wallet_address}}", // Address to mint tokens to
   *     amount: 100, // How many tokens to mint to specified address
   *   },
   *  {
   *    toAddress: "0x...",
   *    amount: 100,
   *  }
   * ]
   *
   * await contract.transferBatch(data);
   * ```
   */
  transferBatch = /* @__PURE__ */ buildTransactionFunction(
    async (args: TokenMintInput[]) => {
      return this.erc20.transferBatch.prepare(args);
    },
  );
}
