import { NFTHelper } from "../classes/helpers/nft-helper";
import { METAPLEX_PROGRAM_ID } from "../constants/addresses";
import { TransactionResult } from "../types/common";
import {
  NFTCollectionMetadata,
  NFTMetadata,
  NFTMetadataInput,
} from "../types/nft";
import {
  findEditionMarkerPda,
  Metaplex,
  toBigNumber,
} from "@metaplex-foundation/js";
import {
  EditionMarker,
  Metadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { ConfirmedSignatureInfo, PublicKey } from "@solana/web3.js";
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
 * const program = await sdk.getNFTCollection("{{contract_address}}");
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
    return this.metaplex.cluster;
  }

  constructor(
    collectionMintAddress: string,
    metaplex: Metaplex,
    storage: ThirdwebStorage,
  ) {
    this.storage = storage;
    this.metaplex = metaplex;
    this.nft = new NFTHelper(metaplex);
    this.publicKey = new PublicKey(collectionMintAddress);
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
    const metadata = await this.metaplex
      .nfts()
      .findByMint({ mintAddress: this.publicKey })
      .run();

    return this.nft.toNFTMetadata(metadata);
  }

  /**
   * Get the metadata for a specific NFT
   * @param mintAddress - the mint address of the NFT to get
   * @returns the metadata of the NFT
   *
   * @example
   * ```jsx
   * const mintAddress = "...";
   * const nft = await program.get(mintAddress);
   * ```
   */
  async get(mintAddress: string): Promise<NFTMetadata> {
    return this.nft.get(mintAddress);
  }

  /**
   * Get the metadata for all NFTs on this collection
   * @returns metadata for all minted NFTs
   *
   * @example
   * ```jsx
   * const nfts = await program.getAll();
   * ```
   */
  async getAll(): Promise<NFTMetadata[]> {
    const addresses = await this.getAllNFTAddresses();
    return await Promise.all(addresses.map((a) => this.get(a)));
  }

  /**
   * Get the mint addresses for all NFTs on this collection
   * @returns mint addresses for all minted NFTs
   *
   * @example
   * ```jsx
   * const nfts = await program.getAllNFTAddresses();
   * ```
   */
  async getAllNFTAddresses(): Promise<string[]> {
    const allSignatures: ConfirmedSignatureInfo[] = [];
    // This returns the first 1000, so we need to loop through until we run out of signatures to get.
    let signatures = await this.metaplex.connection.getSignaturesForAddress(
      this.publicKey,
    );

    allSignatures.push(...signatures);
    do {
      const options = {
        before: signatures[signatures.length - 1]?.signature,
      };
      signatures = await this.metaplex.connection.getSignaturesForAddress(
        this.publicKey,
        options,
      );
      allSignatures.push(...signatures);
    } while (signatures.length > 0);

    const metadataAddresses: PublicKey[] = [];
    const mintAddresses = new Set<string>();

    // TODO RPC's will throttle this, need to do some optimizations here
    const batchSize = 1000; // alchemy RPC batch limit
    for (let i = 0; i < allSignatures.length; i += batchSize) {
      const batch = allSignatures.slice(
        i,
        Math.min(allSignatures.length, i + batchSize),
      );

      const transactions = await this.metaplex.connection.getTransactions(
        batch.map((s) => s.signature),
      );

      for (const tx of transactions) {
        if (tx) {
          const programIds = tx.transaction.message
            .programIds()
            .map((p) => p.toString());
          const accountKeys = tx.transaction.message.accountKeys.map((p) =>
            p.toString(),
          );
          // Only look in transactions that call the Metaplex token metadata program
          if (programIds.includes(METAPLEX_PROGRAM_ID)) {
            // Go through all instructions in a given transaction
            for (const ix of tx.transaction.message.instructions) {
              // Filter for setAndVerify or verify instructions in the Metaplex token metadata program
              if (
                (ix.data === "K" || ix.data === "S" || ix.data === "X") &&
                accountKeys[ix.programIdIndex] === METAPLEX_PROGRAM_ID
              ) {
                const metadataAddressIndex = ix.accounts[0];
                const metadata_address =
                  tx.transaction.message.accountKeys[metadataAddressIndex];
                metadataAddresses.push(metadata_address);
              }
            }
          }
        }
      }
    }

    const metadataAccounts = await Promise.all(
      metadataAddresses.map((a) => {
        try {
          return this.metaplex.connection.getAccountInfo(a);
        } catch (e) {
          console.log(e);
          return undefined;
        }
      }),
    );

    for (const account of metadataAccounts) {
      if (account) {
        const [metadata] = Metadata.deserialize(account.data);
        mintAddresses.add(metadata.mint.toBase58());
      }
    }

    return Array.from(mintAddresses);
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
  async balance(mintAddress: string): Promise<number> {
    const address = this.metaplex.identity().publicKey.toBase58();
    return this.balanceOf(address, mintAddress);
  }

  /**
   * Get the NFT balance of the specified wallet
   * @param walletAddress - the wallet address to get the balance of
   * @param mintAddress - the mint address of the NFT to get the balance of
   * @returns the NFT balance
   *
   * @example
   * ```jsx
   * const walletAddress = "..."
   * const mintAddress = "..."
   * const balance = await program.balanceOf(walletAddress, mintAddress);
   * ```
   */
  async balanceOf(walletAddress: string, mintAddress: string): Promise<number> {
    return this.nft.balanceOf(walletAddress, mintAddress);
  }

  /**
   * Get the supply of NFT editions minted from a specific NFT
   * @param mintAddress - the mint address of the NFT to check the supply of
   * @returns the supply of the specified NFT
   *
   * @example
   * ```jsx
   * const address = "...";
   * const supply = await program.supplyOf(addres);
   * ```
   */
  async supplyOf(mintAddress: string): Promise<bigint> {
    let editionMarkerNumber = 0;
    let totalSupply = 1;

    cursedBitwiseLogicLoop: while (true) {
      const editionMarkerAddress = findEditionMarkerPda(
        new PublicKey(mintAddress),
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
   * @param mintAddress - The mint address of the NFT to transfer
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
    mintAddress: string,
  ): Promise<TransactionResult> {
    return this.nft.transfer(receiverAddress, mintAddress);
  }

  /**
   * Mint NFTs to the connected wallet
   * @param metadata - the metadata of the NFT to mint
   * @returns the mint address of the minted NFT
   *
   * @example
   * ```jsx
   * const metadata = {
   *   name: "NFT #1",
   *   image: readFileSync("files/image.jpg"),
   * }
   * const address = await program.mint(metadata);
   * ```
   */
  async mint(metadata: NFTMetadataInput): Promise<string> {
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
   * const to = "..."
   * const metadata = {
   *   name: "NFT #1",
   *   image: readFileSync("files/image.jpg"),
   * }
   * const address = await program.mintTo(to, metadata);
   * ```
   */
  async mintTo(to: string, metadata: NFTMetadataInput) {
    // TODO add options param for initial/maximum supply
    const uri = await this.storage.upload(metadata);
    const { nft } = await this.metaplex
      .nfts()
      .create({
        name: metadata.name?.toString() || "",
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
   * @param mintAddress - the mint address to mint additional supply to
   * @returns the mint address of the minted NFT
   *
   * @example
   * ```jsx
   * const mintAddress = "..."
   * const address = await program.mintAdditionalSupply(mintAddress);
   * ```
   */
  async mintAdditionalSupply(mintAddress: string) {
    const address = this.metaplex.identity().publicKey.toBase58();
    return this.mintAdditionalSupplyTo(address, mintAddress);
  }

  /**
   * Mint additional supply of an NFT to the specified wallet
   * @param to - the address to mint the NFT to
   * @param mintAddress - the mint address to mint additional supply to
   * @returns the mint address of the minted NFT
   *
   * @example
   * ```jsx
   * const to = "..."
   * const mintAddress = "..."
   * const address = await program.mintAdditionalSupplyTo(to, mintAddress);
   * ```
   */
  async mintAdditionalSupplyTo(
    to: string,
    mintAddress: string,
  ): Promise<string> {
    // TODO add quantity param
    const result = await this.metaplex
      .nfts()
      .printNewEdition({
        originalMint: new PublicKey(mintAddress),
        newOwner: new PublicKey(to),
      })
      .run();
    return result.nft.address.toBase58();
  }
}
