import { QueryAllParams } from "../../core/schema/QueryParams";
import { NFT, NFTMetadata, NFTMetadataOrUri } from "../../core/schema/nft";
import { Amount } from "../../core/schema/shared";
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
  findMasterEditionV2Pda,
  Metaplex,
  toBigNumber,
  toNftOriginalEdition,
  toOriginalEditionAccount,
  TransactionBuilder,
} from "@metaplex-foundation/js";
import {
  PublicKey,
  SignaturesForAddressOptions,
  TransactionResponse,
} from "@solana/web3.js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import invariant from "tiny-invariant";

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
   * console.log(metadata);
   * ```
   */
  async getMetadata(): Promise<NFTMetadata> {
    const metadata = await this.getCollection();
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
    const metadata = await this.getCollection();
    return parseCreators(metadata.creators);
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
    const metadata = await this.getCollection();
    return metadata.sellerFeeBasisPoints;
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
   * Get the all transactions for this program
   * @beta
   */
  async getTransactions(
    options?: SignaturesForAddressOptions,
  ): Promise<TransactionResponse[]> {
    return this.nft.getTransactions(this.publicKey.toBase58(), options);
  }

  /**
   * Get the total number of nfts minted on this program
   * @returns the total number of NFTs minted on this program
   *
   * ```jsx
   * const totalSupply = await program.totalSupply();
   * ```
   */
  async totalSupply(): Promise<number> {
    return this.nft.totalSupply(this.publicKey.toBase58());
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
  async supplyOf(nftAddress: string): Promise<string> {
    return this.nft.supplyOf(nftAddress);
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
    const collection = await this.getCollection();
    const { nft } = await this.metaplex.nfts().create({
      name,
      uri,
      creators: collection.creators,
      sellerFeeBasisPoints: collection.sellerFeeBasisPoints,
      collection: this.publicKey,
      collectionAuthority: this.metaplex.identity(),
      tokenOwner: new PublicKey(to),
      // Always sets max supply to unlimited so editions can be minted
      maxSupply: null,
    });

    return nft.address.toBase58();
  }

  /**
   * Mint additional supply of an NFT to the connected wallet
   * @param nftAddress - the mint address to mint additional supply to
   * @param amount - the amount of additional NFTs to mint
   * @returns the mint address of the minted NFT
   *
   * @example
   * ```jsx
   * // The address of the already minted NFT
   * const nftAddress = "..."
   * // The amount of additional NFTs to mint
   * const amount = 1;
   * // Mint an additional NFT of the original NFT
   * const addresses = await program.mintAdditionalSupply(nftAddress, amount);
   * ```
   */
  async mintAdditionalSupply(nftAddress: string, amount: Amount) {
    const address = this.metaplex.identity().publicKey.toBase58();
    return this.mintAdditionalSupplyTo(address, nftAddress, amount);
  }

  /**
   * Mint additional supply of an NFT to the specified wallet
   * @param to - the address to mint the NFT to
   * @param nftAddress - the mint address to mint additional supply to
   * @param amount - the amount of NFTs to mint
   * @returns the mint address of the minted NFT
   *
   * @example
   * ```jsx
   * // Specify who to mint the additional NFT to
   * const to = "..."
   * // The address of the already minted NFT
   * const nftAddress = "..."
   * * // The amount of additional NFTs to mint
   * const amount = 1;
   * // Mint an additional NFT of the original NFT
   * const addresses = await program.mintAdditionalSupplyTo(to, nftAddress, amount);
   * ```
   */
  async mintAdditionalSupplyTo(
    to: string,
    nftAddress: string,
    amount: Amount,
  ): Promise<string[]> {
    // need to coerce amount to number always (to make the Array(<number>) work)
    amount = typeof amount === "string" ? parseInt(amount) : amount;
    // ensure that whatever got passed actually is a number now
    invariant(
      isNaN(amount) === false,
      "amount must be possible to convert to a number",
    );

    // Better to use metaplex functions directly then our supplyOf function for types/consistency
    const originalEditionAccount = await this.metaplex
      .rpc()
      .getAccount(findMasterEditionV2Pda(new PublicKey(nftAddress)));
    const originalEdition = toNftOriginalEdition(
      toOriginalEditionAccount(originalEditionAccount),
    );

    const builders = await Promise.all(
      [...Array(amount).keys()].map(async (_, i) => {
        return await this.metaplex
          .nfts()
          .builders()
          .printNewEdition({
            originalSupply: toBigNumber(
              originalEdition.supply.add(toBigNumber(i)),
            ),
            originalMint: new PublicKey(nftAddress),
            newOwner: new PublicKey(to),
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
    const txs: TransactionBuilder[] = [];

    for (const nftAddress of nftAddresses) {
      txs.push(
        this.metaplex
          .nfts()
          .builders()
          .delete({
            mintAddress: new PublicKey(nftAddress),
            collection: this.publicKey,
          }),
      );
    }

    return await sendMultipartTransaction(txs, this.metaplex);
  }

  /**
   * SETTINGS
   */

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

      txs.push(
        this.metaplex
          .nfts()
          .builders()
          .update({
            nftOrSft: await this.getCollection(),
            creators: enforceCreator(
              creators,
              this.metaplex.identity().publicKey,
            ),
          }),
      );

      // TODO: Don't use a get all here, all we need is mint addresses :(
      const allNfts = await this.nft.getAll(this.publicKey.toBase58());
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
                  creators,
                  this.metaplex.identity().publicKey,
                ),
              }),
          );
        }),
      );

      return await sendMultipartTransaction(txs, this.metaplex);
    } else {
      const tx = await this.metaplex.nfts().update({
        nftOrSft: await this.getCollection(),
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

      txs.push(
        this.metaplex
          .nfts()
          .builders()
          .update({
            nftOrSft: await this.getCollection(),
            sellerFeeBasisPoints,
          }),
      );

      // TODO: Don't use a get all here, all we need is mint addresses :(
      const allNfts = await this.nft.getAll(this.publicKey.toBase58());
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

      return await sendMultipartTransaction(txs, this.metaplex);
    } else {
      const tx = await this.metaplex.nfts().update({
        nftOrSft: await this.getCollection(),
        sellerFeeBasisPoints,
      });

      return [
        {
          signature: tx.response.signature,
        },
      ];
    }
  }

  private async getCollection() {
    return await this.metaplex
      .nfts()
      .findByMint({ mintAddress: this.publicKey });
  }
}
