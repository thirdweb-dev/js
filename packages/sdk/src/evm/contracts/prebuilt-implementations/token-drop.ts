import { getRoleHash } from "../../common";
import { ContractEncoder } from "../../core/classes/contract-encoder";
import { ContractEvents } from "../../core/classes/contract-events";
import { ContractInterceptor } from "../../core/classes/contract-interceptor";
import { ContractMetadata } from "../../core/classes/contract-metadata";
import { ContractPlatformFee } from "../../core/classes/contract-platform-fee";
import { ContractRoles } from "../../core/classes/contract-roles";
import { ContractPrimarySale } from "../../core/classes/contract-sales";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { DropClaimConditions } from "../../core/classes/drop-claim-conditions";
import { StandardErc20 } from "../../core/classes/erc-20-standard";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
import { NetworkOrSignerOrProvider, TransactionResult } from "../../core/types";
import { DropErc20ContractSchema } from "../../schema/contracts/drop-erc20";
import { SDKOptions } from "../../schema/sdk-options";
import { Amount, CurrencyValue } from "../../types";
import type { DropERC20 } from "@thirdweb-dev/contracts-js";
import type ABI from "@thirdweb-dev/contracts-js/dist/abis/DropERC20.json";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { CallOverrides, constants } from "ethers";

/**
 * Create a Drop contract for a standard crypto token or cryptocurrency.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = sdk.getContract("{{contract_address}}", "token-drop");
 * ```
 *
 */
export class TokenDrop extends StandardErc20<DropERC20> {
  static contractRoles = ["admin", "transfer"] as const;

  public abi: typeof ABI;
  public metadata: ContractMetadata<DropERC20, typeof DropErc20ContractSchema>;
  public roles: ContractRoles<
    DropERC20,
    typeof TokenDrop.contractRoles[number]
  >;
  public encoder: ContractEncoder<DropERC20>;
  public estimator: GasCostEstimator<DropERC20>;
  public sales: ContractPrimarySale<DropERC20>;
  public platformFees: ContractPlatformFee<DropERC20>;
  public events: ContractEvents<DropERC20>;
  /**
   * Configure claim conditions
   * @remarks Define who can claim Tokens, when and how many.
   * @example
   * ```javascript
   * const presaleStartTime = new Date();
   * const publicSaleStartTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
   * const claimConditions = [
   *   {
   *     startTime: presaleStartTime, // start the presale now
   *     maxQuantity: 3117.42, // limit how many tokens are released in this presale
   *     price: 0.001, // presale price per token
   *     snapshot: ['0x...', '0x...'], // limit claiming to only certain addresses
   *   },
   *   {
   *     startTime: publicSaleStartTime, // 24h after presale, start public sale
   *     price: 0.008, // public sale price per token
   *   }
   * ]);
   * await contract.claimConditions.set(claimConditions);
   * ```
   */
  public claimConditions: DropClaimConditions<DropERC20>;
  /**
   * @internal
   */
  public interceptor: ContractInterceptor<DropERC20>;

  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
    abi: typeof ABI,
    chainId: number,
    contractWrapper = new ContractWrapper<DropERC20>(
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
      DropErc20ContractSchema,
      this.storage,
    );
    this.roles = new ContractRoles(
      this.contractWrapper,
      TokenDrop.contractRoles,
    );
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.events = new ContractEvents(this.contractWrapper);
    this.sales = new ContractPrimarySale(this.contractWrapper);
    this.platformFees = new ContractPlatformFee(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
    this.claimConditions = new DropClaimConditions<DropERC20>(
      this.contractWrapper,
      this.metadata,
      this.storage,
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
   * Claim a certain amount of tokens
   * @remarks See {@link TokenDrop.claimTo}
   * @param amount - the amount of tokens to mint
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   */
  public async claim(
    amount: Amount,
    checkERC20Allowance = true,
  ): Promise<TransactionResult> {
    return this.claimTo(
      await this.contractWrapper.getSignerAddress(),
      amount,
      checkERC20Allowance,
    );
  }

  /**
   * Claim a certain amount of tokens to a specific Wallet
   *
   * @remarks Let the specified wallet claim Tokens.
   *
   * @example
   * ```javascript
   * const address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs
   * const quantity = 42.69; // how many tokens you want to claim
   *
   * const tx = await contract.claimTo(address, quantity);
   * const receipt = tx.receipt; // the transaction receipt
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param amount - Quantity of the tokens you want to claim
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   *
   * @returns - The transaction receipt
   */
  public async claimTo(
    destinationAddress: string,
    amount: Amount,
    checkERC20Allowance = true,
  ): Promise<TransactionResult> {
    return this.erc20.claimTo(destinationAddress, amount, checkERC20Allowance);
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
