import { getRoleHash } from "../common";
import { FEATURE_NFT_REVEALABLE } from "../constants/erc721-features";
import { TransactionTask } from "../core/classes/TransactionTask";
import { ContractEncoder } from "../core/classes/contract-encoder";
import { ContractEvents } from "../core/classes/contract-events";
import { ContractInterceptor } from "../core/classes/contract-interceptor";
import { ContractMetadata } from "../core/classes/contract-metadata";
import { ContractPlatformFee } from "../core/classes/contract-platform-fee";
import { ContractRoles } from "../core/classes/contract-roles";
import { ContractRoyalty } from "../core/classes/contract-royalty";
import { ContractPrimarySale } from "../core/classes/contract-sales";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import { DelayedReveal } from "../core/classes/delayed-reveal";
import { DropClaimConditions } from "../core/classes/drop-claim-conditions";
import { Erc721 } from "../core/classes/erc-721";
import { Erc721Burnable } from "../core/classes/erc-721-burnable";
import { Erc721Claimable } from "../core/classes/erc-721-claimable";
import { Erc721Enumerable } from "../core/classes/erc-721-enumerable";
import { Erc721LazyMintable } from "../core/classes/erc-721-lazymintable";
import { Erc721Supply } from "../core/classes/erc-721-supply";
import { Erc721WithQuantitySignatureMintable } from "../core/classes/erc-721-with-quantity-signature-mintable";
import { GasCostEstimator } from "../core/classes/gas-cost-estimator";
import {
  NetworkOrSignerOrProvider,
  TransactionResult,
  TransactionResultWithId,
} from "../core/types";
import { PaperCheckout } from "../integrations/paper_xyz";
import { DropErc721ContractSchema } from "../schema/contracts/drop-erc721";
import { SDKOptions } from "../schema/sdk-options";
import {
  NFTMetadata,
  NFTMetadataOrUri,
  NFTMetadataOwner,
} from "../schema/tokens/common";
import { UploadProgressEvent } from "../types";
import { DEFAULT_QUERY_ALL_COUNT, QueryAllParams } from "../types/QueryParams";
import { SignatureDrop as SignatureDropContract } from "@thirdweb-dev/contracts-js";
import ABI from "@thirdweb-dev/contracts-js/dist/abis/SignatureDrop.json";
import { IStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, constants } from "ethers";

/**
 * Setup a collection of NFTs where when it comes to minting, you can authorize
 * some external party to mint tokens on your contract, and specify what exactly
 * will be minted by that external party..
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = sdk.getSignatureDrop("{{contract_address}}");
 * ```
 *
 * @public
 */
export class SignatureDrop extends Erc721<SignatureDropContract> {
  static contractType = "signature-drop" as const;
  static contractRoles = ["admin", "minter", "transfer"] as const;
  static contractAbi = ABI as any;
  /**
   * @internal
   */
  static schema = DropErc721ContractSchema;

  public encoder: ContractEncoder<SignatureDropContract>;
  public estimator: GasCostEstimator<SignatureDropContract>;
  public metadata: ContractMetadata<
    SignatureDropContract,
    typeof SignatureDrop.schema
  >;
  public sales: ContractPrimarySale<SignatureDropContract>;
  public platformFees: ContractPlatformFee<SignatureDropContract>;
  public events: ContractEvents<SignatureDropContract>;
  public roles: ContractRoles<
    SignatureDropContract,
    typeof SignatureDrop.contractRoles[number]
  >;
  /**
   * @internal
   */
  public interceptor: ContractInterceptor<SignatureDropContract>;
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
    SignatureDropContract,
    typeof SignatureDrop.schema
  >;
  /**
   * Configure claim conditions
   * @remarks Define who can claim NFTs in the collection, when and how many.
   * @example
   * ```javascript
   * const presaleStartTime = new Date();
   * const claimCondition = {
   *     startTime: presaleStartTime, // start the presale now
   *     maxQuantity: 2, // limit how many mints for this presale
   *     price: 0.01, // presale price
   *     snapshot: ['0x...', '0x...'], // limit minting to only certain addresses
   * };
   * await contract.claimConditions.set([claimCondition]);
   * ```
   */
  public claimConditions = this.drop?.claim
    ?.conditions as DropClaimConditions<SignatureDropContract>;
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
  public revealer: DelayedReveal<SignatureDropContract>;
  /**
   * Signature Minting
   * @remarks Generate dynamic NFTs with your own signature, and let others mint them using that signature.
   * @example
   * ```javascript
   * // see how to craft a payload to sign in the `contract.signature.generate()` documentation
   * const signedPayload = contract.signature.generate(payload);
   *
   * // now anyone can mint the NFT
   * const tx = contract.signature.mint(signedPayload);
   * const receipt = tx.receipt; // the mint transaction receipt
   * const mintedId = tx.id; // the id of the NFT minted
   * ```
   */
  override signature = super.signature as Erc721WithQuantitySignatureMintable;

  /**
   * Checkout
   * @remarks Create a FIAT currency checkout for your NFT drop.
   */
  public checkout: PaperCheckout<SignatureDropContract>;

  private _query = this.query as Erc721Supply;
  private _owned = this._query.owned as Erc721Enumerable;
  private _burn = this.burn as Erc721Burnable;
  private _drop = this.drop as Erc721LazyMintable;
  private _claim = this.drop?.claim as Erc721Claimable;

  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    storage: IStorage,
    options: SDKOptions = {},
    contractWrapper = new ContractWrapper<SignatureDropContract>(
      network,
      address,
      SignatureDrop.contractAbi,
      options,
    ),
  ) {
    super(contractWrapper, storage, options);
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      SignatureDrop.schema,
      this.storage,
    );
    this.roles = new ContractRoles(
      this.contractWrapper,
      SignatureDrop.contractRoles,
    );
    this.royalties = new ContractRoyalty(this.contractWrapper, this.metadata);
    this.sales = new ContractPrimarySale(this.contractWrapper);
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.events = new ContractEvents(this.contractWrapper);
    this.platformFees = new ContractPlatformFee(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
    this.revealer = new DelayedReveal(
      this.contractWrapper,
      this.storage,
      FEATURE_NFT_REVEALABLE.name,
      () => this.nextTokenIdToMint(),
    );
    this.signature = new Erc721WithQuantitySignatureMintable(
      this.contractWrapper,
      this.storage,
    );

    this.checkout = new PaperCheckout(this.contractWrapper);
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get All Minted NFTs
   *
   * @remarks Get all the data associated with every NFT in this contract.
   *
   * By default, returns the first 100 NFTs, use queryParams to fetch more.
   *
   * @example
   * ```javascript
   * const nfts = await contract.getAll();
   * console.log(nfts);
   * ```
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The NFT metadata for all NFTs queried.
   */
  public async getAll(
    queryParams?: QueryAllParams,
  ): Promise<NFTMetadataOwner[]> {
    return this._query.all(queryParams);
  }

  /**
   * Get Owned NFTs
   *
   * @remarks Get all the data associated with the NFTs owned by a specific wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet to get the NFTs of
   * const address = "{{wallet_address}}";
   * const nfts = await contract.getOwned(address);
   * console.log(nfts);
   * ```
   * @param walletAddress - the wallet address to query, defaults to the connected wallet
   * @returns The NFT metadata for all NFTs in the contract.
   */
  public async getOwned(walletAddress?: string): Promise<NFTMetadataOwner[]> {
    return this._owned.all(walletAddress);
  }

  /**
   * {@inheritDoc Erc721Enumerable.tokendIds}
   */
  public async getOwnedTokenIds(walletAddress?: string): Promise<BigNumber[]> {
    return this._owned.tokenIds(walletAddress);
  }

  /**
   * Get the total count NFTs in this drop contract, both claimed and unclaimed
   */
  public async totalSupply() {
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
  public async getAllClaimed(
    queryParams?: QueryAllParams,
  ): Promise<NFTMetadataOwner[]> {
    const start = BigNumber.from(queryParams?.start || 0).toNumber();
    const count = BigNumber.from(
      queryParams?.count || DEFAULT_QUERY_ALL_COUNT,
    ).toNumber();
    const maxId = Math.min(
      (await this.totalClaimedSupply()).toNumber(),
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
      Math.max((await this.totalClaimedSupply()).toNumber(), start),
    );
    const maxId = BigNumber.from(
      Math.min(
        (
          await this.contractWrapper.readContract.nextTokenIdToMint()
        ).toNumber(),
        firstTokenId.toNumber() + count,
      ),
    );

    return await Promise.all(
      Array.from(Array(maxId.sub(firstTokenId).toNumber()).keys()).map((i) =>
        this.getTokenMetadata(firstTokenId.add(i).toString()),
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
   * @returns the claimed supply
   */
  public async totalClaimedSupply(): Promise<BigNumber> {
    return await this.contractWrapper.readContract.totalMinted();
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
    const maxSupply =
      await this.contractWrapper.readContract.nextTokenIdToMint();

    return maxSupply.sub(await this.totalClaimedSupply());
  }

  /**
   * Get whether users can transfer NFTs from this contract
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
  public async createBatch(
    metadatas: NFTMetadataOrUri[],
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    },
  ): Promise<TransactionResultWithId<NFTMetadata>[]> {
    return this._drop.lazyMint(metadatas, options);
  }

  /**
   * Construct a claim transaction without executing it.
   * This is useful for estimating the gas cost of a claim transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param destinationAddress
   * @param quantity
   * @param checkERC20Allowance
   */
  public async getClaimTransaction(
    destinationAddress: string,
    quantity: BigNumberish,
    checkERC20Allowance = true, // TODO split up allowance checks
  ): Promise<TransactionTask> {
    return this._claim.getClaimTransaction(
      destinationAddress,
      quantity,
      checkERC20Allowance,
    );
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
   * const receipt = tx.receipt; // the transaction receipt
   * const claimedTokenId = tx.id; // the id of the NFT claimed
   * const claimedNFT = await tx.data(); // (optional) get the claimed NFT metadata
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param quantity - Quantity of the tokens you want to claim
   * @param checkERC20Allowance - Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer
   *
   * @returns - an array of results containing the id of the token claimed, the transaction receipt and a promise to optionally fetch the nft metadata
   */
  public async claimTo(
    destinationAddress: string,
    quantity: BigNumberish,
    checkERC20Allowance = true,
  ): Promise<TransactionResultWithId<NFTMetadataOwner>[]> {
    return this._claim.to(destinationAddress, quantity, checkERC20Allowance);
  }

  /**
   * Claim NFTs to the connected wallet.
   *
   * @remarks See {@link NFTDrop.claimTo}
   *
   * @returns - an array of results containing the id of the token claimed, the transaction receipt and a promise to optionally fetch the nft metadata
   */
  public async claim(
    quantity: BigNumberish,
    checkERC20Allowance = true,
  ): Promise<TransactionResultWithId<NFTMetadataOwner>[]> {
    return this.claimTo(
      await this.contractWrapper.getSignerAddress(),
      quantity,
      checkERC20Allowance,
    );
  }

  /**
   * Burn a single NFT
   * @param tokenId - the token Id to burn
   * @example
   * ```javascript
   * const result = await contract.burnToken(tokenId);
   * ```
   */
  public async burnToken(tokenId: BigNumberish): Promise<TransactionResult> {
    return this._burn.token(tokenId);
  }
}
