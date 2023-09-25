import type { TokenERC1155 } from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, CallOverrides, constants } from "ethers";
import { QueryAllParams, QueryOwnedParams } from "../../../core/schema/QueryParams";
import { NFT } from "../../../core/schema/nft";
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
import { Erc1155SignatureMintable } from "../../core/classes/erc-1155-signature-mintable";
import { StandardErc1155 } from "../../core/classes/erc-1155-standard";
import { GasCostEstimator } from "../../core/classes/gas-cost-estimator";
import { Transaction } from "../../core/classes/transactions";
import { NetworkInput, TransactionResultWithId } from "../../core/types";
import { Abi, AbiInput, AbiSchema } from "../../schema/contracts/custom";
import { TokenErc1155ContractSchema } from "../../schema/contracts/token-erc1155";
import { SDKOptions } from "../../schema/sdk-options";
import { Address } from "../../schema/shared/Address";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { EditionMetadataOrUri } from "../../schema/tokens/edition";
import { NFT_BASE_CONTRACT_ROLES } from "../contractRoles";

/**
 * Create a collection of NFTs that lets you mint multiple copies of each NFT.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("{{chainName}}");
 * const contract = await sdk.getContract("{{contract_address}}", "edition");
 * ```
 *
 * @public
 */
export class Edition extends StandardErc1155<TokenERC1155> {
  static contractRoles = NFT_BASE_CONTRACT_ROLES;

  public abi: Abi;
  public metadata: ContractMetadata<
    TokenERC1155,
    typeof TokenErc1155ContractSchema
  >;
  public app: ContractAppURI<TokenERC1155>;
  public roles: ContractRoles<
    TokenERC1155,
    (typeof Edition.contractRoles)[number]
  >;
  public sales: ContractPrimarySale;
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
  public royalties: ContractRoyalty<
    TokenERC1155,
    typeof TokenErc1155ContractSchema
  >;
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
  public owner: ContractOwner<TokenERC1155>;

  constructor(
    network: NetworkInput,
    address: string,
    storage: ThirdwebStorage,
    options: SDKOptions = {},
    abi: AbiInput,
    chainId: number,
    contractWrapper = new ContractWrapper<TokenERC1155>(
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
      TokenErc1155ContractSchema,
      this.storage,
    );
    this.app = new ContractAppURI(
      this.contractWrapper,
      this.metadata,
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
    queryParams?: QueryOwnedParams,
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
   * Mint NFT for the connected wallet
   *
   * @remarks See {@link Edition.mintTo}
   */
  mint = /* @__PURE__ */ buildTransactionFunction(
    async (
      metadataWithSupply: EditionMetadataOrUri,
    ): Promise<Transaction<TransactionResultWithId<NFT>>> => {
      return this.erc1155.mint.prepare(metadataWithSupply);
    },
  );

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
  mintTo = /* @__PURE__ */ buildTransactionFunction(
    async (
      to: AddressOrEns,
      metadataWithSupply: EditionMetadataOrUri,
    ): Promise<Transaction<TransactionResultWithId<NFT>>> => {
      return this.erc1155.mintTo.prepare(to, metadataWithSupply);
    },
  );

  /**
   * Construct a mint transaction without executing it.
   * This is useful for estimating the gas cost of a mint transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param receiver - Address you want to send the token to
   * @param metadataWithSupply - The metadata of the NFT you want to mint
   *
   * @deprecated `contract.mint.prepare(...args)`
   */
  public async getMintTransaction(
    receiver: AddressOrEns,
    metadataWithSupply: EditionMetadataOrUri,
  ): Promise<Transaction> {
    return this.erc1155.getMintTransaction(receiver, metadataWithSupply);
  }

  /**
   * Increase the supply of an existing NFT and mint it to the connected wallet
   *
   * @param tokenId - the token id of the NFT to increase supply of
   * @param additionalSupply - the additional amount to mint
   */
  mintAdditionalSupply = /* @__PURE__ */ buildTransactionFunction(
    async (
      tokenId: BigNumberish,
      additionalSupply: BigNumberish,
    ): Promise<Transaction<TransactionResultWithId<NFT>>> => {
      return this.erc1155.mintAdditionalSupply.prepare(
        tokenId,
        additionalSupply,
      );
    },
  );

  /**
   * Increase the supply of an existing NFT and mint it to a given wallet address
   *
   * @param to - the address to mint to
   * @param tokenId - the token id of the NFT to increase supply of
   * @param additionalSupply - the additional amount to mint
   */
  mintAdditionalSupplyTo = /* @__PURE__ */ buildTransactionFunction(
    async (
      to: AddressOrEns,
      tokenId: BigNumberish,
      additionalSupply: BigNumberish,
    ): Promise<Transaction<TransactionResultWithId<NFT>>> => {
      return this.erc1155.mintAdditionalSupplyTo.prepare(
        to,
        tokenId,
        additionalSupply,
      );
    },
  );

  /**
   * Mint Many NFTs for the connected wallet
   *
   * @remarks See {@link Edition.mintBatchTo}
   */
  mintBatch = /* @__PURE__ */ buildTransactionFunction(
    async (
      metadatas: EditionMetadataOrUri[],
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      return this.erc1155.mintBatch.prepare(metadatas);
    },
  );

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
  mintBatchTo = /* @__PURE__ */ buildTransactionFunction(
    async (
      to: AddressOrEns,
      metadataWithSupply: EditionMetadataOrUri[],
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      return this.erc1155.mintBatchTo.prepare(to, metadataWithSupply);
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
  burn = /* @__PURE__ */ buildTransactionFunction(
    async (tokenId: BigNumberish, amount: BigNumberish) => {
      return this.erc1155.burn.prepare(tokenId, amount);
    },
  );

  /**
   * @internal
   */
  public async prepare<
    TMethod extends
      keyof TokenERC1155["functions"] = keyof TokenERC1155["functions"],
  >(
    method: string & TMethod,
    args: any[] & Parameters<TokenERC1155["functions"][TMethod]>,
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
      keyof TokenERC1155["functions"] = keyof TokenERC1155["functions"],
  >(
    functionName: string & TMethod,
    args?: Parameters<TokenERC1155["functions"][TMethod]>,
    overrides?: CallOverrides,
  ): Promise<ReturnType<TokenERC1155["functions"][TMethod]>> {
    return this.contractWrapper.call(functionName, args, overrides);
  }
}
