import type { TokenERC20 } from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { CallOverrides, constants } from "ethers";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { getRoleHash } from "../../common/role";
import { buildTransactionFunction } from "../../common/transactions";
import { ContractAppURI } from "../../core/classes/contract-appuri";
import { ContractEncoder } from "../../core/classes/contract-encoder";
import { ContractEvents } from "../../core/classes/contract-events";
import { ContractInterceptor } from "../../core/classes/contract-interceptor";
import { ContractMetadata } from "../../core/classes/contract-metadata";
import { ContractPlatformFee } from "../../core/classes/contract-platform-fee";
import { ContractRoles } from "../../core/classes/contract-roles";
import { ContractPrimarySale } from "../../core/classes/contract-sales";
import { ContractWrapper } from "../../core/classes/internal/contract-wrapper";
import { TokenERC20History } from "../../core/classes/internal/erc20/erc-20-history";
import { Erc20SignatureMintable } from "../../core/classes/erc-20-signature-mintable";
import { StandardErc20 } from "../../core/classes/internal/erc20/erc-20-standard";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
import { Transaction } from "../../core/classes/transactions";
import { NetworkInput } from "../../core/types";
import { Abi, AbiInput, AbiSchema } from "../../schema/contracts/custom";
import { TokenErc20ContractSchema } from "../../schema/contracts/token-erc20";
import { SDKOptions } from "../../schema/sdk-options";
import { Address } from "../../schema/shared/Address";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { TokenMintInput } from "../../schema/tokens/token";
import type { Amount, CurrencyValue } from "../../types/currency";
import { NFT_BASE_CONTRACT_ROLES } from "../contractRoles";

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
 * @internal
 * @deprecated use contract.erc20 instead
 */
export class Token extends StandardErc20<TokenERC20> {
  static contractRoles = NFT_BASE_CONTRACT_ROLES;

  public abi: Abi;
  public metadata: ContractMetadata<
    TokenERC20,
    typeof TokenErc20ContractSchema
  >;

  public app: ContractAppURI<TokenERC20>;
  public roles: ContractRoles<TokenERC20, (typeof Token.contractRoles)[number]>;
  public encoder: ContractEncoder<TokenERC20>;
  public estimator: GasCostEstimator<TokenERC20>;
  public history: TokenERC20History;
  public events: ContractEvents<TokenERC20>;
  public platformFees: ContractPlatformFee;
  public sales: ContractPrimarySale;
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
    network: NetworkInput,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
    abi: AbiInput,
    chainId: number,
    contractWrapper = new ContractWrapper<TokenERC20>(
      network,
      address,
      abi,
      options,
      storage,
    ),
  ) {
    super(contractWrapper, storage, chainId);
    this.abi = AbiSchema.parse(abi || []);
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      TokenErc20ContractSchema,
      this.storage,
    );
    this.app = new ContractAppURI(
      this.contractWrapper,
      this.metadata,
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

  public async getVoteBalanceOf(account: AddressOrEns): Promise<CurrencyValue> {
    return await this.erc20.getValue(
      await this.contractWrapper.read("getVotes", [account]),
    );
  }

  /**
   * Get your voting delegatee address
   *
   * @returns the address of your vote delegatee
   */
  public async getDelegation(): Promise<Address> {
    return await this.getDelegationOf(
      await this.contractWrapper.getSignerAddress(),
    );
  }

  /**
   * Get a specific address voting delegatee address
   *
   * @returns the address of your vote delegatee
   */
  public async getDelegationOf(account: AddressOrEns): Promise<Address> {
    return await this.contractWrapper.read("delegates", [
      await resolveAddress(account),
    ]);
  }

  /**
   * Get whether users can transfer tokens from this contract
   */
  public async isTransferRestricted(): Promise<boolean> {
    const anyoneCanTransfer = await this.contractWrapper.read("hasRole", [
      getRoleHash("transfer"),
      constants.AddressZero,
    ]);
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
  mint = /* @__PURE__ */ buildTransactionFunction(async (amount: Amount) => {
    return this.erc20.mint.prepare(amount);
  });

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
  mintTo = /* @__PURE__ */ buildTransactionFunction(
    async (to: AddressOrEns, amount: Amount) => {
      return this.erc20.mintTo.prepare(to, amount);
    },
  );

  /**
   * Construct a mint transaction without executing it.
   * This is useful for estimating the gas cost of a mint transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param receiver - Address you want to send the token to
   * @param amount - The amount of tokens you want to mint
   *
   * @deprecated Use `contract.mint.prepare(...args)` instead
   */
  public async getMintTransaction(
    to: AddressOrEns,
    amount: Amount,
  ): Promise<Transaction> {
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
  mintBatchTo = /* @__PURE__ */ buildTransactionFunction(
    async (args: TokenMintInput[]) => {
      return this.erc20.mintBatchTo.prepare(args);
    },
  );

  /**
   * Lets you delegate your voting power to the delegateeAddress
   *
   * @param delegateeAddress - delegatee wallet address
   * @alpha
   */
  delegateTo = /* @__PURE__ */ buildTransactionFunction(
    async (delegateeAddress: AddressOrEns) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "delegate",
        args: [await resolveAddress(delegateeAddress)],
      });
    },
  );

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
  burn = /* @__PURE__ */ buildTransactionFunction((amount: Amount) => {
    return this.erc20.burn.prepare(amount);
  });

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
  burnFrom = /* @__PURE__ */ buildTransactionFunction(
    async (holder: AddressOrEns, amount: Amount) => {
      return this.erc20.burnFrom.prepare(holder, amount);
    },
  );

  /**
   * @internal
   */
  public async prepare<
    TMethod extends
      keyof TokenERC20["functions"] = keyof TokenERC20["functions"],
  >(
    method: string & TMethod,
    args: any[] & Parameters<TokenERC20["functions"][TMethod]>,
    overrides?: CallOverrides,
  ) {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method,
      args,
      overrides,
    });
  }

  /**
   * @internal
   */
  public async call<
    TMethod extends
      keyof TokenERC20["functions"] = keyof TokenERC20["functions"],
  >(
    functionName: string & TMethod,
    args?: Parameters<TokenERC20["functions"][TMethod]>,
    overrides?: CallOverrides,
  ): Promise<ReturnType<TokenERC20["functions"][TMethod]>> {
    return this.contractWrapper.call(functionName, args, overrides);
  }
}
