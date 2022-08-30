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
import { Erc1155SignatureMintable } from "../core/classes/erc-1155-signature-mintable";
import { GasCostEstimator } from "../core/classes/gas-cost-estimator";
import { UpdateableNetwork } from "../core/interfaces/contract";
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
import { AirdropInput, QueryAllParams } from "../types";
import { TokenERC1155 } from "@thirdweb-dev/contracts-js";
import { IStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, BytesLike, constants } from "ethers";

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
export class Edition implements UpdateableNetwork {
  static contractType = "edition" as const;
  static contractRoles = ["admin", "minter", "transfer"] as const;
  static contractAbi = require("@thirdweb-dev/contracts-js/abis/TokenERC1155.json");

  private contractWrapper: ContractWrapper<TokenERC1155>;
  private storage: IStorage;

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
  public signature: Erc1155SignatureMintable;
  public interceptor: ContractInterceptor<TokenERC1155>;
  public erc1155: Erc1155<TokenERC1155>;

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
    this.contractWrapper = contractWrapper;
    this.storage = storage;
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
    this.erc1155 = new Erc1155(this.contractWrapper, this.storage);
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
    return this.erc1155.getAll(queryParams);
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
    return this.erc1155.getOwned(walletAddress);
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
  public async mint(
    metadataWithSupply: EditionMetadataOrUri,
  ): Promise<TransactionResultWithId<EditionMetadata>> {
    return this.erc1155.mint(metadataWithSupply);
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
    return this.erc1155.mintTo(to, metadataWithSupply);
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
    return this.erc1155.mintAdditionalSupply(tokenId, additionalSupply);
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
    return this.erc1155.mintAdditionalSupplyTo(to, tokenId, additionalSupply);
  }

  /**
   * Mint Many NFTs for the connected wallet
   *
   * @remarks See {@link Edition.mintBatchTo}
   */
  public async mintBatch(
    metadatas: EditionMetadataOrUri[],
  ): Promise<TransactionResultWithId<EditionMetadata>[]> {
    return this.erc1155.mintBatch(metadatas);
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
    return this.erc1155.mintBatchTo(to, metadataWithSupply);
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
  public async burn(
    tokenId: BigNumberish,
    amount: BigNumberish,
  ): Promise<TransactionResult> {
    return this.erc1155.burn(tokenId, amount);
  }

  ////// Standard ERC1155 functions //////

  /**
   * Get a single NFT Metadata
   *
   * @example
   * ```javascript
   * const nft = await contract.get("0");
   * ```
   * @param tokenId - the tokenId of the NFT to retrieve
   * @returns The NFT metadata
   */
  public async get(tokenId: BigNumberish): Promise<EditionMetadata> {
    return this.erc1155.get(tokenId);
  }

  /**
   * Returns the total supply of a specific token
   * @param tokenId - The token ID to get the total supply of
   * @returns the total supply
   */
  public async totalSupply(tokenId: BigNumberish): Promise<BigNumber> {
    return this.erc1155.totalSupply(tokenId);
  }

  /**
   * Get NFT Balance
   *
   * @remarks Get a wallets NFT balance (number of NFTs in this contract owned by the wallet).
   *
   * @example
   * ```javascript
   * // Address of the wallet to check NFT balance
   * const walletAddress = "{{wallet_address}}";
   * const tokenId = 0; // Id of the NFT to check
   * const balance = await contract.balanceOf(walletAddress, tokenId);
   * ```
   */
  public async balanceOf(
    address: string,
    tokenId: BigNumberish,
  ): Promise<BigNumber> {
    return this.erc1155.balanceOf(address, tokenId);
  }

  /**
   * Get NFT Balance for the currently connected wallet
   */
  public async balance(tokenId: BigNumberish): Promise<BigNumber> {
    return this.erc1155.balance(tokenId);
  }

  /**
   * Get whether this wallet has approved transfers from the given operator
   * @param address - the wallet address
   * @param operator - the operator address
   */
  public async isApproved(address: string, operator: string): Promise<boolean> {
    return this.erc1155.isApproved(address, operator);
  }

  /**
   * Transfer a single NFT
   *
   * @remarks Transfer an NFT from the connected wallet to another wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet you want to send the NFT to
   * const toAddress = "{{wallet_address}}";
   * const tokenId = "0"; // The token ID of the NFT you want to send
   * const amount = 3; // How many copies of the NFTs to transfer
   * await contract.transfer(toAddress, tokenId, amount);
   * ```
   */
  public async transfer(
    to: string,
    tokenId: BigNumberish,
    amount: BigNumberish,
    data: BytesLike = [0],
  ): Promise<TransactionResult> {
    return this.erc1155.transfer(to, tokenId, amount, data);
  }

  /**
   * Approve or remove operator as an operator for the caller. Operators can call transferFrom or safeTransferFrom for any token owned by the caller.
   * @param operator - the operator's address
   * @param approved - whether to approve or remove
   *
   * @internal
   */
  public async setApprovalForAll(
    operator: string,
    approved: boolean,
  ): Promise<TransactionResult> {
    return this.erc1155.setApprovalForAll(operator, approved);
  }

  /**
   * Airdrop multiple NFTs
   *
   * @remarks Airdrop one or multiple NFTs to the provided wallet addresses.
   *
   * @example
   * ```javascript
   * // The token ID of the NFT you want to airdrop
   * const tokenId = "0";
   * // Array of objects of addresses and quantities to airdrop NFTs to
   * const addresses = [
   *  {
   *    address: "0x...",
   *    quantity: 2,
   *  },
   *  {
   *   address: "0x...",
   *    quantity: 3,
   *  },
   * ];
   * await contract.airdrop(tokenId, addresses);
   *
   * // You can also pass an array of addresses, it will airdrop 1 NFT per address
   * const tokenId = "0";
   * const addresses = [
   *  "0x...", "0x...", "0x...",
   * ]
   * await contract.airdrop(tokenId, addresses);
   * ```
   */
  public async airdrop(
    tokenId: BigNumberish,
    addresses: AirdropInput,
    data: BytesLike = [0],
  ): Promise<TransactionResult> {
    return this.erc1155.airdrop(tokenId, addresses, data);
  }
}
