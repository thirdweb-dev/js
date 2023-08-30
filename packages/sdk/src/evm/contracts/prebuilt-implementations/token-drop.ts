import { getRoleHash } from "../../common/role";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { buildTransactionFunction } from "../../common/transactions";
import { ContractAppURI } from "../../core/classes/contract-appuri";
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
import { Transaction } from "../../core/classes/transactions";
import { NetworkInput } from "../../core/types";
import { Address } from "../../schema/shared/Address";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { Abi, AbiInput, AbiSchema } from "../../schema/contracts/custom";
import { DropErc20ContractSchema } from "../../schema/contracts/drop-erc20";
import { SDKOptions } from "../../schema/sdk-options";
import type { CurrencyValue, Amount } from "../../types/currency";
import { PrebuiltTokenDrop } from "../../types/eips";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { CallOverrides, constants } from "ethers";
import { TOKEN_DROP_CONTRACT_ROLES } from "../contractRoles";

/**
 * Create a Drop contract for a standard crypto token or cryptocurrency.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = await sdk.getContract("{{contract_address}}", "token-drop");
 * ```
 *
 */
export class TokenDrop extends StandardErc20<PrebuiltTokenDrop> {
  static contractRoles = TOKEN_DROP_CONTRACT_ROLES;

  public abi: Abi;
  public metadata: ContractMetadata<
    PrebuiltTokenDrop,
    typeof DropErc20ContractSchema
  >;
  public app: ContractAppURI<PrebuiltTokenDrop>;
  public roles: ContractRoles<
    PrebuiltTokenDrop,
    (typeof TokenDrop.contractRoles)[number]
  >;
  public encoder: ContractEncoder<PrebuiltTokenDrop>;
  public estimator: GasCostEstimator<PrebuiltTokenDrop>;
  public sales: ContractPrimarySale;
  public platformFees: ContractPlatformFee<PrebuiltTokenDrop>;
  public events: ContractEvents<PrebuiltTokenDrop>;
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
  public claimConditions: DropClaimConditions<PrebuiltTokenDrop>;
  /**
   * @internal
   */
  public interceptor: ContractInterceptor<PrebuiltTokenDrop>;

  constructor(
    network: NetworkInput,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
    abi: AbiInput,
    chainId: number,
    contractWrapper = new ContractWrapper<PrebuiltTokenDrop>(
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
      DropErc20ContractSchema,
      this.storage,
    );

    this.app = new ContractAppURI(
      this.contractWrapper,
      this.metadata,
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
    this.claimConditions = new DropClaimConditions<PrebuiltTokenDrop>(
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

  public async getVoteBalanceOf(account: AddressOrEns): Promise<CurrencyValue> {
    return await this.erc20.getValue(
      await this.contractWrapper.readContract.getVotes(
        await resolveAddress(account),
      ),
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
    return await this.contractWrapper.readContract.delegates(
      await resolveAddress(account),
    );
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
  claim = /* @__PURE__ */ buildTransactionFunction(
    async (amount: Amount, checkERC20Allowance = true) => {
      return this.claimTo.prepare(
        await this.contractWrapper.getSignerAddress(),
        amount,
        checkERC20Allowance,
      );
    },
  );

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
  claimTo = /* @__PURE__ */ buildTransactionFunction(
    async (
      destinationAddress: AddressOrEns,
      amount: Amount,
      checkERC20Allowance = true,
    ) => {
      return this.erc20.claimTo.prepare(destinationAddress, amount, {
        checkERC20Allowance,
      });
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
  burnTokens = /* @__PURE__ */ buildTransactionFunction(
    async (amount: Amount) => {
      return this.erc20.burn.prepare(amount);
    },
  );
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
      keyof PrebuiltTokenDrop["functions"] = keyof PrebuiltTokenDrop["functions"],
  >(
    method: string & TMethod,
    args: any[] & Parameters<PrebuiltTokenDrop["functions"][TMethod]>,
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
      keyof PrebuiltTokenDrop["functions"] = keyof PrebuiltTokenDrop["functions"],
  >(
    functionName: string & TMethod,
    args?: Parameters<PrebuiltTokenDrop["functions"][TMethod]>,
    overrides?: CallOverrides,
  ): Promise<ReturnType<PrebuiltTokenDrop["functions"][TMethod]>> {
    return this.contractWrapper.call(functionName, args, overrides);
  }
}
