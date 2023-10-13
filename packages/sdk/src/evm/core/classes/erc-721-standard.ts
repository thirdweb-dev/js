import type {
  DropERC721,
  SignatureDrop,
  TokenERC721,
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish } from "ethers";
import { QueryAllParams } from "../../../core/schema/QueryParams";
import { NFT, NFTWithoutMetadata } from "../../../core/schema/nft";
import { resolveAddress } from "../../common/ens/resolveAddress";
import { buildTransactionFunction } from "../../common/transactions";
import { Address } from "../../schema/shared/Address";
import { AddressOrEns } from "../../schema/shared/AddressOrEnsSchema";
import { BaseERC721 } from "../../types/eips";
import { UpdateableNetwork } from "../interfaces/contract";
import { NetworkInput } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { Erc721 } from "./erc-721";
import { Transaction } from "./transactions";

/**
 * Standard ERC721 NFT functions
 * @remarks Basic functionality for a ERC721 contract that handles IPFS storage for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.nft.transfer(walletAddress, tokenId);
 * ```
 * @public
 */
export class StandardErc721<
  T extends SignatureDrop | DropERC721 | TokenERC721 | BaseERC721 = BaseERC721,
> implements UpdateableNetwork
{
  protected contractWrapper: ContractWrapper<T>;
  protected storage: ThirdwebStorage;
  public erc721: Erc721<T>;

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
    this.erc721 = new Erc721(this.contractWrapper, this.storage, chainId);
    this._chainId = chainId;
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
   * console.log(nfts);
   * ```
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The NFT metadata for all NFTs queried.
   */
  public async getAll(queryParams?: QueryAllParams): Promise<NFT[]> {
    return this.erc721.getAll(queryParams);
  }

  public async getAllWithoutMetadata(
    queryParams?: QueryAllParams,
  ): Promise<NFTWithoutMetadata[]> {
    return this.erc721.getAllWithoutMetadata(queryParams);
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
   * console.log(nfts);
   * ```
   * @param walletAddress - the wallet address to query, defaults to the connected wallet
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The NFT metadata for all NFTs in the contract.
   */
  public async getOwned(
    walletAddress?: AddressOrEns,
    queryParams?: QueryAllParams,
  ): Promise<NFT[]> {
    if (walletAddress) {
      walletAddress = await resolveAddress(walletAddress);
    }
    return this.erc721.getOwned(walletAddress, queryParams);
  }

  public async getOwnedWithoutMetadata(
    walletAddress?: AddressOrEns,
  ): Promise<NFTWithoutMetadata[]> {
    if (walletAddress) {
      walletAddress = await resolveAddress(walletAddress);
    }
    return this.erc721.getOwnedWithoutMetadata(walletAddress);
  }

  /**
   * Get Owned Token Ids
   * @remarks Get all the token ids of NFTs owned by a specific wallet (no metadata)
   */
  public async getOwnedTokenIds(
    walletAddress?: AddressOrEns,
  ): Promise<BigNumber[]> {
    if (walletAddress) {
      walletAddress = await resolveAddress(walletAddress);
    }
    return this.erc721.getOwnedTokenIds(walletAddress);
  }

  /**
   * Get total minted supply count
   */
  public async totalSupply() {
    return this.erc721.totalCirculatingSupply();
  }

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
    async (to: AddressOrEns, tokenId: BigNumberish): Promise<Transaction> => {
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
    async (operator: AddressOrEns, approved: boolean): Promise<Transaction> => {
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
    async (
      operator: AddressOrEns,
      tokenId: BigNumberish,
    ): Promise<Transaction> => {
      return Transaction.fromContractWrapper({
        contractWrapper: this.contractWrapper,
        method: "approve",
        args: [await resolveAddress(operator), tokenId],
      });
    },
  );
}
