import { QueryAllParams } from "../../../core/schema/QueryParams";
import { NFT, NFTMetadata, NFTMetadataOrUri } from "../../../core/schema/nft";
import {
  assertEnabled,
  detectContractFeature,
  ExtensionNotImplementedError,
  hasFunction,
  NotFoundError,
} from "../../common";
import { resolveAddress } from "../../common/ens";
import { FALLBACK_METADATA, fetchTokenMetadata } from "../../common/nft";
import { buildTransactionFunction } from "../../common/transactions";
import {
  FEATURE_NFT,
  FEATURE_NFT_BATCH_MINTABLE,
  FEATURE_NFT_BURNABLE,
  FEATURE_NFT_CLAIM_CUSTOM,
  FEATURE_NFT_CLAIM_CONDITIONS_V2,
  FEATURE_NFT_LAZY_MINTABLE,
  FEATURE_NFT_MINTABLE,
  FEATURE_NFT_REVEALABLE,
  FEATURE_NFT_SUPPLY,
  FEATURE_NFT_TIERED_DROP,
  FEATURE_NFT_SIGNATURE_MINTABLE_V2,
} from "../../constants/erc721-features";
import { Address, AddressOrEns } from "../../schema";
import { ClaimOptions, UploadProgressEvent } from "../../types";
import { BaseDropERC721, BaseERC721 } from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { UpdateableNetwork } from "../interfaces/contract";
import { NetworkInput, TransactionResultWithId } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { Erc721Burnable } from "./erc-721-burnable";
import { Erc721LazyMintable } from "./erc-721-lazymintable";
import { Erc721Mintable } from "./erc-721-mintable";
import { Erc721Supply } from "./erc-721-supply";
import { Erc721TieredDrop } from "./erc-721-tiered-drop";
import { Erc721WithQuantitySignatureMintable } from "./erc-721-with-quantity-signature-mintable";
import { Transaction } from "./transactions";
import type {
  DropERC721,
  IBurnableERC721,
  IERC721Supply,
  IMintableERC721,
  ISignatureMintERC721,
  Multiwrap,
  SignatureDrop,
  TieredDrop,
  TokenERC721,
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, constants } from "ethers";

/**
 * Standard ERC721 NFT functions
 * @remarks Basic functionality for a ERC721 contract that handles IPFS storage for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.erc721.transfer(walletAddress, tokenId);
 * ```
 * @public
 */
export class Erc721<
  T extends
    | Multiwrap
    | SignatureDrop
    | DropERC721
    | TokenERC721
    | BaseERC721 = BaseERC721,
> implements UpdateableNetwork, DetectableFeature
{
  featureName = FEATURE_NFT.name;
  private query: Erc721Supply | undefined;
  private mintable: Erc721Mintable | undefined;
  private burnable: Erc721Burnable | undefined;
  private lazyMintable: Erc721LazyMintable | undefined;
  private tieredDropable: Erc721TieredDrop | undefined;
  private signatureMintable: Erc721WithQuantitySignatureMintable | undefined;
  protected contractWrapper: ContractWrapper<T>;
  protected storage: ThirdwebStorage;

  private _chainId: number;
  get chainId() {
    return this._chainId;
  }

  constructor(
    contractWrapper: ContractWrapper<T>,
    storage: ThirdwebStorage,
    chainId: number,
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.query = this.detectErc721Enumerable();
    this.mintable = this.detectErc721Mintable();
    this.burnable = this.detectErc721Burnable();
    this.lazyMintable = this.detectErc721LazyMintable();
    this.tieredDropable = this.detectErc721TieredDrop();
    this.signatureMintable = this.detectErc721SignatureMintable();
    this._chainId = chainId;
  }

  /**
   * @internal
   */
  onNetworkUpdated(network: NetworkInput): void {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  getAddress(): Address {
    return this.contractWrapper.readContract.address;
  }

  ////// Standard ERC721 Extension //////

  /**
   * Get a single NFT
   *
   * @example
   * ```javascript
   * const tokenId = 0;
   * const nft = await contract.erc721.get(tokenId);
   * ```
   * @param tokenId - the tokenId of the NFT to retrieve
   * @returns The NFT metadata
   * @twfeature ERC721
   */
  public async get(tokenId: BigNumberish): Promise<NFT> {
    const [owner, metadata] = await Promise.all([
      this.ownerOf(tokenId).catch(() => constants.AddressZero),
      this.getTokenMetadata(tokenId).catch(() => ({
        id: tokenId.toString(),
        uri: "",
        ...FALLBACK_METADATA,
      })),
    ]);
    return { owner, metadata, type: "ERC721", supply: "1" };
  }

  /**
   * Get the current owner of an NFT
   *
   * @param tokenId - the tokenId of the NFT
   * @returns the address of the owner
   * @twfeature ERC721
   */
  public async ownerOf(tokenId: BigNumberish): Promise<string> {
    return await this.contractWrapper.readContract.ownerOf(tokenId);
  }

  /**
   * Get NFT balance of a specific wallet
   *
   * @remarks Get a wallets NFT balance (number of NFTs in this contract owned by the wallet).
   *
   * @example
   * ```javascript
   * const walletAddress = "{{wallet_address}}";
   * const balance = await contract.erc721.balanceOf(walletAddress);
   * console.log(balance);
   * ```
   * @twfeature ERC721
   */
  public async balanceOf(address: AddressOrEns): Promise<BigNumber> {
    return await this.contractWrapper.readContract.balanceOf(
      await resolveAddress(address),
    );
  }

  /**
   * Get NFT balance for the currently connected wallet
   */
  public async balance(): Promise<BigNumber> {
    return await this.balanceOf(await this.contractWrapper.getSignerAddress());
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
    return await this.contractWrapper.readContract.isApprovedForAll(
      await resolveAddress(address),
      await resolveAddress(operator),
    );
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
   * await contract.erc721.transfer(walletAddress, tokenId);
   * ```
   * @twfeature ERC721
   */
  transfer = buildTransactionFunction(
    async (to: AddressOrEns, tokenId: BigNumberish) => {
      const from = await this.contractWrapper.getSignerAddress();
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "transferFrom(address,address,uint256)",
        args: [from, await resolveAddress(to), tokenId],
      });
    },
  );

  /**
   * Set approval for all NFTs
   * @remarks Approve or remove operator as an operator for the caller. Operators can call transferFrom or safeTransferFrom for any token owned by the caller.
   * @example
   * ```javascript
   * const operator = "{{wallet_address}}";
   * await contract.erc721.setApprovalForAll(operator, true);
   * ```
   * @param operator - the operator's address
   * @param approved - whether to approve or remove
   * @twfeature ERC721
   */
  setApprovalForAll = buildTransactionFunction(
    async (operator: AddressOrEns, approved: boolean) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "setApprovalForAll",
        args: [await resolveAddress(operator), approved],
      });
    },
  );

  /**
   * Set approval for a single NFT
   * @remarks Approve an operator for the NFT owner. Operators can call transferFrom or safeTransferFrom for the specified token.
   * @example
   * ```javascript
   * const operator = "{{wallet_address}}";
   * const tokenId = 0;
   * await contract.erc721.setApprovalForToken(operator, tokenId);
   * ```
   * @param operator - the operator's address
   * @param tokenId - the tokenId to give approval for
   *
   * @internal
   */
  setApprovalForToken = buildTransactionFunction(
    async (operator: AddressOrEns, tokenId: BigNumberish) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "approve",
        args: [await resolveAddress(operator), tokenId],
      });
    },
  );

  ////// ERC721 Supply Extension //////

  /**
   * Get all NFTs
   *
   * @remarks Get all the data associated with every NFT in this contract.
   *
   * By default, returns the first 100 NFTs, use queryParams to fetch more.
   *
   * @example
   * ```javascript
   * const nfts = await contract.erc721.getAll();
   * console.log(nfts);
   * ```
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The NFT metadata for all NFTs queried.
   * @twfeature ERC721Supply | ERC721Enumerable
   */
  public async getAll(queryParams?: QueryAllParams) {
    return assertEnabled(this.query, FEATURE_NFT_SUPPLY).all(queryParams);
  }

  /**
   * Get all NFT owners
   * @example
   * ```javascript
   * const owners = await contract.erc721.getAllOwners();
   * console.log(owners);
   * ```
   * @returns an array of token ids and owners
   * @twfeature ERC721Supply | ERC721Enumerable
   */
  public async getAllOwners() {
    return assertEnabled(this.query, FEATURE_NFT_SUPPLY).allOwners();
  }

  /**
   * Get the total number of NFTs minted
   * @remarks This returns the total number of NFTs minted in this contract, **not** the total supply of a given token.
   * @example
   * ```javascript
   * const count = await contract.erc721.totalCount();
   * console.log(count);
   * ```
   *
   * @returns the total number of NFTs minted in this contract
   * @public
   */
  public async totalCount() {
    return this.nextTokenIdToMint();
  }

  /**
   * Get the total count NFTs minted in this contract
   * @twfeature ERC721Supply | ERC721Enumerable
   */
  public async totalCirculatingSupply() {
    return assertEnabled(
      this.query,
      FEATURE_NFT_SUPPLY,
    ).totalCirculatingSupply();
  }

  ////// ERC721 Enumerable Extension //////

  /**
   * Get all NFTs owned by a specific wallet
   *
   * @remarks Get all the data associated with the NFTs owned by a specific wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet to get the NFTs of
   * const address = "{{wallet_address}}";
   * const nfts = await contract.erc721.getOwned(address);
   * console.log(nfts);
   * ```
   * @param walletAddress - the wallet address to query, defaults to the connected wallet
   * @returns The NFT metadata for all NFTs in the contract.
   * @twfeature ERC721Supply | ERC721Enumerable
   */
  public async getOwned(walletAddress?: AddressOrEns) {
    if (walletAddress) {
      walletAddress = await resolveAddress(walletAddress);
    }

    if (this.query?.owned) {
      return this.query.owned.all(walletAddress);
    } else {
      const address =
        walletAddress || (await this.contractWrapper.getSignerAddress());
      const allOwners = await this.getAllOwners();
      return Promise.all(
        (allOwners || [])
          .filter((i) => address?.toLowerCase() === i.owner?.toLowerCase())
          .map(async (i) => await this.get(i.tokenId)),
      );
    }
  }

  /**
   * Get all token ids of NFTs owned by a specific wallet.
   * @param walletAddress - the wallet address to query, defaults to the connected wallet
   */
  public async getOwnedTokenIds(walletAddress?: AddressOrEns) {
    if (walletAddress) {
      walletAddress = await resolveAddress(walletAddress);
    }

    if (this.query?.owned) {
      return this.query.owned.tokenIds(walletAddress);
    } else {
      const address =
        walletAddress || (await this.contractWrapper.getSignerAddress());
      const allOwners = await this.getAllOwners();
      return (allOwners || [])
        .filter((i) => address?.toLowerCase() === i.owner?.toLowerCase())
        .map((i) => BigNumber.from(i.tokenId));
    }
  }

  ////// ERC721 Mintable Extension //////

  /**
   * Mint an NFT
   *
   * @remarks Mint an NFT to the connected wallet.
   *
   * @example
   * ```javascript
   * // Custom metadata of the NFT, note that you can fully customize this metadata with other properties.
   * const metadata = {
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * };
   *
   * const tx = await contract.erc721.mint(metadata);
   * const receipt = tx.receipt; // the transaction receipt
   * const tokenId = tx.id; // the id of the NFT minted
   * const nft = await tx.data(); // (optional) fetch details of minted NFT
   * ```
   * @twfeature ERC721Mintable
   */
  mint = buildTransactionFunction(async (metadata: NFTMetadataOrUri) => {
    return this.mintTo.prepare(
      await this.contractWrapper.getSignerAddress(),
      metadata,
    );
  });

  /**
   * Mint an NFT to a specific wallet
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
   * const tx = await contract.erc721.mintTo(walletAddress, metadata);
   * const receipt = tx.receipt; // the transaction receipt
   * const tokenId = tx.id; // the id of the NFT minted
   * const nft = await tx.data(); // (optional) fetch details of minted NFT
   * ```
   * @twfeature ERC721Mintable
   */
  mintTo = buildTransactionFunction(
    async (receiver: AddressOrEns, metadata: NFTMetadataOrUri) => {
      return assertEnabled(this.mintable, FEATURE_NFT_MINTABLE).to.prepare(
        receiver,
        metadata,
      );
    },
  );

  /**
   * Construct a mint transaction without executing it.
   * This is useful for estimating the gas cost of a mint transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param receiver - Address you want to send the token to
   * @param metadata - The metadata of the NFT you want to mint
   *
   * @deprecated Use `contract.erc721.mint.prepare(...args)` instead
   * @twfeature ERC721Mintable
   */
  public async getMintTransaction(
    receiver: AddressOrEns,
    metadata: NFTMetadataOrUri,
  ) {
    return this.mintTo.prepare(receiver, metadata);
  }

  ////// ERC721 Batch Mintable Extension //////

  /**
   * Mint many NFTs
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
   * const tx = await contract.erc721.mintBatch(metadatas);
   * const receipt = tx[0].receipt; // same transaction receipt for all minted NFTs
   * const firstTokenId = tx[0].id; // token id of the first minted NFT
   * const firstNFT = await tx[0].data(); // (optional) fetch details of the first minted NFT
   * ```
   * @twfeature ERC721BatchMintable
   */
  mintBatch = buildTransactionFunction(
    async (metadatas: NFTMetadataOrUri[]) => {
      return this.mintBatchTo.prepare(
        await this.contractWrapper.getSignerAddress(),
        metadatas,
      );
    },
  );

  /**
   * Mint many NFTs to a specific wallet
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
   * const tx = await contract.erc721.mintBatchTo(walletAddress, metadatas);
   * const receipt = tx[0].receipt; // same transaction receipt for all minted NFTs
   * const firstTokenId = tx[0].id; // token id of the first minted NFT
   * const firstNFT = await tx[0].data(); // (optional) fetch details of the first minted NFT
   * ```
   * @twfeature ERC721BatchMintable
   */
  mintBatchTo = buildTransactionFunction(
    async (receiver: AddressOrEns, metadatas: NFTMetadataOrUri[]) => {
      return assertEnabled(
        this.mintable?.batch,
        FEATURE_NFT_BATCH_MINTABLE,
      ).to.prepare(receiver, metadatas);
    },
  );

  ////// ERC721 Burnable Extension //////

  /**
   * Burn a single NFT
   * @param tokenId - the token Id to burn
   *
   * @example
   * ```javascript
   * const result = await contract.erc721.burn(tokenId);
   * ```
   * @twfeature ERC721Burnable
   */
  burn = buildTransactionFunction(async (tokenId: BigNumberish) => {
    return assertEnabled(this.burnable, FEATURE_NFT_BURNABLE).token.prepare(
      tokenId,
    );
  });

  ////// ERC721 LazyMint Extension //////

  /**
   * Lazy mint NFTs
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
   * const results = await contract.erc721.lazyMint(metadatas); // uploads and creates the NFTs on chain
   * const firstTokenId = results[0].id; // token id of the first created NFT
   * const firstNFT = await results[0].data(); // (optional) fetch details of the first created NFT
   * ```
   *
   * @param metadatas - The metadata to include in the batch.
   * @param options - optional upload progress callback
   * @twfeature ERC721LazyMintable
   */
  lazyMint = buildTransactionFunction(
    async (
      metadatas: NFTMetadataOrUri[],
      options?: {
        onProgress: (event: UploadProgressEvent) => void;
      },
    ) => {
      return assertEnabled(
        this.lazyMintable,
        FEATURE_NFT_LAZY_MINTABLE,
      ).lazyMint.prepare(metadatas, options);
    },
  );

  ////// ERC721 Claimable Extension //////

  /**
   * Claim NFTs
   *
   * @remarks Let the specified wallet claim NFTs.
   *
   * @example
   * ```javascript
   * const quantity = 1; // how many unique NFTs you want to claim
   *
   * const tx = await contract.erc721.claim(quantity);
   * const receipt = tx.receipt; // the transaction receipt
   * const claimedTokenId = tx.id; // the id of the NFT claimed
   * const claimedNFT = await tx.data(); // (optional) get the claimed NFT metadata
   * ```
   *
   * @param quantity - Quantity of the tokens you want to claim
   *
   * @returns - an array of results containing the id of the token claimed, the transaction receipt and a promise to optionally fetch the nft metadata
   * @twfeature ERC721ClaimCustom | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1
   */
  claim = buildTransactionFunction(
    async (quantity: BigNumberish, options?: ClaimOptions) => {
      return this.claimTo.prepare(
        await this.contractWrapper.getSignerAddress(),
        quantity,
        options,
      );
    },
  );

  /**
   * Claim NFTs to a specific wallet
   *
   * @remarks Let the specified wallet claim NFTs.
   *
   * @example
   * ```javascript
   * const address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs
   * const quantity = 1; // how many unique NFTs you want to claim
   *
   * const tx = await contract.erc721.claimTo(address, quantity);
   * const receipt = tx.receipt; // the transaction receipt
   * const claimedTokenId = tx.id; // the id of the NFT claimed
   * const claimedNFT = await tx.data(); // (optional) get the claimed NFT metadata
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param quantity - Quantity of the tokens you want to claim
   * @param options
   * @returns - an array of results containing the id of the token claimed, the transaction receipt and a promise to optionally fetch the nft metadata
   * @twfeature ERC721ClaimCustom | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1
   */
  claimTo = buildTransactionFunction(
    async (
      destinationAddress: AddressOrEns,
      quantity: BigNumberish,
      options?: ClaimOptions,
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      const claimWithConditions = this.lazyMintable?.claimWithConditions;
      const claim = this.lazyMintable?.claim;
      if (claimWithConditions) {
        return claimWithConditions.to.prepare(
          destinationAddress,
          quantity,
          options,
        );
      }
      if (claim) {
        return claim.to.prepare(destinationAddress, quantity, options);
      }
      throw new ExtensionNotImplementedError(FEATURE_NFT_CLAIM_CUSTOM);
    },
  );

  /**
   * Construct a claim transaction without executing it.
   * This is useful for estimating the gas cost of a claim transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param destinationAddress
   * @param quantity
   * @param options
   *
   * @deprecated Use `contract.erc721.claim.prepare(...args)` instead
   * @twfeature ERC721ClaimCustom | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1
   */
  public async getClaimTransaction(
    destinationAddress: AddressOrEns,
    quantity: BigNumberish,
    options?: ClaimOptions,
  ): Promise<Transaction> {
    const claimWithConditions = this.lazyMintable?.claimWithConditions;
    const claim = this.lazyMintable?.claim;
    if (claimWithConditions) {
      return claimWithConditions.conditions.getClaimTransaction(
        destinationAddress,
        quantity,
        options,
      );
    }
    if (claim) {
      return claim.getClaimTransaction(destinationAddress, quantity, options);
    }
    throw new ExtensionNotImplementedError(FEATURE_NFT_CLAIM_CUSTOM);
  }

  /**
   * Get the claimed supply
   *
   * @remarks Get the number of claimed NFTs in this Drop.
   *
   * * @example
   * ```javascript
   * const claimedNFTCount = await contract.totalClaimedSupply();
   * console.log(`NFTs claimed: ${claimedNFTCount}`);
   * ```
   * @returns the unclaimed supply
   * @twfeature ERC721ClaimCustom | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1
   */
  public async totalClaimedSupply(): Promise<BigNumber> {
    const contract = this.contractWrapper;
    if (hasFunction<DropERC721>("nextTokenIdToClaim", contract)) {
      return contract.readContract.nextTokenIdToClaim();
    }
    if (hasFunction<SignatureDrop>("totalMinted", contract)) {
      return contract.readContract.totalMinted();
    }
    throw new Error(
      "No function found on contract to get total claimed supply",
    );
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
   * @twfeature ERC721ClaimCustom | ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1
   */
  public async totalUnclaimedSupply(): Promise<BigNumber> {
    return (await this.nextTokenIdToMint()).sub(
      await this.totalClaimedSupply(),
    );
  }

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
   * await contract.erc721.claimConditions.set(claimConditions);
   * ```
   * @twfeature ERC721ClaimPhasesV2 | ERC721ClaimPhasesV1 | ERC721ClaimConditionsV2 | ERC721ClaimConditionsV1
   */
  get claimConditions() {
    return assertEnabled(
      this.lazyMintable?.claimWithConditions,
      FEATURE_NFT_CLAIM_CONDITIONS_V2,
    ).conditions;
  }

  ////// ERC721 Tiered Drop Extension //////

  /**
   * Tiered Drop
   * @remarks Drop lazy minted NFTs using a tiered drop mechanism.
   * @twfeature ERC721TieredDrop
   */
  get tieredDrop() {
    return assertEnabled(this.tieredDropable, FEATURE_NFT_TIERED_DROP);
  }

  ////// ERC721 SignatureMint Extension //////

  /**
   * Mint with signature
   * @remarks Generate dynamic NFTs with your own signature, and let others mint them using that signature.
   * @example
   * ```javascript
   * // see how to craft a payload to sign in the `contract.erc721.signature.generate()` documentation
   * const signedPayload = contract.erc721.signature().generate(payload);
   *
   * // now anyone can mint the NFT
   * const tx = contract.erc721.signature.mint(signedPayload);
   * const receipt = tx.receipt; // the mint transaction receipt
   * const mintedId = tx.id; // the id of the NFT minted
   * ```
   * @twfeature ERC721SignatureMintV1 | ERC721SignatureMintV2
   */
  get signature() {
    return assertEnabled(
      this.signatureMintable,
      FEATURE_NFT_SIGNATURE_MINTABLE_V2,
    );
  }

  ////// ERC721 DelayedReveal Extension //////

  /**
   * Mint delayed reveal NFTs
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
   * await contract.erc721.revealer.createDelayedRevealBatch(
   *   placeholderNFT,
   *   realNFTs,
   *   "my secret password",
   * );
   * // Whenever you're ready, reveal your NFTs at any time
   * const batchId = 0; // the batch to reveal
   * await contract.erc721.revealer.reveal(batchId, "my secret password");
   * ```
   * @twfeature ERC721Revealable
   */
  get revealer() {
    return assertEnabled(this.lazyMintable?.revealer, FEATURE_NFT_REVEALABLE);
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  /**
   * @internal
   */
  async getTokenMetadata(tokenId: BigNumberish): Promise<NFTMetadata> {
    const tokenUri = await this.contractWrapper.readContract.tokenURI(tokenId);
    if (!tokenUri) {
      throw new NotFoundError();
    }
    return fetchTokenMetadata(tokenId, tokenUri, this.storage);
  }

  /**
   * Return the next available token ID to mint
   * @internal
   */
  public async nextTokenIdToMint(): Promise<BigNumber> {
    if (hasFunction<TokenERC721>("nextTokenIdToMint", this.contractWrapper)) {
      return await this.contractWrapper.readContract.nextTokenIdToMint();
    } else if (hasFunction<TokenERC721>("totalSupply", this.contractWrapper)) {
      return await this.contractWrapper.readContract.totalSupply();
    } else {
      throw new Error(
        "Contract requires either `nextTokenIdToMint` or `totalSupply` function available to determine the next token ID to mint",
      );
    }
  }

  private detectErc721Enumerable(): Erc721Supply | undefined {
    if (
      detectContractFeature<BaseERC721 & IERC721Supply>(
        this.contractWrapper,
        "ERC721Supply",
      ) ||
      hasFunction<TokenERC721>("nextTokenIdToMint", this.contractWrapper)
    ) {
      return new Erc721Supply(this, this.contractWrapper);
    }
    return undefined;
  }

  private detectErc721Mintable(): Erc721Mintable | undefined {
    if (
      detectContractFeature<IMintableERC721>(
        this.contractWrapper,
        "ERC721Mintable",
      )
    ) {
      return new Erc721Mintable(this, this.contractWrapper, this.storage);
    }
    return undefined;
  }

  private detectErc721Burnable(): Erc721Burnable | undefined {
    if (
      detectContractFeature<IBurnableERC721>(
        this.contractWrapper,
        "ERC721Burnable",
      )
    ) {
      return new Erc721Burnable(this.contractWrapper);
    }
    return undefined;
  }

  private detectErc721LazyMintable(): Erc721LazyMintable | undefined {
    if (
      detectContractFeature<BaseDropERC721>(
        this.contractWrapper,
        "ERC721LazyMintable",
      )
    ) {
      return new Erc721LazyMintable(this, this.contractWrapper, this.storage);
    }
    return undefined;
  }

  private detectErc721TieredDrop(): Erc721TieredDrop | undefined {
    if (
      detectContractFeature<TieredDrop>(
        this.contractWrapper,
        "ERC721TieredDrop",
      )
    ) {
      return new Erc721TieredDrop(this, this.contractWrapper, this.storage);
    }
    return undefined;
  }

  private detectErc721SignatureMintable():
    | Erc721WithQuantitySignatureMintable
    | undefined {
    if (
      detectContractFeature<ISignatureMintERC721>(
        this.contractWrapper,
        "ERC721SignatureMintV1",
      ) ||
      detectContractFeature<ISignatureMintERC721>(
        this.contractWrapper,
        "ERC721SignatureMintV2",
      )
    ) {
      return new Erc721WithQuantitySignatureMintable(
        this.contractWrapper,
        this.storage,
      );
    }
    return undefined;
  }
}
