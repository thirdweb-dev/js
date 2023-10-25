import { ThirdwebStorage, UploadProgressEvent } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, CallOverrides, constants } from "ethers";
import { QueryAllParams } from "../../../core/schema/QueryParams";
import { NFT, NFTMetadata, NFTMetadataOrUri } from "../../../core/schema/nft";
import { getRoleHash } from "../../common/role";
import { buildTransactionFunction } from "../../common/transactions";
import { ContractAppURI } from "../../core/classes/contract-appuri";
import { ContractEncoder } from "../../core/classes/contract-encoder";
import { ContractEvents } from "../../core/classes/contract-events";
import { ContractInterceptor } from "../../core/classes/contract-interceptor";
import { ContractMetadata } from "../../core/classes/contract-metadata";
import { ContractOwner } from "../../core/classes/contract-owner";
import { ContractPlatformFee } from "../../core/classes/contract-platform-fee";
import { ContractRoles } from "../../core/classes/contract-roles";
import { ContractRoyalty } from "../../core/classes/contract-royalty";
import { ContractPrimarySale } from "../../core/classes/contract-sales";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { DropErc1155ClaimConditions } from "../../core/classes/drop-erc1155-claim-conditions";
import { DropErc1155History } from "../../core/classes/drop-erc1155-history";
import { StandardErc1155 } from "../../core/classes/erc-1155-standard";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
import { Transaction } from "../../core/classes/transactions";
import { NetworkInput, TransactionResultWithId } from "../../core/types";
import { PaperCheckout } from "../../integrations/thirdweb-checkout";
import { Abi, AbiInput, AbiSchema } from "../../schema/contracts/custom";
import { DropErc1155ContractSchema } from "../../schema/contracts/drop-erc1155";
import { SDKOptions } from "../../schema/sdk-options";
import { Address } from "../../schema/shared/Address";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { PrebuiltEditionDrop } from "../../types/eips";
import { NFT_BASE_CONTRACT_ROLES } from "../contractRoles";

/**
 * Setup a collection of NFTs with a customizable number of each NFT that are minted as users claim them.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = await sdk.getContract("{{contract_address}}", "edition-drop");
 * ```
 *
 * @public
 */
export class EditionDrop extends StandardErc1155<PrebuiltEditionDrop> {
  private static contractRoles = NFT_BASE_CONTRACT_ROLES;

  public abi: Abi;
  public sales: ContractPrimarySale;
  public platformFees: ContractPlatformFee<PrebuiltEditionDrop>;
  public encoder: ContractEncoder<PrebuiltEditionDrop>;
  public estimator: GasCostEstimator<PrebuiltEditionDrop>;
  public events: ContractEvents<PrebuiltEditionDrop>;
  public metadata: ContractMetadata<
    PrebuiltEditionDrop,
    typeof DropErc1155ContractSchema
  >;
  public app: ContractAppURI<PrebuiltEditionDrop>;
  public roles: ContractRoles<
    PrebuiltEditionDrop,
    (typeof EditionDrop.contractRoles)[number]
  >;
  /**
   * Configure royalties
   * @remarks Set your own royalties for the entire contract or per token
   * @example
   * ```javascript
   * // royalties on the whole contract
   * contract.royalties.setDefaultRoyaltyInfo({
   *   seller_fee_basis_points: 100, // 1%
   *   fee_recipient: "0x..."
   * });
   * // override royalty for a particular token
   * contract.royalties.setTokenRoyaltyInfo(tokenId, {
   *   seller_fee_basis_points: 500, // 5%
   *   fee_recipient: "0x..."
   * });
   * ```
   */
  public royalties: ContractRoyalty<
    PrebuiltEditionDrop,
    typeof DropErc1155ContractSchema
  >;
  /**
   * Configure claim conditions for each NFT
   * @remarks Define who can claim each NFT in the edition, when and how many.
   * @example
   * ```javascript
   * const presaleStartTime = new Date();
   * const publicSaleStartTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
   * const claimConditions = [
   *   {
   *     startTime: presaleStartTime, // start the presale now
   *     maxClaimableSupply: 2, // limit how many mints for this presale
   *     price: 0.01, // presale price
   *     snapshot: ['0x...', '0x...'], // limit minting to only certain addresses
   *   },
   *   {
   *     startTime: publicSaleStartTime, // 24h after presale, start public sale
   *     price: 0.08, // public sale price
   *   }
   * ]);
   *
   * const tokenId = 0; // the id of the NFT to set claim conditions on
   * await contract.claimConditions.set(tokenId, claimConditions);
   * ```
   */
  public claimConditions: DropErc1155ClaimConditions<PrebuiltEditionDrop>;

  /**
   * Checkout
   * @remarks Create a FIAT currency checkout for your NFT drop.
   */
  public checkout: PaperCheckout<PrebuiltEditionDrop>;

  public history: DropErc1155History;
  public interceptor: ContractInterceptor<PrebuiltEditionDrop>;
  public owner: ContractOwner<PrebuiltEditionDrop>;

  constructor(
    network: NetworkInput,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
    abi: AbiInput,
    chainId: number,
    contractWrapper = new ContractWrapper<PrebuiltEditionDrop>(
      network,
      address,
      abi,
      options,
      storage,
    ),
  ) {
    super(contractWrapper, storage, chainId);
    this.abi = AbiSchema.parse(abi);
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      DropErc1155ContractSchema,
      this.storage,
    );
    this.app = new ContractAppURI(
      this.contractWrapper,
      this.metadata,
      this.storage,
    );
    this.roles = new ContractRoles(
      this.contractWrapper,
      EditionDrop.contractRoles,
    );
    this.royalties = new ContractRoyalty(this.contractWrapper, this.metadata);
    this.sales = new ContractPrimarySale(this.contractWrapper);
    this.claimConditions = new DropErc1155ClaimConditions(
      this.contractWrapper,
      this.metadata,
      this.storage,
    );
    this.events = new ContractEvents(this.contractWrapper);
    this.history = new DropErc1155History(this.events);
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.platformFees = new ContractPlatformFee(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
    this.checkout = new PaperCheckout(this.contractWrapper);
    this.owner = new ContractOwner(this.contractWrapper);
  }

  /**
   * @internal
   */
  onNetworkUpdated(network: NetworkInput): void {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  getAddress(): Address {
    return this.contractWrapper.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  // TODO getAllClaimerAddresses() - should be done via an indexer

  /**
   * Get all NFTs
   *
   * @remarks Get all the data associated with every NFT in this contract.
   *
   * By default, returns the first 100 NFTs, use queryParams to fetch more.
   *
   * @example
   * ```javascript
   * const nfts = await contract.getAll();
   * ```
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The NFT metadata for all NFTs queried.
   */
  public async getAll(queryParams?: QueryAllParams): Promise<NFT[]> {
    return this.erc1155.getAll(queryParams);
  }

  /**
   * Get all NFTs owned by a specific wallet
   *
   * @remarks Get all the data associated with the NFTs owned by a specific wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet to get the NFTs of
   * const address = "{{wallet_address}}";
   * const nfts = await contract.getOwned(address);
   * ```
   *
   * @returns The NFT metadata for all NFTs in the contract.
   */
  public async getOwned(
    walletAddress?: AddressOrEns,
    queryParams?: QueryAllParams,
  ): Promise<NFT[]> {
    return this.erc1155.getOwned(walletAddress, queryParams);
  }

  /**
   * Get the number of NFTs minted
   * @returns the total number of NFTs minted in this contract
   * @public
   */
  public async getTotalCount(): Promise<BigNumber> {
    return this.erc1155.totalCount();
  }

  /**
   * Get whether users can transfer NFTs from this contract
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
   * Create a batch of NFTs to be claimed in the future
   *
   * @remarks Create batch allows you to create a batch of many NFTs in one transaction.
   *
   * @example
   * ```javascript
   * // Custom metadata of the NFTs to create
   * const metadatas = [{
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * }, {
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"),
   * }];
   *
   * const results = await contract.createBatch(metadatas); // uploads and creates the NFTs on chain
   * const firstTokenId = results[0].id; // token id of the first created NFT
   * const firstNFT = await results[0].data(); // (optional) fetch details of the first created NFT
   * ```
   *
   * @param metadatas - The metadata to include in the batch.
   * @param options - optional upload progress callback
   */
  createBatch = /* @__PURE__ */ buildTransactionFunction(
    async (
      metadatas: NFTMetadataOrUri[],
      options?: {
        onProgress: (event: UploadProgressEvent) => void;
      },
    ): Promise<Transaction<TransactionResultWithId<NFTMetadata>[]>> => {
      return this.erc1155.lazyMint.prepare(metadatas, options);
    },
  );

  /**
   * Construct a claim transaction without executing it.
   * This is useful for estimating the gas cost of a claim transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param destinationAddress - Address you want to send the token to
   * @param tokenId - Id of the token you want to claim
   * @param quantity - Quantity of the tokens you want to claim
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   * @param claimData - Optional claim verification data (e.g. price, allowlist proof, etc...)
   *
   * @deprecated Use `contract.erc1155.claim.prepare(...args)` instead
   */
  public async getClaimTransaction(
    destinationAddress: AddressOrEns,
    tokenId: BigNumberish,
    quantity: BigNumberish,
    checkERC20Allowance = true, // TODO split up allowance checks
  ): Promise<Transaction> {
    return this.erc1155.getClaimTransaction(
      destinationAddress,
      tokenId,
      quantity,
      { checkERC20Allowance },
    );
  }

  /**
   * Claim NFTs to a specific Wallet
   *
   * @remarks Let the specified wallet claim NFTs.
   *
   * @example
   * ```javascript
   * const address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs
   * const tokenId = 0; // the id of the NFT you want to claim
   * const quantity = 1; // how many NFTs you want to claim
   *
   * const tx = await contract.claimTo(address, tokenId, quantity);
   * const receipt = tx.receipt; // the transaction receipt
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param tokenId - Id of the token you want to claim
   * @param quantity - Quantity of the tokens you want to claim
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   * @param proofs - Array of proofs
   *
   * @returns - Receipt for the transaction
   */
  claimTo = /* @__PURE__ */ buildTransactionFunction(
    async (
      destinationAddress: AddressOrEns,
      tokenId: BigNumberish,
      quantity: BigNumberish,
      checkERC20Allowance = true,
    ) => {
      return this.erc1155.claimTo.prepare(
        destinationAddress,
        tokenId,
        quantity,
        {
          checkERC20Allowance,
        },
      );
    },
  );

  /**
   * Claim a token to the connected wallet
   *
   * @remarks See {@link EditionDrop.claimTo}
   *
   * @param tokenId - Id of the token you want to claim
   * @param quantity - Quantity of the tokens you want to claim
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   * @param proofs - Array of proofs
   *
   * @returns - Receipt for the transaction
   */
  claim = /* @__PURE__ */ buildTransactionFunction(
    async (
      tokenId: BigNumberish,
      quantity: BigNumberish,
      checkERC20Allowance = true,
    ) => {
      const address = await this.contractWrapper.getSignerAddress();
      return this.claimTo.prepare(
        address,
        tokenId,
        quantity,
        checkERC20Allowance,
      );
    },
  );

  /**
   * Burn a specified amount of a NFT
   *
   * @param tokenId - the token Id to burn
   * @param amount - amount to burn
   *
   * @example
   * ```javascript
   * const result = await contract.burnTokens(tokenId, amount);
   * ```
   */
  burnTokens = /* @__PURE__ */ buildTransactionFunction(
    async (tokenId: BigNumberish, amount: BigNumberish) => {
      return this.erc1155.burn.prepare(tokenId, amount);
    },
  );

  /**
   * @internal
   */
  public async prepare<
    TMethod extends
      keyof PrebuiltEditionDrop["functions"] = keyof PrebuiltEditionDrop["functions"],
  >(
    method: string & TMethod,
    args: any[] & Parameters<PrebuiltEditionDrop["functions"][TMethod]>,
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
      keyof PrebuiltEditionDrop["functions"] = keyof PrebuiltEditionDrop["functions"],
  >(
    functionName: string & TMethod,
    args?: Parameters<PrebuiltEditionDrop["functions"][TMethod]>,
    overrides?: CallOverrides,
  ): Promise<ReturnType<PrebuiltEditionDrop["functions"][TMethod]>> {
    return this.contractWrapper.call(functionName, args, overrides);
  }
}
