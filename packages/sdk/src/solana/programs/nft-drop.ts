import {
  QueryAllParams,
  QueryAllParamsSchema,
} from "../../core/schema/QueryParams";
import {
  CommonNFTInput,
  NFT,
  NFTMetadata,
  NFTMetadataInput,
} from "../../core/schema/nft";
import { Amount } from "../../core/schema/shared";
import { ClaimConditions } from "../classes/claim-conditions";
import {
  enforceCreator,
  parseCreators,
} from "../classes/helpers/creators-helper";
import { NFTHelper } from "../classes/helpers/nft-helper";
import { TransactionResult } from "../types/common";
import { CreatorInput, CreatorOutput } from "../types/programs";
import { sendMultipartTransaction } from "../utils/transactions";
import { getNework } from "../utils/urls";
import {
  CandyMachineV2Item,
  findCandyMachineV2CreatorPda,
  Metaplex,
  toBigNumber,
  TransactionBuilder,
} from "@metaplex-foundation/js";
import {
  PublicKey,
  SignaturesForAddressOptions,
  TransactionResponse,
} from "@solana/web3.js";
import { ThirdwebStorage, UploadProgressEvent } from "@thirdweb-dev/storage";
import invariant from "tiny-invariant";

const LAZY_MINT_BATCH_SIZE = 5;

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
 * // Get the interface for your NFT Drop program
 * const program = await sdk.getProgram("{{program_address}}", "nft-drop");
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
  public get network() {
    return getNework(this.metaplex);
  }

  /**
   * Manage the claim conditions for this drop
   *
   * @example
   * ```jsx
   * // set your claim conditions
   * await program.claimConditions.set({
   *  maxClaimable: 100,
   *  price: 0.5,
   *  startTime: new Date(),
   * });
   *
   * // get your claim conditions
   * const conditions = await program.claimConditions.get();
   * console.log(conditions.maxClaimable);
   * console.log(conditions.claimedSupply);
   * ```
   */
  public claimConditions: ClaimConditions;

  constructor(
    dropAddress: string,
    metaplex: Metaplex,
    storage: ThirdwebStorage,
  ) {
    this.storage = storage;
    this.metaplex = metaplex;
    this.nft = new NFTHelper(metaplex);
    this.publicKey = new PublicKey(dropAddress);
    this.claimConditions = new ClaimConditions(dropAddress, metaplex);
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
    const info = await this.getCandyMachine();
    invariant(info.collectionMintAddress, "Collection mint address not found");
    const metadata = await this.metaplex
      .nfts()
      .findByMint({ mintAddress: info.collectionMintAddress });

    return (await this.nft.toNFTMetadata(metadata)).metadata;
  }

  /**
   * Get the creators of this program.
   * @returns program metadata
   *
   * @example
   * ```jsx
   * const creators = await program.getCreators();
   * console.log(creators);
   * ```
   */
  async getCreators(): Promise<CreatorOutput[]> {
    const info = await this.getCandyMachine();
    return parseCreators(info.creators);
  }

  /**
   * Get the royalty basis points for this collection
   * @returns royalty basis points
   *
   * @example
   * ```jsx
   * const royalty = await program.getRoyalty();
   * console.log(royalty);
   * ```
   */
  async getRoyalty(): Promise<number> {
    const info = await this.getCandyMachine();
    return info.sellerFeeBasisPoints;
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
   *
   * console.log(nft.name);
   * ```
   */
  async get(nftAddress: string): Promise<NFT> {
    return this.nft.get(nftAddress);
  }

  /**
   * Get the metadata for all NFTs on this drop
   * @returns metadata for all minted NFTs
   *
   * @example
   * ```jsx
   * // Get all the NFTs that have been minted on this contract
   * const nfts = await program.getAll();
   *
   * console.log(nfts[0].metadata.name);
   * ```
   */
  async getAll(queryParams?: QueryAllParams): Promise<NFT[]> {
    const parsedQueryParams = QueryAllParamsSchema.parse(queryParams);
    const info = await this.getCandyMachine();

    // First, get all the claimed NFTs within the query params range
    const claimedNfts = await this.getAllClaimed(parsedQueryParams);
    const totalClaimed = await this.totalClaimedSupply();

    // Then filter out all claimed NFTs from items to leave only unclaimed remaining
    const unclaimedItems: CandyMachineV2Item[] = [];
    info.items.forEach((item) => {
      const isClaimed =
        claimedNfts.filter(
          (nft) =>
            nft.metadata.name === item.name && nft.metadata.uri === item.uri,
        ).length > 0;

      if (!isClaimed) {
        unclaimedItems.push(item);
      }
    });

    // Only fill the remaining count left over after claimed NFTs with unclaimed NFTs
    const startIndex = Math.max(0, parsedQueryParams.start - totalClaimed);
    const endIndex = Math.max(
      0,
      startIndex + parsedQueryParams.count - claimedNfts.length,
    );

    const _items = unclaimedItems.slice(startIndex, endIndex);
    const unclaimedNfts = (
      await Promise.all(
        _items.map((item) => this.storage.downloadJSON(item.uri)),
      )
    ).map((metadata, index) => {
      const item = _items[index];
      return {
        metadata: {
          ...metadata,
          id: PublicKey.default.toBase58(),
          uri: item.uri,
        },
        owner: PublicKey.default.toBase58(),
        supply: "0",
        type: "metaplex",
      } as NFT;
    });
    // Always return claimed NFTs first, and then fill remaining query count with unclaimed NFTs
    return [...claimedNfts, ...unclaimedNfts];
  }

  /**
   * Get the all transactions for this program
   * @beta
   */
  async getTransactions(
    options?: SignaturesForAddressOptions,
  ): Promise<TransactionResponse[]> {
    return this.nft.getTransactions(this.publicKey.toBase58(), options);
  }

  /**
   * Get the metadata for all the claimed NFTs on this drop
   * @returns metadata for all claimed NFTs
   *
   * @example
   * ```jsx
   * // Get all the NFTs that have already been claimed from this drop
   * const nfts = await program.getAllClaimed();
   * console.log(nfts[0].name)
   * ```
   */
  async getAllClaimed(queryParams?: QueryAllParams): Promise<NFT[]> {
    // using getAll from collection here because candy machin findAllMinted doesn't return anything
    const candy = await this.getCandyMachine();
    invariant(candy.collectionMintAddress, "Collection mint address not found");
    return await this.nft.getAll(
      candy.collectionMintAddress.toBase58(),
      queryParams,
    );
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
   * // The address of the wallet to check the balance of
   * const walletAddress = "..."
   * // The mint address of the NFT to check the balance of
   * const nftAddress = "..."
   * // Get the actual NFT balance of the specified wallet
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
   * Get the total minted supply of this drop
   * @returns the total supply
   *
   * @example
   * ```jsx
   * // Get the total number of NFTs that have been minted on this drop
   * const supply = await program.totalSupply();
   * ```
   */
  async totalSupply(): Promise<number> {
    const info = await this.getCandyMachine();
    return info.itemsLoaded.toNumber();
  }

  /**
   * Get the total unclaimed supply of this drop
   * @returns the total supply
   *
   * @example
   * ```jsx
   * // Get the total number of lazy minted NFTs that aren't yet claimed
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
   * // Get the total number of lazy minted NFTs that have already been claimed
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
   * Lazy mint NFTs to be claimed later
   * @param metadatas - The metadata of the NFTs to lazy mint
   * @param options
   * @returns the transaction result of the lazy mint
   *
   * @example
   * ```jsx
   * // Add the metadata of your NFTs
   * const metadata = [
   *   {
   *     name: "NFT #1",
   *     description: "My first NFT!",
   *     image: readFileSync("files/image.jpg"),
   *     properties: [
   *       {
   *         name: "coolness",
   *         value: "very cool!"
   *       }
   *     ]
   *   }
   * ];
   *
   * // And lazy mint NFTs to your program
   * const tx = await program.lazyMint(metadatas);
   * ```
   */
  async lazyMint(
    metadatas: NFTMetadataInput[],
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    },
  ): Promise<TransactionResult[]> {
    const candyMachine = await this.getCandyMachine();
    const parsedMetadatas = metadatas.map((metadata) =>
      CommonNFTInput.parse(metadata),
    );
    const uris = await this.storage.uploadBatch(parsedMetadatas, options);
    const items: CandyMachineV2Item[] = uris.map((uri, i) => ({
      name: parsedMetadatas[i].name?.toString() || "",
      uri,
    }));

    // turn items into batches of $LAZY_MINT_BATCH_SIZE
    const batches: CandyMachineV2Item[][] = [];
    while (items.length) {
      batches.push(items.splice(0, LAZY_MINT_BATCH_SIZE));
    }

    const builders = batches.map((batch, i) =>
      this.metaplex
        .candyMachinesV2()
        .builders()
        .insertItems({
          candyMachine,
          authority: this.metaplex.identity(),
          items: batch,
          index: toBigNumber(
            i * LAZY_MINT_BATCH_SIZE + candyMachine.itemsLoaded.toNumber(),
          ),
        }),
    );
    return await sendMultipartTransaction(builders, this.metaplex);
  }

  /**
   * Claim an NFT from the drop with connected wallet
   * @returns - the mint address of the claimed NFT
   *
   * @example
   * ```jsx
   * // Specify the quantity of NFTs to claim
   * const quantity = 1;
   * // Claim NFTs and get their mint addresses
   * const claimedAddresses = await program.claim(quantity);
   * console.log("Claimed NFT at address", claimedAddresses[0]);
   * ```
   */
  async claim(amount: Amount): Promise<string[]> {
    const address = this.metaplex.identity().publicKey.toBase58();
    return this.claimTo(address, amount);
  }

  /**
   * Claim an NFT from the drop for the specified wallet
   * @returns - the mint address of the claimed NFT
   *
   * @example
   * ```jsx
   * // Specify which address to claim the NFTs to
   * const receiverAddress =  "...";
   * // Claim the NFTs to the specified wallet and get the mint addresses of the NFTs
   * const claimedAddresses = await program.claimTo(receiverAddress, 1);
   * console.log("Claimed NFT at address", claimedAddresses[0]);
   * ```
   */
  async claimTo(receiverAddress: string, amount: Amount): Promise<string[]> {
    const candyMachine = await this.getCandyMachine();
    await this.claimConditions.assertCanClaimable(Number(amount));
    const builders = await Promise.all(
      [...Array(Number(amount)).keys()].map(() => {
        return this.metaplex
          .candyMachinesV2()
          .builders()
          .mint({
            candyMachine,
            newOwner: new PublicKey(receiverAddress),
          });
      }),
    );
    const mintAddresses = builders.map((builder) =>
      builder.getContext().mintSigner.publicKey.toBase58(),
    );
    await sendMultipartTransaction(builders, this.metaplex);
    return mintAddresses;
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
    return this.burnBatch([nftAddress]).then((txs) => txs[0]);
  }

  /**
   * Burn multiple NFTs
   * @param nftAddresses - the mint addresses of the NFT to burn
   * @returns the transaction signature
   *
   * @example
   * ```jsx
   * // Specify the address of the NFT to burn
   * const nftAddress1 = "..."
   * const nftAddress2 = "..."
   * // And send the actual burn transaction
   * const tx = await program.burnBatch([nftAddress1, nftAddress2]);
   * ```
   */
  async burnBatch(nftAddresses: string[]): Promise<TransactionResult[]> {
    const candyMachine = await this.getCandyMachine();
    const collection = candyMachine.collectionMintAddress
      ? candyMachine.collectionMintAddress
      : undefined;
    const txs: TransactionBuilder[] = [];

    for (const nftAddress of nftAddresses) {
      txs.push(
        this.metaplex
          .nfts()
          .builders()
          .delete({
            mintAddress: new PublicKey(nftAddress),
            collection,
          }),
      );
    }

    return await sendMultipartTransaction(txs, this.metaplex);
  }

  /**
   * Update the creators of the collection
   * @param creators - the creators to update
   * @param updateAll - whether or not to retroactively update the creators of all past NFTs
   */
  async updateCreators(
    creators: CreatorInput[],
    updateAll: boolean = false,
  ): Promise<TransactionResult[]> {
    if (updateAll) {
      const txs: TransactionBuilder[] = [];

      const candyMachine = await this.getCandyMachine();
      const collectionAddress = candyMachine.collectionMintAddress;
      invariant(collectionAddress, "Collection mint address not found");

      // We need to find the candy machine creator PDA which is auto populated onto NFTs
      // minted with the candy machine, and add it to the list of creators for each NFT
      const candyMachineCreatorPda = findCandyMachineV2CreatorPda(
        candyMachine.address,
      );
      const nftCreators = [
        {
          address: candyMachineCreatorPda.toBase58(),
          share: 0,
        },
        ...creators,
      ];

      const allNfts = await this.nft.getAll(collectionAddress.toBase58());
      await Promise.all(
        allNfts.map(async (nft) => {
          const metaplexNft = await this.metaplex
            .nfts()
            .findByMint({ mintAddress: new PublicKey(nft.metadata.id) });

          txs.push(
            this.metaplex
              .nfts()
              .builders()
              .update({
                nftOrSft: metaplexNft,
                creators: enforceCreator(
                  nftCreators,
                  this.metaplex.identity().publicKey,
                ),
              }),
          );
        }),
      );

      const results = await sendMultipartTransaction(txs, this.metaplex);
      const tx = await this.metaplex.candyMachinesV2().update({
        candyMachine: await this.getCandyMachine(),
        creators: enforceCreator(creators, this.metaplex.identity().publicKey),
      });

      return [
        {
          signature: tx.response.signature,
        },
        ...results,
      ];
    } else {
      const tx = await this.metaplex.candyMachinesV2().update({
        candyMachine: await this.getCandyMachine(),
        creators: enforceCreator(creators, this.metaplex.identity().publicKey),
      });

      return [
        {
          signature: tx.response.signature,
        },
      ];
    }
  }

  /**
   * Update the royalty basis points of the collection
   * @param sellerFeeBasisPoints - the royalty basis points of the collection
   * @param updateAll - whether or not to retroactively update the royalty basis points of all past NFTs
   */
  async updateRoyalty(
    sellerFeeBasisPoints: number,
    updateAll: boolean = false,
  ) {
    if (updateAll) {
      const txs: TransactionBuilder[] = [];

      const candyMachine = await this.getCandyMachine();
      const collectionAddress = candyMachine.collectionMintAddress;
      invariant(collectionAddress, "Collection mint address not found");

      const allNfts = await this.nft.getAll(collectionAddress.toBase58());
      await Promise.all(
        allNfts.map(async (nft) => {
          const metaplexNft = await this.metaplex
            .nfts()
            .findByMint({ mintAddress: new PublicKey(nft.metadata.id) });

          txs.push(
            this.metaplex.nfts().builders().update({
              nftOrSft: metaplexNft,
              sellerFeeBasisPoints,
            }),
          );
        }),
      );

      const results = await sendMultipartTransaction(txs, this.metaplex);
      const tx = await this.metaplex.candyMachinesV2().update({
        candyMachine: await this.getCandyMachine(),
        sellerFeeBasisPoints,
      });

      return [
        {
          signature: tx.response.signature,
        },
        ...results,
      ];
    } else {
      const tx = await this.metaplex.candyMachinesV2().update({
        candyMachine: await this.getCandyMachine(),
        sellerFeeBasisPoints,
      });

      return {
        signature: tx.response.signature,
      };
    }
  }

  private async getCandyMachine() {
    return this.metaplex
      .candyMachinesV2()
      .findByAddress({ address: this.publicKey });
  }
}
