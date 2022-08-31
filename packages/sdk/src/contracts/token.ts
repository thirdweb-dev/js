import { getRoleHash } from "../common";
import { NetworkOrSignerOrProvider, TransactionResult } from "../core";
import { ContractEncoder } from "../core/classes/contract-encoder";
import { ContractEvents } from "../core/classes/contract-events";
import { ContractInterceptor } from "../core/classes/contract-interceptor";
import { ContractMetadata } from "../core/classes/contract-metadata";
import { ContractPlatformFee } from "../core/classes/contract-platform-fee";
import { ContractRoles } from "../core/classes/contract-roles";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import { Erc20 } from "../core/classes/erc-20";
import { Erc20BatchMintable } from "../core/classes/erc-20-batch-mintable";
import { Erc20Burnable } from "../core/classes/erc-20-burnable";
import { TokenERC20History } from "../core/classes/erc-20-history";
import { Erc20Mintable } from "../core/classes/erc-20-mintable";
import { Erc20SignatureMintable } from "../core/classes/erc-20-signature-mintable";
import { GasCostEstimator } from "../core/classes/gas-cost-estimator";
import { TokenErc20ContractSchema } from "../schema/contracts/token-erc20";
import { SDKOptions } from "../schema/sdk-options";
import { TokenMintInput } from "../schema/tokens/token";
import { Amount, CurrencyValue } from "../types";
import { TokenERC20 } from "@thirdweb-dev/contracts-js";
import ABI from "@thirdweb-dev/contracts-js/abis/TokenERC20.json";
import { IStorage } from "@thirdweb-dev/storage";
import { constants } from "ethers";

/**
 * Create a standard crypto token or cryptocurrency.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = sdk.getToken("{{contract_address}}");
 * ```
 *
 * @public
 */
export class Token extends Erc20<TokenERC20> {
  static contractType = "token" as const;
  static contractRoles = ["admin", "minter", "transfer"] as const;
  static contractAbi = ABI as any;
  /**
   * @internal
   */
  static schema = TokenErc20ContractSchema;
  public metadata: ContractMetadata<TokenERC20, typeof Token.schema>;
  public roles: ContractRoles<TokenERC20, typeof Token.contractRoles[number]>;
  public encoder: ContractEncoder<TokenERC20>;
  public estimator: GasCostEstimator<TokenERC20>;
  public history: TokenERC20History;
  public events: ContractEvents<TokenERC20>;
  public platformFees: ContractPlatformFee<TokenERC20>;
  /**
   * Signature Minting
   * @remarks Generate tokens that can be minted only with your own signature, attaching your own set of mint conditions.
   * @example
   * ```javascript
   * // see how to craft a payload to sign in the `contract.signature.generate()` documentation
   * const signedPayload = contract.signature.generate(payload);
   *
   * // now anyone can mint the tokens
   * const tx = contract.signature.mint(signedPayload);
   * const receipt = tx.receipt; // the mint transaction receipt
   * ```
   */
  override signature = super.signature as Erc20SignatureMintable;
  /**
   * @internal
   */
  public interceptor: ContractInterceptor<TokenERC20>;
  private _mint = this.mint as Erc20Mintable;
  private _batchMint = this._mint.batch as Erc20BatchMintable;
  private _burn = this.burn as Erc20Burnable;

  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    storage: IStorage,
    options: SDKOptions = {},
    contractWrapper = new ContractWrapper<TokenERC20>(
      network,
      address,
      Token.contractAbi,
      options,
    ),
  ) {
    super(contractWrapper, storage, options);
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      Token.schema,
      this.storage,
    );
    this.roles = new ContractRoles(this.contractWrapper, Token.contractRoles);
    this.events = new ContractEvents(this.contractWrapper);
    this.history = new TokenERC20History(this.contractWrapper, this.events);
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.platformFees = new ContractPlatformFee(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
    this.signature = new Erc20SignatureMintable(
      this.contractWrapper,
      this.roles,
    );
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get your wallet voting power for the current checkpoints
   *
   * @returns the amount of voting power in tokens
   */
  public async getVoteBalance(): Promise<CurrencyValue> {
    return await this.getVoteBalanceOf(
      await this.contractWrapper.getSignerAddress(),
    );
  }

  public async getVoteBalanceOf(account: string): Promise<CurrencyValue> {
    return await this.getValue(
      await this.contractWrapper.readContract.getVotes(account),
    );
  }

  /**
   * Get your voting delegatee address
   *
   * @returns the address of your vote delegatee
   */
  public async getDelegation(): Promise<string> {
    return await this.getDelegationOf(
      await this.contractWrapper.getSignerAddress(),
    );
  }

  /**
   * Get a specific address voting delegatee address
   *
   * @returns the address of your vote delegatee
   */
  public async getDelegationOf(account: string): Promise<string> {
    return await this.contractWrapper.readContract.delegates(account);
  }

  /**
   * Get whether users can transfer tokens from this contract
   */
  public async isTransferRestricted(): Promise<boolean> {
    const anyoneCanTransfer = await this.contractWrapper.readContract.hasRole(
      getRoleHash("transfer"),
      constants.AddressZero,
    );
    return !anyoneCanTransfer;
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Mint Tokens for the connected wallet
   *
   * @remarks See {@link Token.mintTo}
   */
  public async mintToSelf(amount: Amount): Promise<TransactionResult> {
    return this._mint.to(await this.contractWrapper.getSignerAddress(), amount);
  }

  /**
   * Mint Tokens
   *
   * @remarks Mint tokens to a specified address.
   *
   * @example
   * ```javascript
   * const toAddress = "{{wallet_address}}"; // Address of the wallet you want to mint the tokens to
   * const amount = "1.5"; // The amount of this token you want to mint
   *
   * await contract.mintTo(toAddress, amount);
   * ```
   */
  public async mintTo(to: string, amount: Amount): Promise<TransactionResult> {
    return this._mint.to(to, amount);
  }

  /**
   * Mint Tokens To Many Wallets
   *
   * @remarks Mint tokens to many wallets in one transaction.
   *
   * @example
   * ```javascript
   * // Data of the tokens you want to mint
   * const data = [
   *   {
   *     toAddress: "{{wallet_address}}", // Address to mint tokens to
   *     amount: 0.2, // How many tokens to mint to specified address
   *   },
   *  {
   *    toAddress: "0x...",
   *    amount: 1.4,
   *  }
   * ]
   *
   * await contract.mintBatchTo(data);
   * ```
   */
  public async mintBatchTo(args: TokenMintInput[]): Promise<TransactionResult> {
    return this._batchMint.to(args);
  }

  /**
   * Lets you delegate your voting power to the delegateeAddress
   *
   * @param delegateeAddress - delegatee wallet address
   * @alpha
   */
  public async delegateTo(
    delegateeAddress: string,
  ): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction("delegate", [
        delegateeAddress,
      ]),
    };
  }

  /**
   * Burn Tokens
   *
   * @remarks Burn tokens held by the connected wallet
   *
   * @example
   * ```javascript
   * // The amount of this token you want to burn
   * const amount = 1.2;
   *
   * await contract.burnTokens(amount);
   * ```
   */
  public async burnTokens(amount: Amount): Promise<TransactionResult> {
    return this._burn.tokens(amount);
  }

  /**
   * Burn Tokens
   *
   * @remarks Burn tokens held by the specified wallet
   *
   * @example
   * ```javascript
   * // Address of the wallet sending the tokens
   * const holderAddress = "{{wallet_address}}";
   *
   * // The amount of this token you want to burn
   * const amount = 1.2;
   *
   * await contract.burnFrom(holderAddress, amount);
   * ```
   */
  public async burnFrom(
    holder: string,
    amount: Amount,
  ): Promise<TransactionResult> {
    return this._burn.from(holder, amount);
  }
}
