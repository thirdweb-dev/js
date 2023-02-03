import { getRoleHash } from "../../common";
import { ContractEncoder } from "../../core/classes/contract-encoder";
import { ContractEvents } from "../../core/classes/contract-events";
import { ContractInterceptor } from "../../core/classes/contract-interceptor";
import { ContractMetadata } from "../../core/classes/contract-metadata";
import { ContractPlatformFee } from "../../core/classes/contract-platform-fee";
import { ContractRoles } from "../../core/classes/contract-roles";
import { ContractPrimarySale } from "../../core/classes/contract-sales";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { TokenERC20History } from "../../core/classes/erc-20-history";
import { Erc20SignatureMintable } from "../../core/classes/erc-20-signature-mintable";
import { StandardErc20 } from "../../core/classes/erc-20-standard";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
import { NetworkOrSignerOrProvider, TransactionResult } from "../../core/types";
import { Abi } from "../../schema/contracts/custom";
import { TokenErc20ContractSchema } from "../../schema/contracts/token-erc20";
import { SDKOptions } from "../../schema/sdk-options";
import { TokenMintInput } from "../../schema/tokens/token";
import { Amount, CurrencyValue } from "../../types";
import type { TokenERC20 } from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { CallOverrides, constants } from "ethers";

/**
 * Create a standard crypto token or cryptocurrency.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = await sdk.getContract("{{contract_address}}", "token");
 * ```
 *
 * @public
 */
export class Token extends StandardErc20<TokenERC20> {
  static contractRoles = ["admin", "minter", "transfer"] as const;

  public abi: Abi;
  public metadata: ContractMetadata<
    TokenERC20,
    typeof TokenErc20ContractSchema
  >;
  public roles: ContractRoles<TokenERC20, typeof Token.contractRoles[number]>;
  public encoder: ContractEncoder<TokenERC20>;
  public estimator: GasCostEstimator<TokenERC20>;
  public history: TokenERC20History;
  public events: ContractEvents<TokenERC20>;
  public platformFees: ContractPlatformFee<TokenERC20>;
  public sales: ContractPrimarySale<TokenERC20>;
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
  public signature: Erc20SignatureMintable;
  /**
   * @internal
   */
  public interceptor: ContractInterceptor<TokenERC20>;

  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
    abi: Abi,
    chainId: number,
    contractWrapper = new ContractWrapper<TokenERC20>(
      network,
      address,
      abi,
      options,
    ),
  ) {
    super(contractWrapper, storage, chainId);
    this.abi = abi;
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      TokenErc20ContractSchema,
      this.storage,
    );
    this.roles = new ContractRoles(this.contractWrapper, Token.contractRoles);
    this.sales = new ContractPrimarySale(this.contractWrapper);
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
    return await this.erc20.getValue(
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
  public async mint(amount: Amount): Promise<TransactionResult> {
    return this.erc20.mint(amount);
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
    return this.erc20.mintTo(to, amount);
  }

  /**
   * Construct a mint transaction without executing it.
   * This is useful for estimating the gas cost of a mint transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param receiver - Address you want to send the token to
   * @param amount - The amount of tokens you want to mint
   */
  public async getMintTransaction(to: string, amount: Amount) {
    return this.erc20.getMintTransaction(to, amount);
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
    return this.erc20.mintBatchTo(args);
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
  public async burn(amount: Amount): Promise<TransactionResult> {
    return this.erc20.burn(amount);
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
    return this.erc20.burnFrom(holder, amount);
  }

  /**
   * @internal
   */
  public async call(
    functionName: string,
    ...args: unknown[] | [...unknown[], CallOverrides]
  ): Promise<any> {
    return this.contractWrapper.call(functionName, ...args);
  }
}
