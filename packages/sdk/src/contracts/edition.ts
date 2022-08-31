import { getRoleHash } from "../common";
import { ContractEncoder } from "../core/classes/contract-encoder";
import { ContractEvents } from "../core/classes/contract-events";
import { ContractInterceptor } from "../core/classes/contract-interceptor";
import { ContractMetadata } from "../core/classes/contract-metadata";
import { ContractPlatformFee } from "../core/classes/contract-platform-fee";
import { ContractRoles } from "../core/classes/contract-roles";
import { ContractRoyalty } from "../core/classes/contract-royalty";
import { ContractPrimarySale } from "../core/classes/contract-sales";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import { Erc1155 } from "../core/classes/erc-1155";
import { Erc1155BatchMintable } from "../core/classes/erc-1155-batch-mintable";
import { Erc1155Burnable } from "../core/classes/erc-1155-burnable";
import { Erc1155Enumerable } from "../core/classes/erc-1155-enumerable";
import { Erc1155Mintable } from "../core/classes/erc-1155-mintable";
import { Erc1155SignatureMintable } from "../core/classes/erc-1155-signature-mintable";
import { GasCostEstimator } from "../core/classes/gas-cost-estimator";
import {
  NetworkOrSignerOrProvider,
  TransactionResult,
  TransactionResultWithId,
} from "../core/types";
import { TokenErc1155ContractSchema } from "../schema/contracts/token-erc1155";
import { SDKOptions } from "../schema/sdk-options";
import {
  EditionMetadata,
  EditionMetadataOrUri,
  EditionMetadataOwner,
} from "../schema/tokens/edition";
import { QueryAllParams } from "../types";
import { TokenERC1155 } from "@thirdweb-dev/contracts-js";
import ABI from "@thirdweb-dev/contracts-js/abis/TokenERC1155.json";
import { IStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, constants } from "ethers";

/**
 * Create a collection of NFTs that lets you mint multiple copies of each NFT.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = sdk.getEdition("{{contract_address}}");
 * ```
 *
 * @public
 */
export class Edition extends Erc1155<TokenERC1155> {
  static contractType = "edition" as const;
  static contractRoles = ["admin", "minter", "transfer"] as const;
  static contractAbi = ABI as any;
  /**
   * @internal
   */
  static schema = TokenErc1155ContractSchema;
  public metadata: ContractMetadata<TokenERC1155, typeof Edition.schema>;
  public roles: ContractRoles<
    TokenERC1155,
    typeof Edition.contractRoles[number]
  >;
  public sales: ContractPrimarySale<TokenERC1155>;
  public platformFees: ContractPlatformFee<TokenERC1155>;
  public encoder: ContractEncoder<TokenERC1155>;
  public estimator: GasCostEstimator<TokenERC1155>;
  public events: ContractEvents<TokenERC1155>;
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
  public royalties: ContractRoyalty<TokenERC1155, typeof Edition.schema>;
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
  override signature = super.signature as Erc1155SignatureMintable;
  /**
   * @internal
   */
  public interceptor: ContractInterceptor<TokenERC1155>;
  private _query = this.query as Erc1155Enumerable;
  private _mint = this.mint as Erc1155Mintable;
  private _burn = this.burn as Erc1155Burnable;
  private _batchMint = this._mint.batch as Erc1155BatchMintable;

  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    storage: IStorage,
    options: SDKOptions = {},
    contractWrapper = new ContractWrapper<TokenERC1155>(
      network,
      address,
      Edition.contractAbi,
      options,
    ),
  ) {
    super(contractWrapper, storage, options);
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      Edition.schema,
      this.storage,
    );
    this.roles = new ContractRoles(this.contractWrapper, Edition.contractRoles);
    this.royalties = new ContractRoyalty(this.contractWrapper, this.metadata);
    this.sales = new ContractPrimarySale(this.contractWrapper);
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.events = new ContractEvents(this.contractWrapper);
    this.platformFees = new ContractPlatformFee(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
    this.signature = new Erc1155SignatureMintable(
      this.contractWrapper,
      this.storage,
      this.roles,
    );
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
   * ```
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The NFT metadata for all NFTs queried.
   */
  public async getAll(
    queryParams?: QueryAllParams,
  ): Promise<EditionMetadata[]> {
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
   * ```
   *
   * @returns The NFT metadata for all NFTs in the contract.
   */
  public async getOwned(
    walletAddress?: string,
  ): Promise<EditionMetadataOwner[]> {
    return this._query.owned(walletAddress);
  }

  /**
   * Get the number of NFTs minted
   * @returns the total number of NFTs minted in this contract
   * @public
   */
  public async getTotalCount(): Promise<BigNumber> {
    return this._query.totalCount();
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
   * Mint NFT for the connected wallet
   *
   * @remarks See {@link Edition.mintTo}
   */
  public async mintToSelf(
    metadataWithSupply: EditionMetadataOrUri,
  ): Promise<TransactionResultWithId<EditionMetadata>> {
    return this._mint.to(
      await this.contractWrapper.getSignerAddress(),
      metadataWithSupply,
    );
  }

  /**
   * Mint an NFT with a limited supply
   *
   * @remarks Mint an NFT with a limited supply to a specified wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet you want to mint the NFT to
   * const toAddress = "{{wallet_address}}"
   *
   * // Custom metadata of the NFT, note that you can fully customize this metadata with other properties.
   * const metadata = {
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * }
   *
   * const metadataWithSupply = {
   *   metadata,
   *   supply: 1000, // The number of this NFT you want to mint
   * }
   *
   * const tx = await contract.mintTo(toAddress, metadataWithSupply);
   * const receipt = tx.receipt; // the transaction receipt
   * const tokenId = tx.id; // the id of the NFT minted
   * const nft = await tx.data(); // (optional) fetch details of minted NFT
   * ```
   */
  public async mintTo(
    to: string,
    metadataWithSupply: EditionMetadataOrUri,
  ): Promise<TransactionResultWithId<EditionMetadata>> {
    return this._mint.to(to, metadataWithSupply);
  }

  /**
   * Increase the supply of an existing NFT and mint it to the connected wallet
   *
   * @param tokenId - the token id of the NFT to increase supply of
   * @param additionalSupply - the additional amount to mint
   */
  public async mintAdditionalSupply(
    tokenId: BigNumberish,
    additionalSupply: BigNumberish,
  ): Promise<TransactionResultWithId<EditionMetadata>> {
    return this._mint.additionalSupplyTo(
      await this.contractWrapper.getSignerAddress(),
      tokenId,
      additionalSupply,
    );
  }

  /**
   * Increase the supply of an existing NFT and mint it to a given wallet address
   *
   * @param to - the address to mint to
   * @param tokenId - the token id of the NFT to increase supply of
   * @param additionalSupply - the additional amount to mint
   */
  public async mintAdditionalSupplyTo(
    to: string,
    tokenId: BigNumberish,
    additionalSupply: BigNumberish,
  ): Promise<TransactionResultWithId<EditionMetadata>> {
    return this._mint.additionalSupplyTo(to, tokenId, additionalSupply);
  }

  /**
   * Mint Many NFTs for the connected wallet
   *
   * @remarks See {@link Edition.mintBatchTo}
   */
  public async mintBatch(
    metadatas: EditionMetadataOrUri[],
  ): Promise<TransactionResultWithId<EditionMetadata>[]> {
    return this._batchMint.to(
      await this.contractWrapper.getSignerAddress(),
      metadatas,
    );
  }

  /**
   * Mint Many NFTs with limited supplies
   *
   * @remarks Mint many different NFTs with limited supplies to a specified wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet you want to mint the NFT to
   * const toAddress = "{{wallet_address}}"
   *
   * // Custom metadata and supplies of your NFTs
   * const metadataWithSupply = [{
   *   supply: 50, // The number of this NFT you want to mint
   *   metadata: {
   *     name: "Cool NFT #1",
   *     description: "This is a cool NFT",
   *     image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   *   },
   * }, {
   *   supply: 100,
   *   metadata: {
   *     name: "Cool NFT #2",
   *     description: "This is a cool NFT",
   *     image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   *   },
   * }];
   *
   * const tx = await contract.mintBatchTo(toAddress, metadataWithSupply);
   * const receipt = tx[0].receipt; // same transaction receipt for all minted NFTs
   * const firstTokenId = tx[0].id; // token id of the first minted NFT
   * const firstNFT = await tx[0].data(); // (optional) fetch details of the first minted NFT
   * ```
   */
  public async mintBatchTo(
    to: string,
    metadataWithSupply: EditionMetadataOrUri[],
  ): Promise<TransactionResultWithId<EditionMetadata>[]> {
    return this._batchMint.to(to, metadataWithSupply);
  }

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
  public async burnTokens(
    tokenId: BigNumberish,
    amount: BigNumberish,
  ): Promise<TransactionResult> {
    return this._burn.tokens(tokenId, amount);
  }
}
