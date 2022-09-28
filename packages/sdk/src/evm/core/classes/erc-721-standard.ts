import { NFTMetadataOwner } from "../../schema/tokens/common";
import { QueryAllParams } from "../../types";
import { BaseERC721 } from "../../types/eips";
import { UpdateableNetwork } from "../interfaces/contract";
import { NetworkOrSignerOrProvider, TransactionResult } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { Erc721 } from "./erc-721";
import type {
  DropERC721,
  SignatureDrop,
  TokenERC721,
} from "@thirdweb-dev/contracts-js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish } from "ethers";

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

  constructor(contractWrapper: ContractWrapper<T>, storage: ThirdwebStorage) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.erc721 = new Erc721(this.contractWrapper, this.storage);
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
    return this.erc721.getAll(queryParams);
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
    return this.erc721.getOwned(walletAddress);
  }

  /**
   * Get Owned Token Ids
   * @remarks Get all the token ids of NFTs owned by a specific wallet (no metadata)
   */
  public async getOwnedTokenIds(walletAddress?: string): Promise<BigNumber[]> {
    return this.erc721.getOwnedTokenIds(walletAddress);
  }

  /**
   * Get the total count NFTs minted in this contract
   */
  public async totalSupply() {
    return this.erc721.totalCirculatingSupply();
  }

  /**
   * Get a single NFT Metadata
   *
   * @example
   * ```javascript
   * const tokenId = 0;
   * const nft = await contract.get(tokenId);
   * ```
   * @param tokenId - the tokenId of the NFT to retrieve
   * @returns The NFT metadata
   */
  public async get(tokenId: BigNumberish): Promise<NFTMetadataOwner> {
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
  public async balanceOf(address: string): Promise<BigNumber> {
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
  public async isApproved(address: string, operator: string): Promise<boolean> {
    return this.erc721.isApproved(address, operator);
  }

  /**
   * Transfer a single NFT
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
  public async transfer(
    to: string,
    tokenId: BigNumberish,
  ): Promise<TransactionResult> {
    return this.erc721.transfer(to, tokenId);
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
    return this.erc721.setApprovalForAll(operator, approved);
  }

  /**
   * Approve an operator for the NFT owner. Operators can call transferFrom or safeTransferFrom for the specified token.
   * @param operator - the operator's address
   * @param tokenId - the tokenId to give approval for
   *
   * @internal
   */
  public async setApprovalForToken(
    operator: string,
    tokenId: BigNumberish,
  ): Promise<TransactionResult> {
    return {
      receipt: await this.contractWrapper.sendTransaction("approve", [
        operator,
        tokenId,
      ]),
    };
  }
}
