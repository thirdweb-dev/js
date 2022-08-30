import { detectContractFeature } from "../../common";
import {
  fetchCurrencyMetadata,
  fetchCurrencyValue,
} from "../../common/currency";
import { FEATURE_TOKEN } from "../../constants/erc20-features";
import { AmountSchema } from "../../schema";
import { SDKOptions, SDKOptionsSchema } from "../../schema/sdk-options";
import { TokenMintInput } from "../../schema/tokens/token";
import { Amount, Currency, CurrencyValue } from "../../types/currency";
import {
  BaseDropERC20,
  BaseERC20,
  BaseSignatureMintERC20,
} from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { UpdateableNetwork } from "../interfaces/contract";
import { NetworkOrSignerOrProvider, TransactionResult } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { Erc20Burnable } from "./erc-20-burnable";
import { Erc20Droppable } from "./erc-20-droppable";
import { Erc20Mintable } from "./erc-20-mintable";
import { Erc20SignatureMintable } from "./erc-20-signature-mintable";
import {
  DropERC20,
  IBurnableERC20,
  IMintableERC20,
  TokenERC20,
} from "@thirdweb-dev/contracts-js";
import { IStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, ethers } from "ethers";

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
export class Erc20<
  T extends TokenERC20 | DropERC20 | BaseERC20 =
    | BaseERC20
    | BaseSignatureMintERC20,
> implements UpdateableNetwork, DetectableFeature
{
  featureName = FEATURE_TOKEN.name;
  /**
   * Mint tokens
   */
  public mint: Erc20Mintable | undefined;
  public burn: Erc20Burnable | undefined;
  public drop: Erc20Droppable | undefined;
  public signature: Erc20SignatureMintable | undefined;
  protected contractWrapper: ContractWrapper<T>;
  protected storage: IStorage;

  constructor(contractWrapper: ContractWrapper<T>, storage: IStorage) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.mint = this.detectErc20Mintable();
    this.burn = this.detectErc20Burnable();
    this.drop = this.detectErc20Droppable();
    this.signature = this.detectErc20SignatureMintable();
  }

  /**
   * @internal
   */
  onNetworkUpdated(network: NetworkOrSignerOrProvider): void {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  /**
   * @internal
   */
  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get the token Metadata (name, symbol, etc...)
   *
   * @example
   * ```javascript
   * const token = await contract.token.get();
   * ```
   * @returns The token metadata
   */
  public async get(): Promise<Currency> {
    return await fetchCurrencyMetadata(
      this.contractWrapper.getProvider(),
      this.getAddress(),
    );
  }

  /**
   * Get Token Balance for the currently connected wallet
   *
   * @remarks Get a wallets token balance.
   *
   * @example
   * ```javascript
   * const balance = await contract.token.balance();
   * ```
   *
   * @returns The balance of a specific wallet.
   */
  public async balance(): Promise<CurrencyValue> {
    return await this.balanceOf(await this.contractWrapper.getSignerAddress());
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
   * const balance = await contract.token.balanceOf(walletAddress);
   * ```
   *
   * @returns The balance of a specific wallet.
   */
  public async balanceOf(address: string): Promise<CurrencyValue> {
    return this.getValue(
      await this.contractWrapper.readContract.balanceOf(address),
    );
  }

  /**
   * The total supply for this Token
   * @remarks Get how much supply has been minted
   * @example
   * ```javascript
   * const balance = await contract.token.totalSupply();
   * ```
   */
  public async totalSupply(): Promise<CurrencyValue> {
    return await this.getValue(
      await this.contractWrapper.readContract.totalSupply(),
    );
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
   * const allowance = await contract.token.allowance(spenderAddress);
   * ```
   *
   * @returns The allowance of one wallet over anothers funds.
   */
  public async allowance(spender: string): Promise<CurrencyValue> {
    return await this.allowanceOf(
      await this.contractWrapper.getSignerAddress(),
      spender,
    );
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
   * const allowance = await contract.token.allowanceOf(owner, spender);
   * ```
   *
   * @returns The allowance of one wallet over anothers funds.
   */
  public async allowanceOf(
    owner: string,
    spender: string,
  ): Promise<CurrencyValue> {
    return await this.getValue(
      await this.contractWrapper.readContract.allowance(owner, spender),
    );
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
   * await contract.token.transfer(toAddress, amount);
   * ```
   */
  public async transfer(
    to: string,
    amount: Amount,
  ): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction("transfer", [
        to,
        await this.normalizeAmount(amount),
      ]),
    };
  }

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
   * await contract.token.transferFrom(fromAddress, toAddress, amount);
   * ```
   */
  public async transferFrom(
    from: string,
    to: string,
    amount: Amount,
  ): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction("transferFrom", [
        from,
        to,
        await this.normalizeAmount(amount),
      ]),
    };
  }

  /**
   * Allows the specified `spender` wallet to transfer the given `amount` of tokens to another wallet
   *
   * @example
   * ```javascript
   * // Address of the wallet to allow transfers from
   * const spenderAddress = "0x...";
   * // The number of tokens to give as allowance
   * const amount = 100
   * await contract.token.setAllowance(spenderAddress, amount);
   * ```
   */
  public async setAllowance(
    spender: string,
    amount: Amount,
  ): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction("approve", [
        spender,
        await this.normalizeAmount(amount),
      ]),
    };
  }

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
   * await contract.token.transferBatch(data);
   * ```
   */
  public async transferBatch(args: TokenMintInput[]) {
    const encoded = await Promise.all(
      args.map(async (arg) => {
        const amountWithDecimals = await this.normalizeAmount(arg.amount);
        return this.contractWrapper.readContract.interface.encodeFunctionData(
          "transfer",
          [arg.toAddress, amountWithDecimals],
        );
      }),
    );
    await this.contractWrapper.multiCall(encoded);
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  /**
   * returns the wei amount from a token amount
   * @internal
   * @param amount
   */
  public async normalizeAmount(amount: Amount): Promise<BigNumber> {
    const decimals = await this.contractWrapper.readContract.decimals();
    return ethers.utils.parseUnits(AmountSchema.parse(amount), decimals);
  }

  /**
   * @internal
   */
  protected async getValue(value: BigNumberish): Promise<CurrencyValue> {
    return await fetchCurrencyValue(
      this.contractWrapper.getProvider(),
      this.getAddress(),
      BigNumber.from(value),
    );
  }

  private detectErc20Mintable(): Erc20Mintable | undefined {
    if (detectContractFeature<IMintableERC20>(this.contractWrapper, "ERC20")) {
      return new Erc20Mintable(this, this.contractWrapper);
    }
    return undefined;
  }

  private detectErc20Burnable(): Erc20Burnable | undefined {
    if (
      detectContractFeature<IBurnableERC20>(
        this.contractWrapper,
        "ERC20Burnable",
      )
    ) {
      return new Erc20Burnable(this, this.contractWrapper);
    }
    return undefined;
  }

  private detectErc20Droppable(): Erc20Droppable | undefined {
    if (
      detectContractFeature<BaseDropERC20>(
        this.contractWrapper,
        "ERC20Droppable",
      )
    ) {
      return new Erc20Droppable(this, this.contractWrapper, this.storage);
    }
    return undefined;
  }

  private detectErc20SignatureMintable(): Erc20SignatureMintable | undefined {
    if (
      detectContractFeature<TokenERC20>(
        this.contractWrapper,
        "ERC20SignatureMintable",
      )
    ) {
      return new Erc20SignatureMintable(this.contractWrapper);
    }
    return undefined;
  }
}
