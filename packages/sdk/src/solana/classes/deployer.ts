import {
  NFTCollectionMetadataInput,
  NFTCollectionMetadataInputSchema,
  TokenMetadataInput,
  TokenMetadataInputSchema,
} from "../types/programs";
import {
  NFTDropContractInput,
  NFTDropInitialConditionsInputSchema,
} from "../types/programs/nft-drop";
import { enforceCreator } from "./helpers/creators-helper";
import { Registry } from "./registry";
import {
  findMetadataPda,
  getSignerHistogram,
  Metaplex,
  sol,
  toBigNumber,
  token,
  TransactionBuilder,
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
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
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
  private regsitry: Registry;

  constructor(
    registry: Registry,
    metaplex: Metaplex,
    storage: ThirdwebStorage,
  ) {
    this.metaplex = metaplex;
    this.storage = storage;
    this.regsitry = registry;
  }

  /**
   * Create a new token program
   * @param tokenMetadata - the metadata of the token program
   * @returns - the address of the new token program
   *
   * @example
   * ```jsx
   * const metadata = {
   *   name: "My Token",
   *   symbol: "TKN",
   *   initialSupply: 100,
   * };
   *
   * const address = await sdk.deployer.createToken(metadata);
   * ```
   */
  async createToken(tokenMetadata: TokenMetadataInput): Promise<string> {
    const tokenMetadataParsed = await TokenMetadataInputSchema.parseAsync(
      tokenMetadata,
    );
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

    const name = tokenMetadataParsed.name;
    const data: DataV2 = {
      name,
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

    const registryInstructions =
      await this.regsitry.getAddToRegistryInstructions(
        mint.publicKey,
        name,
        "token",
      );

    await mintTx
      .add({ instruction: metaTx, signers: [this.metaplex.identity()] })
      .append(...registryInstructions)
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
   *   name: "My NFT Collection",
   *   symbol: "NFT",
   * };
   *
   * const address = await sdk.deployer.createNftCollection(metadata);
   * ```
   */
  async createNftCollection(
    collectionMetadata: NFTCollectionMetadataInput,
  ): Promise<string> {
    const parsed = await NFTCollectionMetadataInputSchema.parseAsync(
      collectionMetadata,
    );
    const uri = await this.storage.upload(parsed);

    const collectionMint = Keypair.generate();
    const name = parsed.name;
    const collectionTx = await this.metaplex
      .nfts()
      .builders()
      .create({
        useNewMint: collectionMint,
        name,
        symbol: parsed.symbol,
        sellerFeeBasisPoints: 0,
        uri,
        isCollection: true,
        creators: enforceCreator(
          parsed.creators,
          this.metaplex.identity().publicKey,
        ),
      });

    const registryInstructions =
      await this.regsitry.getAddToRegistryInstructions(
        collectionMint.publicKey,
        name,
        "nft-collection",
      );
    const result = await collectionTx
      .append(...registryInstructions)
      .sendAndConfirm(this.metaplex);

    if (!result.response.signature) {
      throw new Error("Transaction failed");
    }

    return collectionMint.publicKey.toBase58();
  }

  /**
   * Create a new NFT drop program
   * @param metadata - the metadata of the nft drop program
   * @returns - the address of the new nft drop program
   *
   * @example
   * ```jsx
   * const metadata = {
   *   name: "My NFT Drop",
   *   symbol: "NFT",
   *   totalSupply: 5,
   * };
   *
   * const address = await sdk.deployer.createNftDrop(metadata);
   * ```
   */
  async createNftDrop(metadata: NFTDropContractInput): Promise<string> {
    const collectionInfo = await NFTCollectionMetadataInputSchema.parseAsync(
      metadata,
    );
    const candyMachineInfo =
      await NFTDropInitialConditionsInputSchema.parseAsync(metadata);
    const uri = await this.storage.upload(collectionInfo);

    const collectionMint = Keypair.generate();
    const name = collectionInfo.name;
    const collectionTx = await this.metaplex
      .nfts()
      .builders()
      .create({
        useNewMint: collectionMint,
        name,
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
    // initialize candy machine with default config
    // final claim conditions can be updated later
    const candyMachineTx = await this.metaplex
      .candyMachinesV2()
      .builders()
      .create({
        itemsAvailable: toBigNumber(candyMachineInfo.totalSupply),
        price: sol(0),
        sellerFeeBasisPoints: 0,
        endSettings: {
          endSettingType: 1,
          number: toBigNumber(0),
        },
        candyMachine: candyMachineKeypair,
        collection: collectionMint.publicKey,
        creators: enforceCreator(
          collectionInfo.creators,
          this.metaplex.identity().publicKey,
        ),
      });

    const registryInstructions =
      await this.regsitry.getAddToRegistryInstructions(
        candyMachineKeypair.publicKey,
        name,
        "nft-drop",
      );

    // Have to split transactions here because it goes over the single transaction size limit
    // We use `signAllTransactions` to sign all the transactions at once so the user only has to sign once
    const block = await this.metaplex.connection.getLatestBlockhash();
    const dropTx = collectionTx
      .add(candyMachineTx)
      .setFeePayer(this.metaplex.identity());
    const regTransaction = TransactionBuilder.make()
      .add(...registryInstructions)
      .setFeePayer(this.metaplex.identity())
      .toTransaction({
        blockhash: block.blockhash,
        lastValidBlockHeight: block.lastValidBlockHeight,
      });
    const dropSigners = [this.metaplex.identity(), ...dropTx.getSigners()];
    const { keypairs } = getSignerHistogram(dropSigners);
    const dropTransaction = dropTx.toTransaction({
      blockhash: block.blockhash,
      lastValidBlockHeight: block.lastValidBlockHeight,
    });
    // partially sign with the PDA keypairs
    if (keypairs.length > 0) {
      dropTransaction.partialSign(...keypairs);
    }
    // make the connected wallet sign both candyMachine + registry transactions
    const signedTx = await this.metaplex
      .identity()
      .signAllTransactions([dropTransaction, regTransaction]);

    // send the signed transactions *sequentially* the drop creation needs to succeed first before adding to registry
    const signatures: string[] = [];
    for (const tx of signedTx) {
      signatures.push(
        await this.metaplex.connection.sendRawTransaction(tx.serialize()),
      );
    }

    // wait for confirmations in parallel
    const confirmations = await Promise.all(
      signatures.map((sig) => {
        return this.metaplex.rpc().confirmTransaction(sig, {
          blockhash: block.blockhash,
          lastValidBlockHeight: block.lastValidBlockHeight,
        });
      }),
    );

    if (confirmations.length === 0) {
      throw new Error("Transaction failed");
    }

    return candyMachineKeypair.publicKey.toBase58();
  }
}
