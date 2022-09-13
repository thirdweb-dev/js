import { getRoleHash } from "../../common";
import { ContractEncoder } from "../../core/classes/contract-encoder";
import { ContractEvents } from "../../core/classes/contract-events";
import { ContractInterceptor } from "../../core/classes/contract-interceptor";
import { ContractMetadata } from "../../core/classes/contract-metadata";
import { ContractPlatformFee } from "../../core/classes/contract-platform-fee";
import { ContractRoles } from "../../core/classes/contract-roles";
import { ContractRoyalty } from "../../core/classes/contract-royalty";
import { ContractPrimarySale } from "../../core/classes/contract-sales";
import { ContractWrapper } from "../../core/classes/contract-wrapper";
import { Erc721 } from "../../core/classes/erc-721";
import { StandardErc721 } from "../../core/classes/erc-721-standard";
import { Erc721WithQuantitySignatureMintable } from "../../core/classes/erc-721-with-quantity-signature-mintable";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
import type {
  NetworkOrSignerOrProvider,
  TransactionResult,
  TransactionResultWithId,
} from "../../core/types";
import { NFTMetadataOrUri, NFTMetadataOwner } from "../../schema";
import { TokenErc721ContractSchema } from "../../schema/contracts/token-erc721";
import { SDKOptions } from "../../schema/sdk-options";
import type { TokenERC721 } from "@thirdweb-dev/contracts-js";
import type ABI from "@thirdweb-dev/contracts-js/dist/abis/TokenERC721.json";
import { IStorage } from "@thirdweb-dev/storage";
import { BigNumberish, constants } from "ethers";

/**
 * Create a collection of one-of-one NFTs.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = sdk.getNFTCollection("{{contract_address}}");
 * ```
 *
 * @public
 */
export class NFTCollectionImpl extends StandardErc721<TokenERC721> {
  static contractRoles = ["admin", "minter", "transfer"] as const;

  public abi: typeof ABI;
  public metadata: ContractMetadata<
    TokenERC721,
    typeof TokenErc721ContractSchema
  >;
  public roles: ContractRoles<
    TokenERC721,
    typeof NFTCollectionImpl.contractRoles[number]
  >;
  public encoder: ContractEncoder<TokenERC721>;
  public estimator: GasCostEstimator<TokenERC721>;
  public events: ContractEvents<TokenERC721>;
  public sales: ContractPrimarySale<TokenERC721>;
  public platformFees: ContractPlatformFee<TokenERC721>;
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
    TokenERC721,
    typeof TokenErc721ContractSchema
  >;

  /**
   * Signature Minting
   * @remarks Generate dynamic NFTs with your own signature, and let others mint them using that signature.
   * @example
   * ```javascript
   * // see how to craft a payload to sign in the `contract.signature.generate()` documentation
   * const signedPayload = contract.signature().generate(payload);
   *
   * // now anyone can mint the NFT
   * const tx = contract.signature.mint(signedPayload);
   * const receipt = tx.receipt; // the mint transaction receipt
   * const mintedId = tx.id; // the id of the NFT minted
   * ```
   */
  public signature: Erc721WithQuantitySignatureMintable;

  /**
   * @internal
   */
  public interceptor: ContractInterceptor<TokenERC721>;
  public erc721: Erc721<TokenERC721>;

  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    storage: IStorage,
    options: SDKOptions = {},
    abi: typeof ABI,
    contractWrapper = new ContractWrapper<TokenERC721>(
      network,
      address,
      abi,
      options,
    ),
  ) {
    super(contractWrapper, storage);
    this.abi = abi;
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      TokenErc721ContractSchema,
      this.storage,
    );
    this.roles = new ContractRoles(
      this.contractWrapper,
      NFTCollectionImpl.contractRoles,
    );
    this.royalties = new ContractRoyalty(this.contractWrapper, this.metadata);
    this.sales = new ContractPrimarySale(this.contractWrapper);
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.events = new ContractEvents(this.contractWrapper);
    this.platformFees = new ContractPlatformFee(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
    this.erc721 = new Erc721(this.contractWrapper, this.storage);
    this.signature = new Erc721WithQuantitySignatureMintable(
      this.contractWrapper,
      this.storage,
    );
  }

  /**
   * @internal
   */
  onNetworkUpdated(network: NetworkOrSignerOrProvider): void {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

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
   * Mint a unique NFT
   *
   * @remarks Mint a unique NFT to a specified wallet.
   *
   * @example
   * ```javascript*
   * // Custom metadata of the NFT, note that you can fully customize this metadata with other properties.
   * const metadata = {
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * };
   *
   * const tx = await contract.mint(metadata);
   * const receipt = tx.receipt; // the transaction receipt
   * const tokenId = tx.id; // the id of the NFT minted
   * const nft = await tx.data(); // (optional) fetch details of minted NFT
   * ```
   */
  public async mint(
    metadata: NFTMetadataOrUri,
  ): Promise<TransactionResultWithId<NFTMetadataOwner>> {
    return this.erc721.mint(metadata);
  }

  /**
   * Mint a unique NFT
   *
   * @remarks Mint a unique NFT to a specified wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet you want to mint the NFT to
   * const walletAddress = "{{wallet_address}}";
   *
   * // Custom metadata of the NFT, note that you can fully customize this metadata with other properties.
   * const metadata = {
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * };
   *
   * const tx = await contract.mintTo(walletAddress, metadata);
   * const receipt = tx.receipt; // the transaction receipt
   * const tokenId = tx.id; // the id of the NFT minted
   * const nft = await tx.data(); // (optional) fetch details of minted NFT
   * ```
   */
  public async mintTo(
    walletAddress: string,
    metadata: NFTMetadataOrUri,
  ): Promise<TransactionResultWithId<NFTMetadataOwner>> {
    return this.erc721.mintTo(walletAddress, metadata);
  }

  /**
   * Mint Many unique NFTs
   *
   * @remarks Mint many unique NFTs at once to the connected wallet
   *
   * @example
   * ```javascript*
   * // Custom metadata of the NFTs you want to mint.
   * const metadatas = [{
   *   name: "Cool NFT #1",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * }, {
   *   name: "Cool NFT #2",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/other/image.png"),
   * }];
   *
   * const tx = await contract.mintBatch(metadatas);
   * const receipt = tx[0].receipt; // same transaction receipt for all minted NFTs
   * const firstTokenId = tx[0].id; // token id of the first minted NFT
   * const firstNFT = await tx[0].data(); // (optional) fetch details of the first minted NFT
   * ```
   */
  public async mintBatch(
    metadata: NFTMetadataOrUri[],
  ): Promise<TransactionResultWithId<NFTMetadataOwner>[]> {
    return this.erc721.mintBatch(metadata);
  }

  /**
   * Mint Many unique NFTs
   *
   * @remarks Mint many unique NFTs at once to a specified wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet you want to mint the NFT to
   * const walletAddress = "{{wallet_address}}";
   *
   * // Custom metadata of the NFTs you want to mint.
   * const metadatas = [{
   *   name: "Cool NFT #1",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * }, {
   *   name: "Cool NFT #2",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/other/image.png"),
   * }];
   *
   * const tx = await contract.mintBatchTo(walletAddress, metadatas);
   * const receipt = tx[0].receipt; // same transaction receipt for all minted NFTs
   * const firstTokenId = tx[0].id; // token id of the first minted NFT
   * const firstNFT = await tx[0].data(); // (optional) fetch details of the first minted NFT
   * ```
   */
  public async mintBatchTo(
    walletAddress: string,
    metadata: NFTMetadataOrUri[],
  ): Promise<TransactionResultWithId<NFTMetadataOwner>[]> {
    return this.erc721.mintBatchTo(walletAddress, metadata);
  }

  /**
   * Burn a single NFT
   * @param tokenId - the token Id to burn
   *
   * @example
   * ```javascript
   * const result = await contract.burnToken(tokenId);
   * ```
   */
  public async burn(tokenId: BigNumberish): Promise<TransactionResult> {
    return this.erc721.burn(tokenId);
  }
}
