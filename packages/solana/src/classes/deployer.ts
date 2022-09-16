import {
  NFTCollectionMetadataInput,
  NFTCollectionMetadataInputSchema,
  TokenMetadataInput,
  TokenMetadataInputSchema,
} from "../types/contracts";
import {
  NFTDropContractSchema,
  NFTDropMetadataInput,
} from "../types/contracts/nft-drop";
import { enforceCreator } from "./helpers/creators-helper";
import { findMetadataPda, Metaplex, token } from "@metaplex-foundation/js";
import {
  createCreateMetadataAccountV2Instruction,
  DataV2,
} from "@metaplex-foundation/mpl-token-metadata";
import { Keypair, PublicKey } from "@solana/web3.js";
import { IStorage } from "@thirdweb-dev/storage";

export class Deployer {
  private metaplex: Metaplex;
  private storage: IStorage;

  constructor(metaplex: Metaplex, storage: IStorage) {
    this.metaplex = metaplex;
    this.storage = storage;
  }

  async createToken(tokenMetadata: TokenMetadataInput): Promise<string> {
    const tokenMetadataParsed = TokenMetadataInputSchema.parse(tokenMetadata);
    const uri = await this.storage.uploadMetadata(tokenMetadataParsed);
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

  async createNftCollection(
    collectionMetadata: NFTCollectionMetadataInput,
  ): Promise<string> {
    const parsed = NFTCollectionMetadataInputSchema.parse(collectionMetadata);
    const uri = await this.storage.uploadMetadata(parsed);

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

  async createNftDrop(metadata: NFTDropMetadataInput): Promise<string> {
    const parsed = NFTDropContractSchema.parse(metadata);
    const uri = await this.storage.uploadMetadata(
      NFTCollectionMetadataInputSchema.parse(metadata),
    );

    const collectionMint = Keypair.generate();
    const collectionTx = await this.metaplex
      .nfts()
      .builders()
      .create({
        useNewMint: collectionMint,
        name: parsed.name,
        symbol: parsed.symbol,
        sellerFeeBasisPoints: 0,
        uri,
        isCollection: true,
        creators: enforceCreator(
          parsed.creators,
          this.metaplex.identity().publicKey,
        ),
      });

    const candyMachineKeypair = Keypair.generate();
    const candyMachineTx = await this.metaplex
      .candyMachines()
      .builders()
      .create({
        ...parsed,
        candyMachine: candyMachineKeypair,
        collection: collectionMint.publicKey,
        creators: enforceCreator(
          parsed.creators,
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
