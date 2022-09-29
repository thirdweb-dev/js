import { ClaimConditions } from "../classes/claim-conditions";
import { NFTHelper } from "../classes/helpers/nft-helper";
import { TransactionResult } from "../types/common";
import {
  CommonNFTInput,
  NFTCollectionMetadata,
  NFTMetadata,
  NFTMetadataInput,
} from "../types/nft";
import { Metaplex, MintCandyMachineOutput } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import invariant from "tiny-invariant";

/**
 * A collection of NFTs that can be lazy minted and claimed
 *
 * @example
 * ```jsx
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
 *
 * const sdk = ThirdwebSDK.fromNetwork("devnet");
 * sdk.wallet.connect(signer);
 *
 * // Get the interface for your NFT collection program
 * const program = await sdk.getNFTCollection("{{contract_address}}");
 * ```
 *
 * @public
 */
export class NFTDrop {
  private metaplex: Metaplex;
  private storage: ThirdwebStorage;
  private nft: NFTHelper;
  public accountType = "nft-drop" as const;
  public publicKey: PublicKey;
  public claimConditions: ClaimConditions;
  public get network() {
    const url = new URL(this.metaplex.connection.rpcEndpoint);
    // try this first to avoid hitting `custom` network for alchemy urls
    if (url.hostname.includes("devnet")) {
      return "devnet";
    }
    if (url.hostname.includes("mainnet")) {
      return "mainnet-beta";
    }
    return this.metaplex.cluster;
  }

  constructor(
    dropMintAddress: string,
    metaplex: Metaplex,
    storage: ThirdwebStorage,
  ) {
    this.storage = storage;
    this.metaplex = metaplex;
    this.nft = new NFTHelper(metaplex);
    this.publicKey = new PublicKey(dropMintAddress);
    this.claimConditions = new ClaimConditions(dropMintAddress, metaplex);
  }

  /**
   * Get the metadata for this program.
   * @returns program metadata
   *
   * @example
   * ```jsx
   * const metadata = await program.getMetadata();
   * console.log(metadata.name);
   * ```
   */
  async getMetadata(): Promise<NFTCollectionMetadata> {
    const info = await this.getCandyMachine();
    invariant(info.collectionMintAddress, "Collection mint address not found");
    const metadata = await this.metaplex
      .nfts()
      .findByMint({ mintAddress: info.collectionMintAddress })
      .run();
    return this.nft.toNFTMetadata(metadata);
  }

  /**
   * Get the metadata for a specific NFT
   * @param nftAddress - the mint address of the NFT to get
   * @returns the metadata of the NFT
   *
   * @example
   * ```jsx
   * const mintAddress = "...";
   * const nft = await program.get(mintAddress);
   * ```
   */
  async get(nftAddress: string): Promise<NFTMetadata | undefined> {
    return this.nft.get(nftAddress);
  }

  /**
   * Get the metadata for all NFTs on this drop
   * @returns metadata for all minted NFTs
   *
   * @example
   * ```jsx
   * const nfts = await program.getAll();
   * ```
   */
  async getAll(): Promise<NFTMetadata[]> {
    // TODO: Add pagination to get NFT functions
    const info = await this.getCandyMachine();
    // TODO merge with getAllClaimed()
    return await Promise.all(
      info.items.map(async (item) => {
        const metadata = await this.storage.downloadJSON(item.uri);
        return { id: "", uri: item.uri, ...metadata };
      }),
    );
  }

  /**
   * Get the metadata for all the claimed NFTs on this drop
   * @returns metadata for all claimed NFTs
   *
   * @example
   * ```jsx
   * const nfts = await program.getAllClaimed();
   * ```
   */
  async getAllClaimed(): Promise<NFTMetadata[]> {
    const nfts = await this.metaplex
      .candyMachines()
      .findMintedNfts({ candyMachine: this.publicKey })
      .run();

    return nfts.map((nft) => this.nft.toNFTMetadata(nft));
  }

  /**
   * Get the NFT balance of the connected wallet
   * @returns the NFT balance
   *
   * @example
   * ```jsx
   * const balance = await program.balance();
   * ```
   */
  async balance(nftAddress: string): Promise<number> {
    const address = this.metaplex.identity().publicKey.toBase58();
    return this.balanceOf(address, nftAddress);
  }

  /**
   * Get the NFT balance of the specified wallet
   * @param walletAddress - the wallet address to get the balance of
   * @param nftAddress - the mint address of the NFT to get the balance of
   * @returns the NFT balance
   *
   * @example
   * ```jsx
   * const walletAddress = "..."
   * const mintAddress = "..."
   * const balance = await program.balanceOf(walletAddress, mintAddress);
   * ```
   */
  async balanceOf(walletAddress: string, nftAddress: string): Promise<number> {
    return this.nft.balanceOf(walletAddress, nftAddress);
  }

  /**
   * Get the total unclaimed supply of this drop
   * @returns the total supply
   *
   * @example
   * ```jsx
   * const supply = await program.totalUnclaimedSupply();
   * ```
   */
  async totalUnclaimedSupply(): Promise<number> {
    const info = await this.getCandyMachine();
    return Math.min(
      info.itemsLoaded.toNumber(),
      info.itemsRemaining.toNumber(),
    );
  }

  /**
   * Get the total claimed supply of this drop
   * @returns the total supply
   *
   * @example
   * ```jsx
   * const supply = await program.totalClaimedSupply();
   * ```
   */
  async totalClaimedSupply(): Promise<number> {
    const info = await this.getCandyMachine();
    return info.itemsMinted.toNumber();
  }

  /**
   * Transfer the specified NFTs to another wallet
   * @param receiverAddress - The address to send the tokens to
   * @param nftAddress - The mint address of the NFT to transfer
   * @returns the transaction result of the transfer
   *
   * @example
   * ```jsx
   * const to = "...";
   * const mintAddress = "...";
   * const tx = await program.transfer(to, mintAddress);
   * ```
   */
  async transfer(
    receiverAddress: string,
    nftAddress: string,
  ): Promise<TransactionResult> {
    return this.nft.transfer(receiverAddress, nftAddress);
  }

  /**
   * Lazy mint NFTs to be claimed later
   * @param metadatas - The metadata of the NFTs to lazy mint
   * @returns the transaction result of the lazy mint
   *
   * @example
   * ```jsx
   * const metadatas = [
   *   {
   *     name: "NFT #1",
   *     image: readFileSync("test/file.jpg"),
   *   }
   * ]
   *
   * const tx = await program.lazyMint(metadatas);
   * ```
   */
  async lazyMint(metadatas: NFTMetadataInput[]): Promise<TransactionResult> {
    const parsedMetadatas = metadatas.map((metadata) =>
      CommonNFTInput.parse(metadata),
    );
    const uris = await this.storage.uploadBatch(parsedMetadatas);
    const items = uris.map((uri, i) => ({
      name: parsedMetadatas[i].name?.toString() || "",
      uri,
    }));

    const result = await this.metaplex
      .candyMachines()
      .insertItems({
        candyMachine: await this.getCandyMachine(),
        authority: this.metaplex.identity(),
        items,
      })
      .run();

    return {
      signature: result.response.signature,
    };
  }

  /**
   * Claim an NFT from the drop with connected wallet
   * @returns - the mint address of the claimed NFT
   *
   * @example
   * ```jsx
   * const claimedAddresses = await program.claim(1);
   * console.log("Claimed NFT at address", claimedAddresses[0]);
   * ```
   */
  async claim(quantity: number): Promise<string[]> {
    const address = this.metaplex.identity().publicKey.toBase58();
    return this.claimTo(address, quantity);
  }

  /**
   * Claim an NFT from the drop for the specified wallet
   * @returns - the mint address of the claimed NFT
   *
   * @example
   * ```jsx
   * const receiverAddress =  "...";
   * const claimedAddresses = await program.claimTo(receiverAddress, 1);
   * console.log("Claimed NFT at address", claimedAddresses[0]);
   * ```
   */
  async claimTo(receiverAddress: string, quantity: number): Promise<string[]> {
    const candyMachine = await this.getCandyMachine();
    const results: MintCandyMachineOutput[] = [];
    // has to claim sequentially
    for (let i = 0; i < quantity; i++) {
      results.push(
        await this.metaplex
          .candyMachines()
          .mint({ candyMachine, newOwner: new PublicKey(receiverAddress) })
          .run(),
      );
    }
    return results.map((result) => result.nft.address.toBase58());
  }

  private async getCandyMachine() {
    return this.metaplex
      .candyMachines()
      .findByAddress({ address: this.publicKey })
      .run();
  }
}
