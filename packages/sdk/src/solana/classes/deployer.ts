import {
  NFTCollectionMetadataInput,
  NFTCollectionMetadataInputSchema,
  TokenMetadataInput,
  TokenMetadataInputSchema,
} from "../types/contracts";
import {
  NFTDropConditionsOutputSchema,
  NFTDropContractInput,
} from "../types/contracts/nft-drop";
import { enforceCreator } from "./helpers/creators-helper";
import {
  findMetadataPda,
  Metaplex,
  sol,
  toBigNumber,
  token,
} from "@metaplex-foundation/js";
import {
  createCreateMetadataAccountV2Instruction,
  DataV2,
} from "@metaplex-foundation/mpl-token-metadata";
import { Keypair } from "@solana/web3.js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

/**
 * Deploy new programs
 *
 * @example
 * ```jsx
 * import { ThirdwebSDK } from "@thirdweb-dev/solana";
 *
 * // Instantiate the SDK and pass in a signer
 * const sdk = ThirdwebSDK.fromNetwork("devnet");
 * sdk.wallet.connect(signer);
 *
 * // Define the metadata for your program
 * const metadata = {
 *   name: "NFT Contract",
 *   image: readFileSync("files/image.jpg"),
 * };
 *
 * // And deploy a new program from the connected wallet
 * const address = await sdk.deployer.createNftCollection(metadata);
 * ```
 *
 * @public
 */
export class Deployer {
  private metaplex: Metaplex;
  private storage: ThirdwebStorage;

  constructor(metaplex: Metaplex, storage: ThirdwebStorage) {
    this.metaplex = metaplex;
    this.storage = storage;
  }

  /**
   * Create a new token program
   * @param tokenMetadata - the metadata of the token program
   * @returns - the address of the new token program
   *
   * @example
   * ```jsx
   * const metadata = {
   *   name: "Token",
   *   symbol: "TKN",
   *   initialSupply: 100,
   * };
   *
   * const address = await sdk.deployer.createToken(metadata);
   * ```
   */
  async createToken(tokenMetadata: TokenMetadataInput): Promise<string> {
    const tokenMetadataParsed = TokenMetadataInputSchema.parse(tokenMetadata);
    const uri = await this.storage.upload(tokenMetadataParsed);
    const mint = Keypair.generate();
    const owner = this.metaplex.identity().publicKey;
    const mintTx = await this.metaplex
      .tokens()
      .builders()
      .createTokenWithMint({
        decimals: tokenMetadataParsed.decimals,
        initialSupply: token(
          tokenMetadataParsed.initialSupply,
          tokenMetadataParsed.decimals,
        ),
        mint,
      });

    const data: DataV2 = {
      name: tokenMetadataParsed.name,
      symbol: tokenMetadataParsed.symbol || "",
      sellerFeeBasisPoints: 0,
      uri,
      creators: enforceCreator([], this.metaplex.identity().publicKey),
      collection: null,
      uses: null,
    };
    const metadata = findMetadataPda(mint.publicKey);
    const metaTx = createCreateMetadataAccountV2Instruction(
      {
        metadata,
        mint: mint.publicKey,
        mintAuthority: owner,
        payer: owner,
        updateAuthority: owner,
      },
      { createMetadataAccountArgsV2: { data, isMutable: false } },
    );
    await mintTx
      .add({ instruction: metaTx, signers: [this.metaplex.identity()] })
      .sendAndConfirm(this.metaplex);

    return mint.publicKey.toBase58();
  }

  /**
   * Create a new NFT collection program
   * @param collectionMetadata - the metadata of the nft collection program
   * @returns - the address of the new nft collection program
   *
   * @example
   * ```jsx
   * const metadata = {
   *   name: "NFT",
   *   symbol: "NFT",
   * };
   *
   * const address = await sdk.deployer.createNftCollection(metadata);
   * ```
   */
  async createNftCollection(
    collectionMetadata: NFTCollectionMetadataInput,
  ): Promise<string> {
    const parsed = NFTCollectionMetadataInputSchema.parse(collectionMetadata);
    const uri = await this.storage.upload(parsed);

    const { nft: collectionNft } = await this.metaplex
      .nfts()
      .create({
        name: parsed.name,
        symbol: parsed.symbol,
        sellerFeeBasisPoints: 0,
        uri,
        isCollection: true,
        creators: enforceCreator(
          parsed.creators,
          this.metaplex.identity().publicKey,
        ),
      })
      .run();
    return collectionNft.mint.address.toBase58();
  }

  /**
   * Create a new NFT drop program
   * @param metadata - the metadata of the nft drop program
   * @returns - the address of the new nft drop program
   *
   * @example
   * ```jsx
   * const metadata = {
   *   name: "NFT",
   *   symbol: "NFT",
   *   price: 0,
   *   sellerFeeBasisPoints: 0,
   *   itemsAvailable: 5,
   * };
   *
   * const address = await sdk.deployer.createNftDrop(metadata);
   * ```
   */
  async createNftDrop(metadata: NFTDropContractInput): Promise<string> {
    const collectionInfo = NFTCollectionMetadataInputSchema.parse(metadata);
    const candyMachineInfo = NFTDropConditionsOutputSchema.parse(metadata);
    const uri = await this.storage.upload(collectionInfo);

    const collectionMint = Keypair.generate();
    const collectionTx = await this.metaplex
      .nfts()
      .builders()
      .create({
        useNewMint: collectionMint,
        name: collectionInfo.name,
        symbol: collectionInfo.symbol,
        sellerFeeBasisPoints: 0,
        uri,
        isCollection: true,
        creators: enforceCreator(
          collectionInfo.creators,
          this.metaplex.identity().publicKey,
        ),
      });

    const candyMachineKeypair = Keypair.generate();
    const candyMachineTx = await this.metaplex
      .candyMachines()
      .builders()
      .create({
        ...candyMachineInfo,
        price: candyMachineInfo.price || sol(0),
        sellerFeeBasisPoints: candyMachineInfo.sellerFeeBasisPoints || 0,
        itemsAvailable: candyMachineInfo.itemsAvailable || toBigNumber(0),
        candyMachine: candyMachineKeypair,
        collection: collectionMint.publicKey,
        creators: enforceCreator(
          collectionInfo.creators,
          this.metaplex.identity().publicKey,
        ),
      });

    const result = await collectionTx
      .add(candyMachineTx)
      .sendAndConfirm(this.metaplex);

    if (!result.response.signature) {
      throw new Error("Transaction failed");
    }

    return candyMachineKeypair.publicKey.toBase58();
  }
}
