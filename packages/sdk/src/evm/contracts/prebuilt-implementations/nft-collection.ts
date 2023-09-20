import type { TokenERC721 } from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumberish, CallOverrides, constants } from "ethers";
import { NFT, NFTMetadataOrUri } from "../../../core/schema/nft";
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
import { StandardErc721 } from "../../core/classes/erc-721-standard";
import { Erc721WithQuantitySignatureMintable } from "../../core/classes/erc-721-with-quantity-signature-mintable";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
import { Transaction } from "../../core/classes/transactions";
import type { NetworkInput, TransactionResultWithId } from "../../core/types";
import { Abi, AbiInput, AbiSchema } from "../../schema/contracts/custom";
import { TokenErc721ContractSchema } from "../../schema/contracts/token-erc721";
import { SDKOptions } from "../../schema/sdk-options";
import { Address } from "../../schema/shared/Address";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { NFT_BASE_CONTRACT_ROLES } from "../contractRoles";

/**
 * Create a collection of one-of-one NFTs.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = await sdk.getContract("{{contract_address}}", "nft-collection");
 * ```
 *
 * @public
 */
export class NFTCollection extends StandardErc721<TokenERC721> {
  static contractRoles = NFT_BASE_CONTRACT_ROLES;

  public abi: Abi;
  public metadata: ContractMetadata<
    TokenERC721,
    typeof TokenErc721ContractSchema
  >;

  public app: ContractAppURI<TokenERC721>;
  public roles: ContractRoles<
    TokenERC721,
    (typeof NFTCollection.contractRoles)[number]
  >;
  public encoder: ContractEncoder<TokenERC721>;
  public estimator: GasCostEstimator<TokenERC721>;
  public events: ContractEvents<TokenERC721>;
  public sales: ContractPrimarySale;
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
  public owner: ContractOwner<TokenERC721>;

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

  constructor(
    network: NetworkInput,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
    abi: AbiInput,
    chainId: number,
    contractWrapper = new ContractWrapper<TokenERC721>(
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
      TokenErc721ContractSchema,
      this.storage,
    );

    this.app = new ContractAppURI(
      this.contractWrapper,
      this.metadata,
      this.storage,
    );
    this.roles = new ContractRoles(
      this.contractWrapper,
      NFTCollection.contractRoles,
    );
    this.royalties = new ContractRoyalty(this.contractWrapper, this.metadata);
    this.sales = new ContractPrimarySale(this.contractWrapper);
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.events = new ContractEvents(this.contractWrapper);
    this.platformFees = new ContractPlatformFee(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
    this.signature = new Erc721WithQuantitySignatureMintable(
      this.contractWrapper,
      this.storage,
    );
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
  mint = /* @__PURE__ */ buildTransactionFunction(
    async (
      metadata: NFTMetadataOrUri,
    ): Promise<Transaction<TransactionResultWithId<NFT>>> => {
      return this.erc721.mint.prepare(metadata);
    },
  );

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
  mintTo = /* @__PURE__ */ buildTransactionFunction(
    async (
      walletAddress: AddressOrEns,
      metadata: NFTMetadataOrUri,
    ): Promise<Transaction<TransactionResultWithId<NFT>>> => {
      return this.erc721.mintTo.prepare(walletAddress, metadata);
    },
  );

  /**
   * Construct a mint transaction without executing it.
   * This is useful for estimating the gas cost of a mint transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param receiver - Address you want to send the token to
   * @param metadata - The metadata of the NFT you want to mint
   *
   * @deprecated Use `contract.mint.prepare(...args)` instead
   */
  public async getMintTransaction(
    receiver: AddressOrEns,
    metadata: NFTMetadataOrUri,
  ): Promise<Transaction> {
    return this.erc721.getMintTransaction(receiver, metadata);
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
  mintBatch = /* @__PURE__ */ buildTransactionFunction(
    async (
      metadata: NFTMetadataOrUri[],
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      return this.erc721.mintBatch.prepare(metadata);
    },
  );

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
  mintBatchTo = /* @__PURE__ */ buildTransactionFunction(
    async (
      walletAddress: AddressOrEns,
      metadata: NFTMetadataOrUri[],
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      return this.erc721.mintBatchTo.prepare(walletAddress, metadata);
    },
  );

  /**
   * Burn a single NFT
   * @param tokenId - the token Id to burn
   *
   * @example
   * ```javascript
   * const result = await contract.burnToken(tokenId);
   * ```
   */
  burn = /* @__PURE__ */ buildTransactionFunction((tokenId: BigNumberish) => {
    return this.erc721.burn.prepare(tokenId);
  });

  /**
   * @internal
   */
  public async prepare<
    TMethod extends
      keyof TokenERC721["functions"] = keyof TokenERC721["functions"],
  >(
    method: string & TMethod,
    args: any[] & Parameters<TokenERC721["functions"][TMethod]>,
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
      keyof TokenERC721["functions"] = keyof TokenERC721["functions"],
  >(
    functionName: string & TMethod,
    args?: Parameters<TokenERC721["functions"][TMethod]>,
    overrides?: CallOverrides,
  ): Promise<ReturnType<TokenERC721["functions"][TMethod]>> {
    return this.contractWrapper.call(functionName, args, overrides);
  }
}
