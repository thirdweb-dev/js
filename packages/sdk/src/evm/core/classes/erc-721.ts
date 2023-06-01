import type { QueryAllParams } from "../../../core/schema/QueryParams";
import type {
  NFT,
  NFTMetadata,
  NFTMetadataOrUri,
} from "../../../core/schema/nft";
import { assertEnabled } from "../../common/feature-detection/assertEnabled";
import { detectContractFeature } from "../../common/feature-detection/detectContractFeature";
import { hasFunction } from "../../common/feature-detection/hasFunction";
import {
  ExtensionNotImplementedError,
  NotFoundError,
} from "../../common/error";
import { resolveAddress } from "../../common/ens/resolveAddress";
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
import type { Address } from "../../schema/shared/Address";
import type { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import type { ClaimOptions, UploadProgressEvent } from "../../types";
import type {
  BaseClaimConditionERC721,
  BaseDropERC721,
  BaseERC721,
} from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { UpdateableNetwork } from "../interfaces/contract";
import type { NetworkInput, TransactionResultWithId } from "../types";
import type { ContractWrapper } from "./contract-wrapper";
import { Erc721Burnable } from "./erc-721-burnable";
import { Erc721WithQuantitySignatureMintable } from "./erc-721-with-quantity-signature-mintable";
import { Transaction } from "./transactions";
import type {
  DropERC721,
  IBurnableERC721,
  IClaimableERC721,
  IERC721Enumerable,
  IERC721Supply,
  IMintableERC721,
  ISignatureAction,
  ISignatureMintERC721,
  Multiwrap,
  SignatureDrop,
  TieredDrop,
  TokenERC721,
} from "@thirdweb-dev/contracts-js";
import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import {
  BigNumber,
  BigNumberish,
  constants,
  utils,
  CallOverrides,
} from "ethers";

import { getBaseUriFromBatch, uploadOrExtractURIs } from "../../common/nft";
import type { BaseDelayedRevealERC721 } from "../../types/eips";
import { DelayedReveal } from "./delayed-reveal";
import type { TokensLazyMintedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/LazyMint";

import { uploadOrExtractURI } from "../../common/nft";
import type { IMulticall } from "@thirdweb-dev/contracts-js";
import { TransferEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/ITokenERC721";

import { DEFAULT_QUERY_ALL_COUNT } from "../../../core/schema/QueryParams";

import { CommonNFTInput, NFTMetadataInput } from "../../../core/schema/nft";
import { GenericRequest } from "../../schema/contracts/common";
import {
  TieredDropPayloadInput,
  TieredDropPayloadOutput,
  TieredDropPayloadSchema,
  TieredDropPayloadWithSignature,
} from "../../schema/contracts/tiered-drop";
import { TokensClaimedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/TieredDrop";
import invariant from "tiny-invariant";
import { setErc20Allowance } from "../../common/currency/setErc20Allowance";
import { normalizePriceValue } from "../../common";

import { CustomContractSchema } from "../../schema/contracts/custom";
import { ContractMetadata } from "./contract-metadata";
import { DropClaimConditions } from "./drop-claim-conditions";

import { calculateClaimCost } from "../../common/claim-conditions/calculateClaimCost";

import type { TokensMintedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/IMintableERC721";

import { FEATURE_NFT_ENUMERABLE } from "../../constants/erc721-features";

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
  private claimWithConditions: Erc721ClaimableWithConditions | undefined;
  private claimCustom: Erc721Claimable | undefined;
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
    this.claimWithConditions = this.detectErc721ClaimableWithConditions();
    this.claimCustom = this.detectErc721Claimable();
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
   * Transfer an NFT from a specific wallet
   *
   * @remarks Transfer an NFT from the given wallet to another wallet.
   *
   * @example
   * ```javascript
   * const fromWalletAddress = "{{wallet_address}}";
   * const toWalletAddress = "{{wallet_address}}";
   * const tokenId = 0;
   * await contract.erc721.transferFrom(fromWalletAddress, toWalletAddress, tokenId);
   * ```
   * @twfeature ERC721
   */
  transferFrom = buildTransactionFunction(
    async (from: AddressOrEns, to: AddressOrEns, tokenId: BigNumberish) => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "transferFrom(address,address,uint256)",
        args: [await resolveAddress(from), await resolveAddress(to), tokenId],
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
      const claimWithConditions = this.claimWithConditions;
      const claim = this.claimCustom;
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
    const claimWithConditions = this.claimWithConditions;
    const claim = this.claimCustom;
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
      this.claimWithConditions,
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

  private detectErc721ClaimableWithConditions():
    | Erc721ClaimableWithConditions
    | undefined {
    if (
      detectContractFeature<BaseClaimConditionERC721>(
        this.contractWrapper,
        "ERC721ClaimConditionsV1",
      ) ||
      detectContractFeature<BaseClaimConditionERC721>(
        this.contractWrapper,
        "ERC721ClaimConditionsV2",
      ) ||
      detectContractFeature<BaseClaimConditionERC721>(
        this.contractWrapper,
        "ERC721ClaimPhasesV1",
      ) ||
      detectContractFeature<BaseClaimConditionERC721>(
        this.contractWrapper,
        "ERC721ClaimPhasesV2",
      )
    ) {
      return new Erc721ClaimableWithConditions(
        this,
        this.contractWrapper,
        this.storage,
      );
    }
    return undefined;
  }

  private detectErc721Claimable(): Erc721Claimable | undefined {
    if (
      detectContractFeature<IClaimableERC721>(
        this.contractWrapper,
        "ERC721ClaimCustom",
      )
    ) {
      return new Erc721Claimable(this, this.contractWrapper);
    }
    return undefined;
  }
}

/**
 * Lazily mint and claim ERC721 NFTs
 * @remarks Manage claim phases and claim ERC721 NFTs that have been lazily minted.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.drop.claim(quantity);
 * ```
 */
export class Erc721LazyMintable implements DetectableFeature {
  featureName = FEATURE_NFT_LAZY_MINTABLE.name;

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
   * await contract.nft.drop.revealer.createDelayedRevealBatch(
   *   placeholderNFT,
   *   realNFTs,
   *   "my secret password",
   * );
   * // Whenever you're ready, reveal your NFTs at any time
   * const batchId = 0; // the batch to reveal
   * await contract.erc721.revealer.reveal(batchId, "my secret password");
   * ```
   */
  public revealer: DelayedReveal<BaseDelayedRevealERC721> | undefined;

  private contractWrapper: ContractWrapper<BaseDropERC721>;
  private erc721: Erc721;
  private storage: ThirdwebStorage;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<BaseDropERC721>,
    storage: ThirdwebStorage,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;

    this.storage = storage;
    this.revealer = this.detectErc721Revealable();
  }

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
   * const results = await contract.erc721.lazyMint(metadatas); // uploads and creates the NFTs on chain
   * const firstTokenId = results[0].id; // token id of the first created NFT
   * const firstNFT = await results[0].data(); // (optional) fetch details of the first created NFT
   * ```
   *
   * @param metadatas - The metadata to include in the batch.
   * @param options - optional upload progress callback
   */
  lazyMint = buildTransactionFunction(
    async (
      metadatas: NFTMetadataOrUri[],
      options?: {
        onProgress: (event: UploadProgressEvent) => void;
      },
    ): Promise<Transaction<TransactionResultWithId<NFTMetadata>[]>> => {
      const startFileNumber = await this.erc721.nextTokenIdToMint();
      const batch = await uploadOrExtractURIs(
        metadatas,
        this.storage,
        startFileNumber.toNumber(),
        options,
      );
      // ensure baseUri is the same for the entire batch
      const baseUri = getBaseUriFromBatch(batch);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "lazyMint",
        args: [
          batch.length,
          baseUri.endsWith("/") ? baseUri : `${baseUri}/`,
          utils.toUtf8Bytes(""),
        ],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<TokensLazyMintedEvent>(
            "TokensLazyMinted",
            receipt?.logs,
          );
          const startingIndex = event[0].args.startTokenId;
          const endingIndex = event[0].args.endTokenId;
          const results: TransactionResultWithId<NFTMetadata>[] = [];
          for (let id = startingIndex; id.lte(endingIndex); id = id.add(1)) {
            results.push({
              id,
              receipt,
              data: () => this.erc721.getTokenMetadata(id),
            });
          }
          return results;
        },
      });
    },
  );

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  private detectErc721Revealable():
    | DelayedReveal<BaseDelayedRevealERC721>
    | undefined {
    if (
      detectContractFeature<BaseDelayedRevealERC721>(
        this.contractWrapper,
        "ERC721Revealable",
      )
    ) {
      return new DelayedReveal(
        this.contractWrapper,
        this.storage,
        FEATURE_NFT_REVEALABLE.name,
        () => this.erc721.nextTokenIdToMint(),
      );
    }
    return undefined;
  }
}

/**
 * Mint ERC721 NFTs
 * @remarks NFT minting functionality that handles IPFS storage for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.nft.mint.to(walletAddress, nftMetadata);
 * ```
 * @public
 */
export class Erc721Mintable implements DetectableFeature {
  featureName = FEATURE_NFT_MINTABLE.name;
  private contractWrapper: ContractWrapper<IMintableERC721>;
  private storage: ThirdwebStorage;
  private erc721: Erc721;

  public batch: Erc721BatchMintable | undefined;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<IMintableERC721>,
    storage: ThirdwebStorage,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.batch = this.detectErc721BatchMintable();
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
   * const tx = await contract.nft.mint.to(walletAddress, metadata);
   * const receipt = tx.receipt; // the transaction receipt
   * const tokenId = tx.id; // the id of the NFT minted
   * const nft = await tx.data(); // (optional) fetch details of minted NFT
   * ```
   */
  to = buildTransactionFunction(
    async (
      to: AddressOrEns,
      metadata: NFTMetadataOrUri,
    ): Promise<Transaction<TransactionResultWithId<NFT>>> => {
      const uri = await uploadOrExtractURI(metadata, this.storage);
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "mintTo",
        args: [await resolveAddress(to), uri],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<TransferEvent>(
            "Transfer",
            receipt?.logs,
          );
          if (event.length === 0) {
            throw new Error("TransferEvent event not found");
          }
          const id = event[0].args.tokenId;
          return {
            id,
            receipt,
            data: () => this.erc721.get(id),
          };
        },
      });
    },
  );

  /**
   * @deprecated Use `contract.erc721.mint.prepare(...args)` instead
   */
  public async getMintTransaction(
    to: AddressOrEns,
    metadata: NFTMetadataOrUri,
  ): Promise<Transaction> {
    return this.to.prepare(await resolveAddress(to), metadata);
  }

  private detectErc721BatchMintable(): Erc721BatchMintable | undefined {
    if (
      detectContractFeature<IMintableERC721 & IMulticall>(
        this.contractWrapper,
        "ERC721BatchMintable",
      )
    ) {
      return new Erc721BatchMintable(
        this.erc721,
        this.contractWrapper,
        this.storage,
      );
    }
    return undefined;
  }
}

/**
 * List ERC721 NFTs
 * @remarks Easily list all the NFTs in a ERC721 contract.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const nfts = await contract.nft.query.all();
 * ```
 * @public
 */
export class Erc721Supply implements DetectableFeature {
  featureName = FEATURE_NFT_SUPPLY.name;
  private contractWrapper: ContractWrapper<BaseERC721 & IERC721Supply>;
  private erc721: Erc721;

  public owned: Erc721Enumerable | undefined;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<BaseERC721 & IERC721Supply>,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;
    this.owned = this.detectErc721Owned();
  }

  /**
   * Get all NFTs
   *
   * @remarks Get all the data associated with every NFT in this contract.
   *
   * By default, returns the first 100 NFTs, use queryParams to fetch more.
   *
   * @example
   * ```javascript
   * const nfts = await contract.nft.query.all();
   * ```
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The NFT metadata for all NFTs queried.
   */
  public async all(queryParams?: QueryAllParams): Promise<NFT[]> {
    const start = BigNumber.from(queryParams?.start || 0).toNumber();
    const count = BigNumber.from(
      queryParams?.count || DEFAULT_QUERY_ALL_COUNT,
    ).toNumber();

    const maxSupply = await this.erc721.nextTokenIdToMint();
    const maxId = Math.min(maxSupply.toNumber(), start + count);
    return await Promise.all(
      [...Array(maxId - start).keys()].map((i) =>
        this.erc721.get((start + i).toString()),
      ),
    );
  }

  /**
   * Return all the owners of each token id in this contract
   * @returns
   */
  public async allOwners() {
    return Promise.all(
      [...new Array((await this.totalCount()).toNumber()).keys()].map(
        async (i) => ({
          tokenId: i,
          owner: await this.erc721
            .ownerOf(i)
            .catch(() => constants.AddressZero),
        }),
      ),
    );
  }

  /**
   * Get the number of NFTs minted
   * @remarks This returns the total number of NFTs minted in this contract, **not** the total supply of a given token.
   *
   * @returns the total number of NFTs minted in this contract
   * @public
   */
  public async totalCount(): Promise<BigNumber> {
    return await this.erc721.nextTokenIdToMint();
  }

  /**
   * Get the number of NFTs of this contract currently owned by end users
   * @returns the total number of NFTs of this contract in circulation (minted & not burned)
   * @public
   */
  public async totalCirculatingSupply(): Promise<BigNumber> {
    return await this.contractWrapper.readContract.totalSupply();
  }

  private detectErc721Owned(): Erc721Enumerable | undefined {
    if (
      detectContractFeature<BaseERC721 & IERC721Enumerable>(
        this.contractWrapper,
        "ERC721Enumerable",
      )
    ) {
      return new Erc721Enumerable(this.erc721, this.contractWrapper);
    }
    return undefined;
  }
}

export class Erc721TieredDrop implements DetectableFeature {
  featureName = FEATURE_NFT_TIERED_DROP.name;

  private contractWrapper: ContractWrapper<TieredDrop>;
  private erc721: Erc721;
  private storage: ThirdwebStorage;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<TieredDrop>,
    storage: ThirdwebStorage,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;
    this.storage = storage;
  }

  public async getMetadataInTier(
    tier: string,
  ): Promise<Omit<NFTMetadata, "id">[]> {
    const tiers =
      await this.contractWrapper.readContract.getMetadataForAllTiers();
    const batches = tiers.find((t) => t.tier === tier);

    if (!batches) {
      throw new Error("Tier not found in contract.");
    }

    const nfts = await Promise.all(
      batches.ranges
        .map((range, i) => {
          const nftsInRange = [];
          const baseUri = batches.baseURIs[i];
          for (
            let j = range.startIdInclusive.toNumber();
            j < range.endIdNonInclusive.toNumber();
            j++
          ) {
            const uri = `${baseUri}/${j}`;
            const metadata = this.storage.downloadJSON(uri);
            nftsInRange.push(metadata);
          }

          return nftsInRange;
        })
        .flat(),
    );

    return nfts;
  }

  public async getTokensInTier(tier: string): Promise<NFT[]> {
    const endIndex =
      await this.contractWrapper.readContract.getTokensInTierLen();
    if (endIndex.eq(0)) {
      return [];
    }

    const ranges = await this.contractWrapper.readContract.getTokensInTier(
      tier,
      0,
      endIndex,
    );

    const nfts = await Promise.all(
      ranges
        .map((range) => {
          const nftsInRange = [];
          for (
            let i = range.startIdInclusive.toNumber();
            i < range.endIdNonInclusive.toNumber();
            i++
          ) {
            nftsInRange.push(this.erc721.get(i));
          }
          return nftsInRange;
        })
        .flat(),
    );

    return nfts;
  }

  createBatchWithTier = buildTransactionFunction(
    async (
      metadatas: NFTMetadataOrUri[],
      tier: string,
      options?: {
        onProgress: (event: UploadProgressEvent) => void;
      },
    ): Promise<Transaction<TransactionResultWithId<NFTMetadata>[]>> => {
      // TODO: Change this to on extension
      const startFileNumber = await this.erc721.nextTokenIdToMint();
      const batch = await uploadOrExtractURIs(
        metadatas,
        this.storage,
        startFileNumber.toNumber(),
        options,
      );
      const baseUri = getBaseUriFromBatch(batch);

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "lazyMint",
        args: [
          batch.length,
          baseUri.endsWith("/") ? baseUri : `${baseUri}/`,
          tier,
          utils.toUtf8Bytes(""),
        ],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<TokensLazyMintedEvent>(
            "TokensLazyMinted",
            receipt?.logs,
          );

          const startingIndex = event[0].args[1];
          const endingIndex = event[0].args[2];
          const results: TransactionResultWithId<NFTMetadata>[] = [];
          for (let id = startingIndex; id.lte(endingIndex); id = id.add(1)) {
            results.push({
              id,
              receipt,
              data: () => this.erc721.getTokenMetadata(id),
            });
          }
          return results;
        },
      });
    },
  );

  createDelayedRevealBatchWithTier = buildTransactionFunction(
    async (
      placeholder: NFTMetadataInput,
      metadatas: NFTMetadataInput[],
      password: string,
      tier: string,
      options?: {
        onProgress: (event: UploadProgressEvent) => void;
      },
    ): Promise<Transaction<TransactionResultWithId<NFTMetadata>[]>> => {
      if (!password) {
        throw new Error("Password is required");
      }

      const placeholderUris = await this.storage.uploadBatch(
        [CommonNFTInput.parse(placeholder)],
        {
          rewriteFileNames: {
            fileStartNumber: 0,
          },
        },
      );
      const placeholderUri = getBaseUriFromBatch(placeholderUris);
      const startFileNumber = await this.erc721.nextTokenIdToMint();
      const uris = await this.storage.uploadBatch(
        metadatas.map((m) => CommonNFTInput.parse(m)),
        {
          onProgress: options?.onProgress,
          rewriteFileNames: {
            fileStartNumber: startFileNumber.toNumber(),
          },
        },
      );

      const baseUri = getBaseUriFromBatch(uris);
      const baseUriId =
        await this.contractWrapper.readContract.getBaseURICount();
      const chainId = await this.contractWrapper.getChainID();
      const hashedPassword = utils.solidityKeccak256(
        ["string", "uint256", "uint256", "address"],
        [
          password,
          chainId,
          baseUriId,
          this.contractWrapper.readContract.address,
        ],
      );

      const encryptedBaseUri =
        await this.contractWrapper.readContract.encryptDecrypt(
          utils.toUtf8Bytes(baseUri),
          hashedPassword,
        );

      let data: string;
      const provenanceHash = utils.solidityKeccak256(
        ["bytes", "bytes", "uint256"],
        [utils.toUtf8Bytes(baseUri), hashedPassword, chainId],
      );
      data = utils.defaultAbiCoder.encode(
        ["bytes", "bytes32"],
        [encryptedBaseUri, provenanceHash],
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "lazyMint",
        args: [
          uris.length,
          placeholderUri.endsWith("/") ? placeholderUri : `${placeholderUri}/`,
          tier,
          data,
        ],
        parse: (receipt) => {
          const event = this.contractWrapper.parseLogs<TokensLazyMintedEvent>(
            "TokensLazyMinted",
            receipt?.logs,
          );
          const startingIndex = event[0].args[1];
          const endingIndex = event[0].args[2];
          const results: TransactionResultWithId<NFTMetadata>[] = [];
          for (let id = startingIndex; id.lte(endingIndex); id = id.add(1)) {
            results.push({
              id,
              receipt,
              data: () => this.erc721.getTokenMetadata(id),
            });
          }

          return results;
        },
      });
    },
  );

  reveal = buildTransactionFunction(
    async (batchId: BigNumberish, password: string) => {
      if (!password) {
        throw new Error("Password is required");
      }
      const chainId = await this.contractWrapper.getChainID();
      const key = utils.solidityKeccak256(
        ["string", "uint256", "uint256", "address"],
        [password, chainId, batchId, this.contractWrapper.readContract.address],
      );
      // performing the reveal locally to make sure it'd succeed before sending the transaction
      try {
        const decryptedUri = await this.contractWrapper
          .callStatic()
          .reveal(batchId, key);
        // basic sanity check for making sure decryptedUri is valid
        // this is optional because invalid decryption key would result in non-utf8 bytes and
        // ethers would throw when trying to decode it
        if (!decryptedUri.includes("://") || !decryptedUri.endsWith("/")) {
          throw new Error("invalid password");
        }
      } catch (e) {
        throw new Error("invalid password");
      }

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "reveal",
        args: [batchId, key],
      });
    },
  );

  public async generate(
    payloadToSign: TieredDropPayloadInput,
  ): Promise<TieredDropPayloadWithSignature> {
    const [payload] = await this.generateBatch([payloadToSign]);
    return payload;
  }

  public async generateBatch(
    payloadsToSign: TieredDropPayloadInput[],
  ): Promise<TieredDropPayloadWithSignature[]> {
    const parsedPayloads = await Promise.all(
      payloadsToSign.map((payload) =>
        TieredDropPayloadSchema.parseAsync(payload),
      ),
    );
    const chainId = await this.contractWrapper.getChainID();
    const signer = this.contractWrapper.getSigner();
    invariant(signer, "No signer available");

    return await Promise.all(
      parsedPayloads.map(async (payload) => {
        const signature = await this.contractWrapper.signTypedData(
          signer,
          {
            name: "SignatureAction",
            version: "1",
            chainId,
            verifyingContract: this.contractWrapper.readContract.address,
          },
          { GenericRequest: GenericRequest },
          await this.mapPayloadToContractStruct(payload),
        );

        return { payload, signature: signature.toString() };
      }),
    );
  }

  public async verify(
    signedPayload: TieredDropPayloadWithSignature,
  ): Promise<boolean> {
    const message = await this.mapPayloadToContractStruct(
      signedPayload.payload,
    );
    const verification = await this.contractWrapper.readContract.verify(
      message,
      signedPayload.signature,
    );
    return verification[0];
  }

  public async claimWithSignature(
    signedPayload: TieredDropPayloadWithSignature,
  ): Promise<TransactionResultWithId<NFT>[]> {
    const message = await this.mapPayloadToContractStruct(
      signedPayload.payload,
    );
    const normalizedTotalPrice = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      signedPayload.payload.price,
      signedPayload.payload.currencyAddress,
    );

    const overrides = await this.contractWrapper.getCallOverrides();
    await setErc20Allowance(
      this.contractWrapper,
      normalizedTotalPrice,
      signedPayload.payload.currencyAddress,
      overrides,
    );

    const receipt = await this.contractWrapper.sendTransaction(
      "claimWithSignature",
      [message, signedPayload.signature],
      overrides,
    );
    const event = this.contractWrapper.parseLogs<TokensClaimedEvent>(
      "TokensClaimed",
      receipt?.logs,
    );
    const startingIndex = event[0].args.startTokenId;
    const endingIndex = startingIndex.add(event[0].args.quantityClaimed);
    const results: TransactionResultWithId<NFT>[] = [];
    for (let id = startingIndex; id.lt(endingIndex); id = id.add(1)) {
      results.push({
        id,
        receipt,
        data: () => this.erc721.get(id),
      });
    }

    return results;
  }

  private async mapPayloadToContractStruct(
    payload: TieredDropPayloadOutput,
  ): Promise<ISignatureAction.GenericRequestStruct> {
    const normalizedTotalPrice = await normalizePriceValue(
      this.contractWrapper.getProvider(),
      payload.price,
      payload.currencyAddress,
    );
    const data = utils.defaultAbiCoder.encode(
      [
        "string[]",
        "address",
        "address",
        "uint256",
        "address",
        "uint256",
        "uint256",
        "address",
      ],
      [
        payload.tierPriority,
        payload.to,
        payload.royaltyRecipient,
        payload.royaltyBps,
        payload.primarySaleRecipient,
        payload.quantity,
        normalizedTotalPrice,
        payload.currencyAddress,
      ],
    );

    return {
      uid: payload.uid,
      validityStartTimestamp: payload.mintStartTime,
      validityEndTimestamp: payload.mintEndTime,
      data,
    } as ISignatureAction.GenericRequestStruct;
  }
}

/**
 * Configure and claim ERC721 NFTs
 * @remarks Manage claim phases and claim ERC721 NFTs that have been lazily minted.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.erc721.claim(quantity);
 * await contract.erc721.claimConditions.getActive();
 * ```
 */
export class Erc721ClaimableWithConditions implements DetectableFeature {
  featureName = FEATURE_NFT_CLAIM_CONDITIONS_V2.name;

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
   */
  public conditions: DropClaimConditions<BaseClaimConditionERC721>;
  private contractWrapper: ContractWrapper<BaseClaimConditionERC721>;
  private erc721: Erc721;
  private storage: ThirdwebStorage;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<BaseClaimConditionERC721>,
    storage: ThirdwebStorage,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;

    this.storage = storage;
    const metadata = new ContractMetadata(
      this.contractWrapper,
      CustomContractSchema,
      this.storage,
    );
    this.conditions = new DropClaimConditions(
      this.contractWrapper,
      metadata,
      this.storage,
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
   * const tx = await contract.erc721.claimTo(address, quantity);
   * const receipt = tx[0].receipt; // the transaction receipt
   * const claimedTokenId = tx[0].id; // the id of the first NFT claimed
   * const claimedNFT = await tx[0].data(); // (optional) get the first claimed NFT metadata
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param quantity - Quantity of the tokens you want to claim
   * @param options
   * @returns - an array of results containing the id of the token claimed, the transaction receipt and a promise to optionally fetch the nft metadata
   */
  to = buildTransactionFunction(
    async (
      destinationAddress: AddressOrEns,
      quantity: BigNumberish,
      options?: ClaimOptions,
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      // TODO: Transaction Sequence Pattern
      const tx = (await this.conditions.getClaimTransaction(
        destinationAddress,
        quantity,
        options,
      )) as any as Transaction<TransactionResultWithId<NFT>[]>;
      tx.setParse((receipt) => {
        const event = this.contractWrapper.parseLogs<TokensClaimedEvent>(
          "TokensClaimed",
          receipt?.logs,
        );
        const startingIndex: BigNumber = event[0].args.startTokenId;
        const endingIndex = startingIndex.add(quantity);
        const results: TransactionResultWithId<NFT>[] = [];
        for (let id = startingIndex; id.lt(endingIndex); id = id.add(1)) {
          results.push({
            id,
            receipt,
            data: () => this.erc721.get(id),
          });
        }
        return results;
      });

      return tx;
    },
  );
}

/**
 * Configure and claim ERC721 NFTs
 * @remarks Manage claim phases and claim ERC721 NFTs that have been lazily minted.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.erc721.claim(tokenId, quantity);
 * ```
 */
export class Erc721Claimable implements DetectableFeature {
  featureName = FEATURE_NFT_CLAIM_CUSTOM.name;

  private erc721: Erc721;
  private contractWrapper: ContractWrapper<IClaimableERC721>;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<IClaimableERC721>,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;
  }

  /**
   * Construct a claim transaction without executing it.
   * This is useful for estimating the gas cost of a claim transaction, overriding transaction options and having fine grained control over the transaction execution.
   * @param destinationAddress - Address you want to send the token to
   * @param tokenId - Id of the token you want to claim
   * @param quantity - Quantity of the tokens you want to claim
   * @param options - Options for claiming the NFTs
   *
   * @deprecated Use `contract.erc721.claim.prepare(...args)` instead
   */
  public async getClaimTransaction(
    destinationAddress: AddressOrEns,
    quantity: BigNumberish,
    options?: ClaimOptions,
  ): Promise<Transaction> {
    // TODO: Transaction Sequence Pattern
    let overrides: CallOverrides = {};
    if (options && options.pricePerToken) {
      overrides = await calculateClaimCost(
        this.contractWrapper,
        options.pricePerToken,
        quantity,
        options.currencyAddress,
        options.checkERC20Allowance,
      );
    }
    return Transaction.fromContractWrapper({
      contractWrapper: this.contractWrapper,
      method: "claim",
      args: [destinationAddress, quantity],
      overrides,
    });
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
   * const tx = await contract.erc721.claimTo(address, tokenId, quantity);
   * const receipt = tx[0].receipt; // the transaction receipt
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param quantity - Quantity of the tokens you want to claim
   * @param options - Options for claiming the NFTs
   *
   * @returns - Receipt for the transaction
   */
  to = buildTransactionFunction(
    async (
      destinationAddress: AddressOrEns,
      quantity: BigNumberish,
      options?: ClaimOptions,
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      // TODO: Transaction Sequence Pattern
      const tx = (await this.getClaimTransaction(
        destinationAddress,
        quantity,
        options,
      )) as any as Transaction<TransactionResultWithId<NFT>[]>;
      tx.setParse((receipt) => {
        const event = this.contractWrapper.parseLogs<TokensClaimedEvent>(
          "TokensClaimed",
          receipt?.logs,
        );
        const startingIndex: BigNumber = event[0].args.startTokenId;
        const endingIndex = startingIndex.add(quantity);
        const results: TransactionResultWithId<NFT>[] = [];
        for (let id = startingIndex; id.lt(endingIndex); id = id.add(1)) {
          results.push({
            id,
            receipt,
            data: () => this.erc721.get(id),
          });
        }
        return results;
      });
      return tx;
    },
  );
}

/**
 * Mint Many ERC721 NFTs at once
 * @remarks NFT batch minting functionality that handles IPFS storage for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.nft.mint.batch.to(walletAddress, [nftMetadata1, nftMetadata2, ...]);
 * ```
 * @public
 */
export class Erc721BatchMintable implements DetectableFeature {
  featureName = FEATURE_NFT_BATCH_MINTABLE.name;
  private contractWrapper: ContractWrapper<IMintableERC721 & IMulticall>;
  private storage: ThirdwebStorage;
  private erc721: Erc721;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<IMintableERC721 & IMulticall>,
    storage: ThirdwebStorage,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;
    this.storage = storage;
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
   * const tx = await contract.mint.batch.to(walletAddress, metadatas);
   * const receipt = tx[0].receipt; // same transaction receipt for all minted NFTs
   * const firstTokenId = tx[0].id; // token id of the first minted NFT
   * const firstNFT = await tx[0].data(); // (optional) fetch details of the first minted NFT
   * ```
   */
  to = buildTransactionFunction(
    async (
      to: AddressOrEns,
      metadatas: NFTMetadataOrUri[],
    ): Promise<Transaction<TransactionResultWithId<NFT>[]>> => {
      const uris = await uploadOrExtractURIs(metadatas, this.storage);
      const resolvedAddress = await resolveAddress(to);
      const encoded = await Promise.all(
        uris.map(async (uri) =>
          this.contractWrapper.readContract.interface.encodeFunctionData(
            "mintTo",
            [resolvedAddress, uri],
          ),
        ),
      );

      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "multicall",
        args: [encoded],
        parse: (receipt) => {
          const events = this.contractWrapper.parseLogs<TokensMintedEvent>(
            "TokensMinted",
            receipt.logs,
          );
          if (events.length === 0 || events.length < metadatas.length) {
            throw new Error("TokenMinted event not found, minting failed");
          }
          return events.map((e) => {
            const id = e.args.tokenIdMinted;
            return {
              id,
              receipt,
              data: () => this.erc721.get(id),
            };
          });
        },
      });
    },
  );
}

/**
 * List owned ERC721 NFTs
 * @remarks Easily list all the NFTs from a ERC721 contract, owned by a certain wallet.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const walletAddress = "0x...";
 * const ownedNFTs = await contract.nft.query.owned.all(walletAddress);
 * ```
 * @public
 */
export class Erc721Enumerable implements DetectableFeature {
  featureName = FEATURE_NFT_ENUMERABLE.name;
  private contractWrapper: ContractWrapper<BaseERC721 & IERC721Enumerable>;
  private erc721: Erc721;

  constructor(
    erc721: Erc721,
    contractWrapper: ContractWrapper<BaseERC721 & IERC721Enumerable>,
  ) {
    this.erc721 = erc721;
    this.contractWrapper = contractWrapper;
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
   * const nfts = await contract.nft.query.owned.all(address);
   * ```
   * @param walletAddress - the wallet address to query, defaults to the connected wallet
   * @returns The NFT metadata for all NFTs in the contract.
   */
  public async all(walletAddress?: AddressOrEns): Promise<NFT[]> {
    const tokenIds = await this.tokenIds(walletAddress);
    return await Promise.all(
      tokenIds.map((tokenId) => this.erc721.get(tokenId.toString())),
    );
  }

  /**
   * Get all token ids of NFTs owned by a specific wallet.
   * @param walletAddress - the wallet address to query, defaults to the connected wallet
   */
  public async tokenIds(walletAddress?: AddressOrEns): Promise<BigNumber[]> {
    const address = await resolveAddress(
      walletAddress || (await this.contractWrapper.getSignerAddress()),
    );

    const balance = await this.contractWrapper.readContract.balanceOf(address);
    const indices = Array.from(Array(balance.toNumber()).keys());
    return await Promise.all(
      indices.map((i) =>
        this.contractWrapper.readContract.tokenOfOwnerByIndex(address, i),
      ),
    );
  }
}
