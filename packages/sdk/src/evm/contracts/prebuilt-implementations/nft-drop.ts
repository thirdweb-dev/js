import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, CallOverrides, constants } from "ethers";
import {
  DEFAULT_QUERY_ALL_COUNT,
  QueryAllParams,
} from "../../../core/schema/QueryParams";
import { NFT, NFTMetadata, NFTMetadataOrUri } from "../../../core/schema/nft";
import { getRoleHash } from "../../common/role";
import { buildTransactionFunction } from "../../common/transactions";
import { FEATURE_NFT_REVEALABLE } from "../../constants/erc721-features";
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
import { DelayedReveal } from "../../core/classes/delayed-reveal";
import { DropClaimConditions } from "../../core/classes/drop-claim-conditions";
import { StandardErc721 } from "../../core/classes/erc-721-standard";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
import { Transaction } from "../../core/classes/transactions";
import { NetworkInput, TransactionResultWithId } from "../../core/types";
import { PaperCheckout } from "../../integrations/thirdweb-checkout";
import { Abi, AbiInput, AbiSchema } from "../../schema/contracts/custom";
import { DropErc721ContractSchema } from "../../schema/contracts/drop-erc721";
import { SDKOptions } from "../../schema/sdk-options";
import { Address } from "../../schema/shared/Address";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { PrebuiltNFTDrop } from "../../types/eips";
import { UploadProgressEvent } from "../../types/events";
import { NFT_BASE_CONTRACT_ROLES } from "../contractRoles";

/**
 * Setup a collection of one-of-one NFTs that are minted as users claim them.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = await sdk.getContract("{{contract_address}}", "nft-drop");
 * ```
 *
 * @public
 */
export class NFTDrop extends StandardErc721<PrebuiltNFTDrop> {
  static contractRoles = NFT_BASE_CONTRACT_ROLES;

  public abi: Abi;
  public encoder: ContractEncoder<PrebuiltNFTDrop>;
  public estimator: GasCostEstimator<PrebuiltNFTDrop>;
  public metadata: ContractMetadata<
    PrebuiltNFTDrop,
    typeof DropErc721ContractSchema
  >;
  public app: ContractAppURI<PrebuiltNFTDrop>;
  public sales: ContractPrimarySale;
  public platformFees: ContractPlatformFee<PrebuiltNFTDrop>;
  public events: ContractEvents<PrebuiltNFTDrop>;
  public roles: ContractRoles<
    PrebuiltNFTDrop,
    (typeof NFTDrop.contractRoles)[number]
  >;
  /**
   * @internal
   */
  public interceptor: ContractInterceptor<PrebuiltNFTDrop>;
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
    PrebuiltNFTDrop,
    typeof DropErc721ContractSchema
  >;
  /**
   * Configure claim conditions
   * @remarks Define who can claim NFTs in the collection, when and how many.
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
   * await contract.claimConditions.set(claimConditions);
   * ```
   */
  public claimConditions: DropClaimConditions<PrebuiltNFTDrop>;
  /**
   * Delayed reveal
   * @remarks Create a batch of encrypted NFTs that can be revealed at a later time.
   * @example
   * ```javascript
   * // the real NFTs, these will be encrypted until you reveal them
   * const realNFTs = [{
   *   name: "Common NFT #1",
   *   description: "Common NFT, one of many.",
   *   image: fs.readFileSync("path/to/image.png"),
   * }, {
   *   name: "Super Rare NFT #2",
   *   description: "You got a Super Rare NFT!",
   *   image: fs.readFileSync("path/to/image.png"),
   * }];
   * // A placeholder NFT that people will get immediately in their wallet, and will be converted to the real NFT at reveal time
   * const placeholderNFT = {
   *   name: "Hidden NFT",
   *   description: "Will be revealed next week!"
   * };
   * // Create and encrypt the NFTs
   * await contract.revealer.createDelayedRevealBatch(
   *   placeholderNFT,
   *   realNFTs,
   *   "my secret password",
   * );
   * // Whenever you're ready, reveal your NFTs at any time
   * const batchId = 0; // the batch to reveal
   * await contract.revealer.reveal(batchId, "my secret password");
   * ```
   */
  public revealer: DelayedReveal<PrebuiltNFTDrop>;

  /**
   * Checkout
   * @remarks Create a FIAT currency checkout for your NFT drop.
   */
  public checkout: PaperCheckout<PrebuiltNFTDrop>;

  public owner: ContractOwner<PrebuiltNFTDrop>;

  constructor(
    network: NetworkInput,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
    abi: AbiInput,
    chainId: number,
    contractWrapper = new ContractWrapper<PrebuiltNFTDrop>(
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
      DropErc721ContractSchema,
      this.storage,
    );
    this.app = new ContractAppURI(
      this.contractWrapper,
      this.metadata,
      this.storage,
    );
    this.roles = new ContractRoles(this.contractWrapper, NFTDrop.contractRoles);
    this.royalties = new ContractRoyalty(this.contractWrapper, this.metadata);
    this.sales = new ContractPrimarySale(this.contractWrapper);
    this.claimConditions = new DropClaimConditions(
      this.contractWrapper,
      this.metadata,
      this.storage,
    );
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.events = new ContractEvents(this.contractWrapper);
    this.platformFees = new ContractPlatformFee(this.contractWrapper);
    this.revealer = new DelayedReveal(
      this.contractWrapper,
      this.storage,
      FEATURE_NFT_REVEALABLE.name,
      () => this.erc721.nextTokenIdToMint(),
    );
    this.interceptor = new ContractInterceptor(this.contractWrapper);
    this.owner = new ContractOwner(this.contractWrapper);

    this.checkout = new PaperCheckout(this.contractWrapper);
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

  /**
   * Get the total count NFTs in this drop contract, both claimed and unclaimed
   */
  override async totalSupply() {
    const claimed = await this.totalClaimedSupply();
    const unclaimed = await this.totalUnclaimedSupply();
    return claimed.add(unclaimed);
  }

  /**
   * Get All Claimed NFTs
   *
   * @remarks Fetch all the NFTs (and their owners) that have been claimed in this Drop.
   *
   * * @example
   * ```javascript
   * const claimedNFTs = await contract.getAllClaimed();
   * const firstOwner = claimedNFTs[0].owner;
   * ```
   *
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The NFT metadata and their ownersfor all NFTs queried.
   */
  public async getAllClaimed(queryParams?: QueryAllParams): Promise<NFT[]> {
    const start = BigNumber.from(queryParams?.start || 0).toNumber();
    const count = BigNumber.from(
      queryParams?.count || DEFAULT_QUERY_ALL_COUNT,
    ).toNumber();
    const maxId = Math.min(
      (await this.contractWrapper.read("nextTokenIdToClaim", [])).toNumber(),
      start + count,
    );
    return await Promise.all(
      Array.from(Array(maxId).keys()).map((i) => this.get(i.toString())),
    );
  }

  /**
   * Get All Unclaimed NFTs
   *
   * @remarks Fetch all the NFTs that have been not been claimed yet in this Drop.
   *
   * * @example
   * ```javascript
   * const unclaimedNFTs = await contract.getAllUnclaimed();
   * const firstUnclaimedNFT = unclaimedNFTs[0].name;
   * ```
   *
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The NFT metadata for all NFTs queried.
   */
  public async getAllUnclaimed(
    queryParams?: QueryAllParams,
  ): Promise<NFTMetadata[]> {
    const start = BigNumber.from(queryParams?.start || 0).toNumber();
    const count = BigNumber.from(
      queryParams?.count || DEFAULT_QUERY_ALL_COUNT,
    ).toNumber();
    const firstTokenId = BigNumber.from(
      Math.max(
        (await this.contractWrapper.read("nextTokenIdToClaim", [])).toNumber(),
        start,
      ),
    );
    const maxId = BigNumber.from(
      Math.min(
        (await this.contractWrapper.read("nextTokenIdToMint", [])).toNumber(),
        firstTokenId.toNumber() + count,
      ),
    );

    return await Promise.all(
      Array.from(Array(maxId.sub(firstTokenId).toNumber()).keys()).map((i) =>
        this.erc721.getTokenMetadata(firstTokenId.add(i).toString()),
      ),
    );
  }

  /**
   * Get the claimed supply
   *
   * @remarks Get the number of claimed NFTs in this Drop.
   *
   * * @example
   * ```javascript
   * const claimedNFTCount = await contract.totalClaimedSupply();
   * console.log(`NFTs claimed so far: ${claimedNFTCount}`);
   * ```
   * @returns the unclaimed supply
   */
  public async totalClaimedSupply(): Promise<BigNumber> {
    return this.erc721.totalClaimedSupply();
  }

  /**
   * Get the unclaimed supply
   *
   * @remarks Get the number of unclaimed NFTs in this Drop.
   *
   * * @example
   * ```javascript
   * const unclaimedNFTCount = await contract.totalUnclaimedSupply();
   * console.log(`NFTs left to claim: ${unclaimedNFTCount}`);
   * ```
   * @returns the unclaimed supply
   */
  public async totalUnclaimedSupply(): Promise<BigNumber> {
    return this.erc721.totalUnclaimedSupply();
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
   * Create a batch of unique NFTs to be claimed in the future
   *
   * @remarks Create batch allows you to create a batch of many unique NFTs in one transaction.
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
      return this.erc721.lazyMint.prepare(metadatas, options);
    },
  );

  /**
   * Construct a claim transaction without executing it.
   * This is useful for estimating the gas cost of a claim transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param destinationAddress
   * @param quantity
   * @param checkERC20Allowance
   *
   * @deprecated Use `contract.erc721.claim.prepare(...args)` instead
   */
  public async getClaimTransaction(
    destinationAddress: AddressOrEns,
    quantity: BigNumberish,
    checkERC20Allowance = true,
  ): Promise<Transaction> {
    return this.erc721.getClaimTransaction(destinationAddress, quantity, {
      checkERC20Allowance,
    });
  }

  /**
   * Claim unique NFTs to a specific Wallet
   *
   * @remarks Let the specified wallet claim NFTs.
   *
   * @example
   * ```javascript
   * const address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs
   * const quantity = 1; // how many unique NFTs you want to claim
   *
   * const tx = await contract.claimTo(address, quantity);
   * const receipt = tx[0].receipt; // the transaction receipt
   * const claimedTokenId = tx[0].id; // the id of the NFT claimed
   * const claimedNFT = await tx[0].data(); // (optional) get the claimed NFT metadata
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param quantity - Quantity of the tokens you want to claim
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   *
   * @returns - an array of results containing the id of the token claimed, the transaction receipt and a promise to optionally fetch the nft metadata
   */
  claimTo = /* @__PURE__ */ buildTransactionFunction(
    async (
      destinationAddress: AddressOrEns,
      quantity: BigNumberish,
      checkERC20Allowance = true,
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      return this.erc721.claimTo.prepare(destinationAddress, quantity, {
        checkERC20Allowance,
      });
    },
  );

  /**
   * Claim NFTs to the connected wallet.
   *
   * @remarks See {@link NFTDrop.claimTo}
   *
   * @returns - an array of results containing the id of the token claimed, the transaction receipt and a promise to optionally fetch the nft metadata
   */
  claim = /* @__PURE__ */ buildTransactionFunction(
    async (
      quantity: BigNumberish,
      checkERC20Allowance = true,
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      return this.claimTo.prepare(
        await this.contractWrapper.getSignerAddress(),
        quantity,
        checkERC20Allowance,
      );
    },
  );

  /**
   * Burn a single NFT
   *
   * @param tokenId - the token Id to burn
   *
   * @example
   * ```javascript
   * const result = await contract.burnToken(tokenId);
   * ```
   *
   */
  burn = /* @__PURE__ */ buildTransactionFunction(
    async (tokenId: BigNumberish) => {
      return this.erc721.burn.prepare(tokenId);
    },
  );

  /******************************
   * STANDARD ERC721 FUNCTIONS
   ******************************/

  /**
   * Get a single NFT
   *
   * @example
   * ```javascript
   * const tokenId = 0;
   * const nft = await contract.get(tokenId);
   * ```
   * @param tokenId - the tokenId of the NFT to retrieve
   * @returns The NFT metadata
   */
  public async get(tokenId: BigNumberish): Promise<NFT> {
    return this.erc721.get(tokenId);
  }

  /**
   * Get the current owner of a given NFT within this Contract
   *
   * @param tokenId - the tokenId of the NFT
   * @returns the address of the owner
   */
  public async ownerOf(tokenId: BigNumberish): Promise<string> {
    return this.erc721.ownerOf(tokenId);
  }

  /**
   * Get NFT Balance
   *
   * @remarks Get a wallets NFT balance (number of NFTs in this contract owned by the wallet).
   *
   * @example
   * ```javascript
   * const walletAddress = "{{wallet_address}}";
   * const balance = await contract.balanceOf(walletAddress);
   * console.log(balance);
   * ```
   */
  public async balanceOf(address: AddressOrEns): Promise<BigNumber> {
    return this.erc721.balanceOf(address);
  }

  /**
   * Get NFT Balance for the currently connected wallet
   */
  public async balance(): Promise<BigNumber> {
    return this.erc721.balance();
  }

  /**
   * Get whether this wallet has approved transfers from the given operator
   * @param address - the wallet address
   * @param operator - the operator address
   */
  public async isApproved(
    address: AddressOrEns,
    operator: AddressOrEns,
  ): Promise<boolean> {
    return this.erc721.isApproved(address, operator);
  }

  /**
   * Transfer an NFT
   *
   * @remarks Transfer an NFT from the connected wallet to another wallet.
   *
   * @example
   * ```javascript
   * const walletAddress = "{{wallet_address}}";
   * const tokenId = 0;
   * await contract.transfer(walletAddress, tokenId);
   * ```
   */
  transfer = /* @__PURE__ */ buildTransactionFunction(
    async (to: AddressOrEns, tokenId: BigNumberish) => {
      return this.erc721.transfer.prepare(to, tokenId);
    },
  );

  /**
   * Approve or remove operator as an operator for the caller. Operators can call transferFrom or safeTransferFrom for any token owned by the caller.
   * @param operator - the operator's address
   * @param approved - whether to approve or remove
   *
   * @internal
   */
  setApprovalForAll = /* @__PURE__ */ buildTransactionFunction(
    async (operator: AddressOrEns, approved: boolean) => {
      return this.erc721.setApprovalForAll.prepare(operator, approved);
    },
  );

  /**
   * Approve an operator for the NFT owner. Operators can call transferFrom or safeTransferFrom for the specified token.
   * @param operator - the operator's address
   * @param tokenId - the tokenId to give approval for
   *
   * @internal
   */
  setApprovalForToken = /* @__PURE__ */ buildTransactionFunction(
    async (operator: AddressOrEns, tokenId: BigNumberish) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "approve",
        args: [operator, tokenId],
      });
    },
  );

  /**
   * @internal
   */
  public async prepare<
    TMethod extends
      keyof PrebuiltNFTDrop["functions"] = keyof PrebuiltNFTDrop["functions"],
  >(
    method: string & TMethod,
    args: any[] & Parameters<PrebuiltNFTDrop["functions"][TMethod]>,
    overrides?: CallOverrides,
  ) {
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method,
      args,
      overrides,
    });
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/
  /**
   * @internal
   */
  public async call<
    TMethod extends
      keyof PrebuiltNFTDrop["functions"] = keyof PrebuiltNFTDrop["functions"],
  >(
    functionName: string & TMethod,
    args?: Parameters<PrebuiltNFTDrop["functions"][TMethod]>,
    overrides?: CallOverrides,
  ): Promise<ReturnType<PrebuiltNFTDrop["functions"][TMethod]>> {
    return this.contractWrapper.call(functionName, args, overrides);
  }
}
