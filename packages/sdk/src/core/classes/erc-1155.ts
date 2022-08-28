import { ContractWrapper } from "./contract-wrapper";
import {
  DropERC1155,
  IBurnableERC1155,
  IERC1155Enumerable,
  IMintableERC1155,
  TokenERC1155,
} from "@thirdweb-dev/contracts-js";
import { BigNumber, BigNumberish, BytesLike } from "ethers";
import { NFTMetadata } from "../../schema/tokens/common";
import { IStorage } from "@thirdweb-dev/storage";
import { NetworkOrSignerOrProvider, TransactionResult } from "../types";
import { UpdateableNetwork } from "../interfaces/contract";
import { SDKOptions, SDKOptionsSchema } from "../../schema/sdk-options";
import {
  EditionMetadata,
  EditionMetadataOutputSchema,
} from "../../schema/tokens/edition";
import { fetchTokenMetadata } from "../../common/nft";
import {
  detectContractFeature,
  hasFunction,
  NotFoundError,
} from "../../common";
import { AirdropInput } from "../../types/airdrop/airdrop";
import { AirdropInputSchema } from "../../schema/contracts/common/airdrop";
import {
  BaseDropERC1155,
  BaseERC1155,
  BaseSignatureMintERC1155,
} from "../../types/eips";
import { Erc1155Enumerable } from "./erc-1155-enumerable";
import { Erc1155Mintable } from "./erc-1155-mintable";
import { FEATURE_EDITION } from "../../constants/erc1155-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";
import { Erc1155SignatureMintable } from "./erc-1155-signature-mintable";
import { Erc1155Droppable } from "./erc-1155-droppable";
import { Erc1155Burnable } from "./erc-1155-burnable";

/**
 * Standard ERC1155 NFT functions
 * @remarks Basic functionality for a ERC1155 contract that handles IPFS storage for you.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * await contract.edition.transfer(walletAddress, tokenId, quantity);
 * ```
 * @public
 */
export class Erc1155<
  T extends DropERC1155 | TokenERC1155 | BaseERC1155 =
    | BaseERC1155
    | BaseSignatureMintERC1155,
> implements UpdateableNetwork, DetectableFeature
{
  featureName = FEATURE_EDITION.name;
  public query: Erc1155Enumerable | undefined;
  public mint: Erc1155Mintable | undefined;
  public burn: Erc1155Burnable | undefined;
  public drop: Erc1155Droppable | undefined;
  public signature: Erc1155SignatureMintable | undefined;
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
    this.query = this.detectErc1155Enumerable();
    this.mint = this.detectErc1155Mintable();
    this.burn = this.detectErc1155Burnable();
    this.drop = this.detectErc1155Droppable();
    this.signature = this.detectErc1155SignatureMintable();
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
   * const nft = await contract.get("0");
   * ```
   * @param tokenId - the tokenId of the NFT to retrieve
   * @returns The NFT metadata
   */
  public async get(tokenId: BigNumberish): Promise<EditionMetadata> {
    const [supply, metadata] = await Promise.all([
      this.contractWrapper.readContract
        .totalSupply(tokenId)
        .catch(() => BigNumber.from(0)),
      this.getTokenMetadata(tokenId),
    ]);
    return EditionMetadataOutputSchema.parse({
      supply,
      metadata,
    });
  }

  /**
   * Returns the total supply of a specific token
   * @param tokenId - The token ID to get the total supply of
   * @returns the total supply
   */
  public async totalSupply(tokenId: BigNumberish): Promise<BigNumber> {
    return await this.contractWrapper.readContract.totalSupply(tokenId);
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
    return await this.contractWrapper.readContract.balanceOf(address, tokenId);
  }

  /**
   * Get NFT Balance for the currently connected wallet
   */
  public async balance(tokenId: BigNumberish): Promise<BigNumber> {
    return await this.balanceOf(
      await this.contractWrapper.getSignerAddress(),
      tokenId,
    );
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
    const from = await this.contractWrapper.getSignerAddress();
    return {
      receipt: await this.contractWrapper.sendTransaction("safeTransferFrom", [
        from,
        to,
        tokenId,
        amount,
        data,
      ]),
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

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

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
    const from = await this.contractWrapper.getSignerAddress();

    const balanceOf = await this.balanceOf(from, tokenId);

    const input = AirdropInputSchema.parse(addresses);

    const totalToAirdrop = input.reduce((prev, curr) => {
      return prev + Number(curr?.quantity || 1);
    }, 0);

    if (balanceOf.toNumber() < totalToAirdrop) {
      throw new Error(
        `The caller owns ${balanceOf.toNumber()} NFTs, but wants to airdrop ${totalToAirdrop} NFTs.`,
      );
    }

    const encoded = input.map(({ address: to, quantity }) => {
      return this.contractWrapper.readContract.interface.encodeFunctionData(
        "safeTransferFrom",
        [from, to, tokenId, quantity, data],
      );
    });

    return {
      receipt: await this.contractWrapper.multiCall(encoded),
    };
  }

  /**
   * Return the next available token ID to mint
   * @internal
   */
  public async nextTokenIdToMint(): Promise<BigNumber> {
    if (hasFunction<TokenERC1155>("nextTokenIdToMint", this.contractWrapper)) {
      return await this.contractWrapper.readContract.nextTokenIdToMint();
    } else {
      throw new Error(
        "Contract requires the `nextTokenIdToMint` function available to determine the next token ID to mint",
      );
    }
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  /**
   * @internal
   * @param tokenId - the token Id to fetch
   */
  public async getTokenMetadata(tokenId: BigNumberish): Promise<NFTMetadata> {
    const tokenUri = await this.contractWrapper.readContract.uri(tokenId);
    if (!tokenUri) {
      throw new NotFoundError();
    }
    return fetchTokenMetadata(tokenId, tokenUri, this.storage);
  }

  private detectErc1155Enumerable(): Erc1155Enumerable | undefined {
    if (
      detectContractFeature<BaseERC1155 & IERC1155Enumerable>(
        this.contractWrapper,
        "ERC1155Enumerable",
      )
    ) {
      return new Erc1155Enumerable(this, this.contractWrapper);
    }
    return undefined;
  }

  private detectErc1155Mintable(): Erc1155Mintable | undefined {
    if (
      detectContractFeature<IMintableERC1155>(
        this.contractWrapper,
        "ERC1155Mintable",
      )
    ) {
      return new Erc1155Mintable(this, this.contractWrapper, this.storage);
    }
    return undefined;
  }

  private detectErc1155Burnable(): Erc1155Burnable | undefined {
    if (
      detectContractFeature<IBurnableERC1155>(
        this.contractWrapper,
        "ERC1155Burnable",
      )
    ) {
      return new Erc1155Burnable(this.contractWrapper);
    }
    return undefined;
  }

  private detectErc1155Droppable(): Erc1155Droppable | undefined {
    if (
      detectContractFeature<BaseDropERC1155>(
        this.contractWrapper,
        "ERC1155Droppable",
      )
    ) {
      return new Erc1155Droppable(this, this.contractWrapper, this.storage);
    }
    return undefined;
  }

  private detectErc1155SignatureMintable():
    | Erc1155SignatureMintable
    | undefined {
    if (
      detectContractFeature<BaseSignatureMintERC1155>(
        this.contractWrapper,
        "ERC1155SignatureMintable",
      )
    ) {
      return new Erc1155SignatureMintable(this.contractWrapper, this.storage);
    }
    return undefined;
  }
}
