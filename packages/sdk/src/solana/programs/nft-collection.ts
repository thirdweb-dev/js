import { QueryAllParams } from "../../core/schema/QueryParams";
import {
  NFT,
  NFTMetadata,
  NFTMetadataInput,
  NFTMetadataOrUri,
} from "../../core/schema/nft";
import { enforceCreator } from "../classes/helpers/creators-helper";
import { NFTHelper } from "../classes/helpers/nft-helper";
import { TransactionResult } from "../types/common";
import { CreatorInput } from "../types/programs";
import { getNework } from "../utils/urls";
import {
  findEditionMarkerPda,
  Metaplex,
  toBigNumber,
} from "@metaplex-foundation/js";
import { EditionMarker } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

/**
 * A collection of associated NFTs
 *
 * @example
 * ```jsx
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
 *
 * const sdk = ThirdwebSDK.fromNetwork("devnet");
 * sdk.wallet.connect(signer);
 *
 * // Get the interface for your NFT collection program
 * const program = await sdk.getProgram("{{program_address}}", "nft-collection");
 * ```
 *
 * @public
 */
export class NFTCollection {
  private metaplex: Metaplex;
  private storage: ThirdwebStorage;
  private nft: NFTHelper;
  public publicKey: PublicKey;
  public accountType = "nft-collection" as const;
  public get network() {
    return getNework(this.metaplex);
  }

  constructor(
    collectionAddress: string,
    metaplex: Metaplex,
    storage: ThirdwebStorage,
  ) {
    this.storage = storage;
    this.metaplex = metaplex;
    this.nft = new NFTHelper(metaplex);
    this.publicKey = new PublicKey(collectionAddress);
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
  async getMetadata(): Promise<NFTMetadata> {
    const metadata = await this.metaplex
      .nfts()
      .findByMint({ mintAddress: this.publicKey })
      .run();

    return (await this.nft.toNFTMetadata(metadata)).metadata;
  }

  /**
   * Get the metadata for a specific NFT
   * @param nftAddress - the mint address of the NFT to get
   * @returns the metadata of the NFT
   *
   * @example
   * ```jsx
   * // Specify the mint address of the NFT to get the data of
   * const nftAddress = "...";
   * // And get the data for the NFT
   * const nft = await program.get(nftAddress);
   * console.log(nft.metadata.name);
   * console.log(nft.owner);
   * ```
   */
  async get(nftAddress: string): Promise<NFT> {
    return this.nft.get(nftAddress);
  }

  /**
   * Get the metadata for all NFTs on this collection
   * @remarks This method is paginated. Use the `start` and `count` properties of the queryParams object to control pagination. By default the first 100 NFTs are returned
   * @returns metadata for all minted NFTs
   *
   * @example
   * ```jsx
   * // Get all the NFTs that have been minted on this contract
   * const nfts = await program.getAll();
   * console.log(nfts[0].metadata.name);
   * console.log(nfts[0].owner);
   * ```
   */
  async getAll(queryParams?: QueryAllParams): Promise<NFT[]> {
    return this.nft.getAll(this.publicKey.toBase58(), queryParams);
  }

  /**
   * Get the NFT balance of the connected wallet
   * @returns the NFT balance
   *
   * @example
   * ```jsx
   * // The mint address of the NFT to check the balance of
   * const nftAddress = "..."
   * // Get the NFT balance of the currently connected wallet
   * const balance = await program.balance(nftAddress);
   * console.log(balance);
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
   * // Specify the address of the wallet to get the balance of
   * const walletAddress = "..."
   * // Specify the mint address of the NFT to get the balance of
   * const nftAddress = "..."
   * const balance = await program.balanceOf(walletAddress, nftAddress);
   * ```
   */
  async balanceOf(walletAddress: string, nftAddress: string): Promise<number> {
    return this.nft.balanceOf(walletAddress, nftAddress);
  }

  /**
   * Get the current owner of the given NFT
   * @param nftAddress - the mint address of the NFT to get the owner of
   * @returns the owner of the NFT
   * @example
   * ```jsx
   * const nftAddress = "..."
   * const owner = await program.ownerOf(nftAddress);
   * console.log(owner);
   * ```
   */
  async ownerOf(nftAddress: string): Promise<string | undefined> {
    return this.nft.ownerOf(nftAddress);
  }

  /**
   * Get the supply of NFT editions minted from a specific NFT
   * @param nftAddress - the mint address of the NFT to check the supply of
   * @returns the supply of the specified NFT
   *
   * @example
   * ```jsx
   * const address = "...";
   * const supply = await program.supplyOf(address);
   * ```
   */
  async supplyOf(nftAddress: string): Promise<bigint> {
    let editionMarkerNumber = 0;
    let totalSupply = 1;

    cursedBitwiseLogicLoop: while (true) {
      const editionMarkerAddress = findEditionMarkerPda(
        new PublicKey(nftAddress),
        toBigNumber(editionMarkerNumber * 248),
      );
      const editionMarker = await EditionMarker.fromAccountAddress(
        this.metaplex.connection,
        editionMarkerAddress,
      );

      // WARNING: Ugly bitwise operations because of Rust :(
      const indexCap = editionMarkerNumber === 0 ? 247 : 248;
      for (let editionIndex = 0; editionIndex < indexCap; editionIndex++) {
        const ledgerIndex =
          editionMarkerNumber > 0
            ? Math.floor(editionIndex / 8)
            : editionIndex < 7
            ? 0
            : Math.floor((editionIndex - 7) / 8) + 1;
        const size = editionMarkerNumber === 0 && ledgerIndex === 0 ? 7 : 8;
        const shiftBase = 0b1 << (size - 1);

        const bitmask =
          ledgerIndex === 0
            ? shiftBase >> editionIndex
            : editionMarkerNumber > 0
            ? shiftBase >> editionIndex % (ledgerIndex * 8)
            : ledgerIndex === 1
            ? shiftBase >> (editionIndex - 7)
            : shiftBase >> (editionIndex - 7) % ((ledgerIndex - 1) * 8);

        const editionExists =
          (editionMarker.ledger[ledgerIndex] & bitmask) !== 0;

        if (editionExists) {
          totalSupply += 1;
        } else {
          break cursedBitwiseLogicLoop;
        }
      }

      editionMarkerNumber++;
    }

    return BigInt(totalSupply);
  }

  /**
   * Transfer the specified NFTs to another wallet
   * @param receiverAddress - The address to send the tokens to
   * @param nftAddress - The mint address of the NFT to transfer
   * @returns the transaction result of the transfer
   *
   * @example
   * ```jsx
   * // The wallet address to transfer the NFTs to
   * const to = "...";
   * // The mint address of the NFT to transfer
   * const nftAddress = "...";
   * const tx = await program.transfer(to, nftAddress);
   * ```
   */
  async transfer(
    receiverAddress: string,
    nftAddress: string,
  ): Promise<TransactionResult> {
    return this.nft.transfer(receiverAddress, nftAddress);
  }

  /**
   * Mint NFTs to the connected wallet
   * @param metadata - the metadata of the NFT to mint
   * @returns the mint address of the minted NFT
   *
   * @example
   * ```jsx
   * // Add the metadata of your NFT
   * const metadata = {
   *   name: "NFT #1",
   *   description: "My first NFT!",
   *   image: readFileSync("files/image.jpg"),
   *   properties: [
   *     {
   *        name: "coolness",
   *        value: "very cool!"
   *     }
   *   ]
   * }
   *
   * // Then mint the new NFT and get its address
   * const address = await program.mint(metadata);
   * console.log(address);
   * ```
   */
  async mint(metadata: NFTMetadataOrUri): Promise<string> {
    const address = this.metaplex.identity().publicKey.toBase58();
    return this.mintTo(address, metadata);
  }

  /**
   * Mint an NFT to the specified wallet
   * @param to - the address to mint the NFT to
   * @param metadata - the metadata of the NFT to mint
   * @returns the mint address of the minted NFT
   *
   * @example
   * ```jsx
   * // Specify who to mint the NFT to
   * const to = "...";
   *
   * // Add the metadata of your NFT
   * const metadata = {
   *   name: "NFT #1",
   *   description: "My first NFT!",
   *   image: readFileSync("files/image.jpg"),
   *   properties: [
   *     {
   *        name: "coolness",
   *        value: "very cool!"
   *     }
   *   ]
   * }
   *
   * // Then mint the new NFT and get its address
   * const address = await program.mintTo(to, metadata);
   * console.log(address);
   * ```
   */
  async mintTo(to: string, metadata: NFTMetadataOrUri) {
    // TODO add options param for initial/maximum supply
    const uri =
      typeof metadata === "string"
        ? metadata
        : await this.storage.upload(metadata);
    const name =
      typeof metadata === "string" ? "" : metadata.name?.toString() || "";
    const { nft } = await this.metaplex
      .nfts()
      .create({
        name,
        uri,
        sellerFeeBasisPoints: 0,
        collection: this.publicKey,
        collectionAuthority: this.metaplex.identity(),
        tokenOwner: new PublicKey(to),
        // Always sets max supply to unlimited so editions can be minted
        maxSupply: null,
      })
      .run();

    return nft.address.toBase58();
  }

  /**
   * Mint additional supply of an NFT to the connected wallet
   * @param nftAddress - the mint address to mint additional supply to
   * @returns the mint address of the minted NFT
   *
   * @example
   * ```jsx
   * // The address of the already minted NFT
   * const nftAddress = "..."
   * // Mint an additional NFT of the original NFT
   * const address = await program.mintAdditionalSupply(nftAddress);
   * ```
   */
  async mintAdditionalSupply(nftAddress: string) {
    const address = this.metaplex.identity().publicKey.toBase58();
    return this.mintAdditionalSupplyTo(address, nftAddress);
  }

  /**
   * Mint additional supply of an NFT to the specified wallet
   * @param to - the address to mint the NFT to
   * @param nftAddress - the mint address to mint additional supply to
   * @returns the mint address of the minted NFT
   *
   * @example
   * ```jsx
   * // Specify who to mint the additional NFT to
   * const to = "..."
   * // The address of the already minted NFT
   * const nftAddress = "..."
   * // Mint an additional NFT of the original NFT
   * const address = await program.mintAdditionalSupplyTo(to, nftAddress);
   * ```
   */
  async mintAdditionalSupplyTo(
    to: string,
    nftAddress: string,
  ): Promise<string> {
    // TODO add quantity param
    const result = await this.metaplex
      .nfts()
      .printNewEdition({
        originalMint: new PublicKey(nftAddress),
        newOwner: new PublicKey(to),
      })
      .run();
    return result.nft.address.toBase58();
  }

  /**
   * Burn an NFT
   * @param nftAddress - the mint address of the NFT to burn
   * @returns the transaction signature
   *
   * @example
   * ```jsx
   * // Specify the address of the NFT to burn
   * const nftAddress = "..."
   * // And send the actual burn transaction
   * const tx = await program.burn(nftAddress);
   * ```
   */
  async burn(nftAddress: string): Promise<TransactionResult> {
    const tx = await this.metaplex
      .nfts()
      .delete({
        mintAddress: new PublicKey(nftAddress),
        collection: this.publicKey,
      })
      .run();
    return {
      signature: tx.response.signature,
    };
  }

  /**
   * Update the settings of the collection
   * @param settings - the settings to update
   */
  async updateSettings(settings: { creators?: CreatorInput[] }) {
    const updateData = {
      ...(settings.creators && {
        creators: enforceCreator(
          settings.creators,
          this.metaplex.identity().publicKey,
        ),
      }),
    };
    this.metaplex.nfts().update({
      nftOrSft: await this.getCollection(),
      ...updateData,
    });
  }

  private async getCollection() {
    return await this.metaplex
      .nfts()
      .findByMint({ mintAddress: this.publicKey })
      .run();
  }
}
