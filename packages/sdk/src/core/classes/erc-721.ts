import {
  detectContractFeature,
  hasFunction,
  NotFoundError,
} from "../../common";
import { fetchTokenMetadata } from "../../common/nft";
import { FEATURE_NFT } from "../../constants/erc721-features";
import { SDKOptions, SDKOptionsSchema } from "../../schema/sdk-options";
import { NFTMetadata, NFTMetadataOwner } from "../../schema/tokens/common";
import { BaseDropERC721, BaseERC721 } from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { UpdateableNetwork } from "../interfaces/contract";
import { NetworkOrSignerOrProvider, TransactionResult } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { Erc721Burnable } from "./erc-721-burnable";
import { Erc721Droppable } from "./erc-721-droppable";
import { Erc721Mintable } from "./erc-721-mintable";
import { Erc721Supply } from "./erc-721-supply";
import { Erc721WithQuantitySignatureMintable } from "./erc-721-with-quantity-signature-mintable";
import {
  DropERC721,
  IBurnableERC721,
  IERC721Supply,
  IMintableERC721,
  ISignatureMintERC721,
  Multiwrap,
  SignatureDrop,
  TokenERC721,
} from "@thirdweb-dev/contracts-js";
import { IStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, constants } from "ethers";

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
  public query: Erc721Supply | undefined;
  public mint: Erc721Mintable | undefined;
  public burn: Erc721Burnable | undefined;
  public drop: Erc721Droppable | undefined;
  public signature: Erc721WithQuantitySignatureMintable | undefined;
  protected contractWrapper: ContractWrapper<T>;
  protected storage: IStorage;
  protected options: SDKOptions;

  constructor(
    contractWrapper: ContractWrapper<T>,
    storage: IStorage,
    options: SDKOptions = {},
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    try {
      this.options = SDKOptionsSchema.parse(options);
    } catch (optionParseError) {
      console.error(
        "invalid contract options object passed, falling back to default options",
        optionParseError,
      );
      this.options = SDKOptionsSchema.parse({});
    }
    this.query = this.detectErc721Enumerable();
    this.mint = this.detectErc721Mintable();
    this.burn = this.detectErc721Burnable();
    this.drop = this.detectErc721Droppable();
    this.signature = this.detectErc721SignatureMintable();
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
   * Get a single NFT Metadata
   *
   * @example
   * ```javascript
   * const tokenId = 0;
   * const nft = await contract.nft.get(tokenId);
   * ```
   * @param tokenId - the tokenId of the NFT to retrieve
   * @returns The NFT metadata
   */
  public async get(tokenId: BigNumberish): Promise<NFTMetadataOwner> {
    const [owner, metadata] = await Promise.all([
      this.ownerOf(tokenId).catch(() => constants.AddressZero),
      this.getTokenMetadata(tokenId),
    ]);
    return { owner, metadata };
  }

  /**
   * Get the current owner of a given NFT within this Contract
   *
   * @param tokenId - the tokenId of the NFT
   * @returns the address of the owner
   */
  public async ownerOf(tokenId: BigNumberish): Promise<string> {
    return await this.contractWrapper.readContract.ownerOf(tokenId);
  }

  /**
   * Get NFT Balance
   *
   * @remarks Get a wallets NFT balance (number of NFTs in this contract owned by the wallet).
   *
   * @example
   * ```javascript
   * const walletAddress = "{{wallet_address}}";
   * const balance = await contract.nft.balanceOf(walletAddress);
   * console.log(balance);
   * ```
   */
  public async balanceOf(address: string): Promise<BigNumber> {
    return await this.contractWrapper.readContract.balanceOf(address);
  }

  /**
   * Get NFT Balance for the currently connected wallet
   */
  public async balance(): Promise<BigNumber> {
    return await this.balanceOf(await this.contractWrapper.getSignerAddress());
  }

  /**
   * Get whether this wallet has approved transfers from the given operator
   * @param address - the wallet address
   * @param operator - the operator address
   */
  public async isApproved(address: string, operator: string): Promise<boolean> {
    return await this.contractWrapper.readContract.isApprovedForAll(
      address,
      operator,
    );
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Transfer a single NFT
   *
   * @remarks Transfer an NFT from the connected wallet to another wallet.
   *
   * @example
   * ```javascript
   * const walletAddress = "{{wallet_address}}";
   * const tokenId = 0;
   * await contract.nft.transfer(walletAddress, tokenId);
   * ```
   */
  public async transfer(
    to: string,
    tokenId: BigNumberish,
  ): Promise<TransactionResult> {
    const from = await this.contractWrapper.getSignerAddress();
    return {
      receipt: await this.contractWrapper.sendTransaction(
        "safeTransferFrom(address,address,uint256)",
        [from, to, tokenId],
      ),
    };
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
    return {
      receipt: await this.contractWrapper.sendTransaction("setApprovalForAll", [
        operator,
        approved,
      ]),
    };
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

  private detectErc721Droppable(): Erc721Droppable | undefined {
    if (
      detectContractFeature<BaseDropERC721>(
        this.contractWrapper,
        "ERC721Droppable",
      )
    ) {
      return new Erc721Droppable(this, this.contractWrapper, this.storage);
    }
    return undefined;
  }

  private detectErc721SignatureMintable():
    | Erc721WithQuantitySignatureMintable
    | undefined {
    if (
      detectContractFeature<ISignatureMintERC721>(
        this.contractWrapper,
        "ERC721SignatureMint",
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
