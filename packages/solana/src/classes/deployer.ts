import {
  NFTCollectionMetadataInput,
  TokenMetadataInput,
  TokenMetadataInputSchema,
} from "../types/contracts";
import {
  NFTDropContractSchema,
  NFTDropMetadataInput,
} from "../types/contracts/nft-drop";
import { UserWallet } from "./user-wallet";
import { findMetadataPda, Metaplex, token } from "@metaplex-foundation/js";
import {
  createCreateMetadataAccountV2Instruction,
  DataV2,
} from "@metaplex-foundation/mpl-token-metadata";
import { Keypair, PublicKey } from "@solana/web3.js";
import { IStorage } from "@thirdweb-dev/storage";
import invariant from "tiny-invariant";

export class Deployer {
  private wallet: UserWallet;
  private metaplex: Metaplex;
  private storage: IStorage;

  constructor(metaplex: Metaplex, wallet: UserWallet, storage: IStorage) {
    this.metaplex = metaplex;
    this.wallet = wallet;
    this.storage = storage;
  }

  async createToken(tokenMetadata: TokenMetadataInput): Promise<string> {
    const tokenMetadataParsed = TokenMetadataInputSchema.parse(tokenMetadata);
    const uri = await this.storage.uploadMetadata(tokenMetadataParsed);
    const owner = this.wallet.getSigner().publicKey;
    const mint = Keypair.generate();
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
        mintAuthority: this.wallet.getSigner(),
        payer: this.wallet.getSigner(),
        owner,
      });

    const data: DataV2 = {
      name: tokenMetadataParsed.name,
      symbol: tokenMetadataParsed.symbol || "",
      sellerFeeBasisPoints: 0,
      uri,
      creators: [
        {
          address: owner,
          share: 100,
          verified: false,
        },
      ],
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
      .add({ instruction: metaTx, signers: [this.wallet.getSigner()] })
      .sendAndConfirm(this.metaplex);

    return mint.publicKey.toBase58();
  }

  async createNftCollection(
    collectionMetadata: NFTCollectionMetadataInput,
  ): Promise<string> {
    const uri = await this.storage.uploadMetadata(collectionMetadata);

    const { nft: collectionNft } = await this.metaplex
      .nfts()
      .create({
        name: collectionMetadata.name,
        symbol: collectionMetadata.symbol,
        sellerFeeBasisPoints: 0,
        uri,
        isCollection: true,
        collectionAuthority: this.wallet.getSigner(),
        updateAuthority: this.wallet.getSigner(),
        mintAuthority: this.wallet.getSigner(),
        creators: collectionMetadata.creators?.map((creator) => ({
          address: new PublicKey(creator.address),
          share: creator.share,
        })),
      })
      .run();
    return collectionNft.mint.address.toBase58();
  }

  async createNftDrop(metadata: NFTDropMetadataInput): Promise<string> {
    invariant(this.wallet.signer, "Wallet is not connected");
    const parsed = NFTDropContractSchema.parse(metadata);

    // TODO create a collection with metadata and associate it with the drop
    const { candyMachine: nftDrop } = await this.metaplex
      .candyMachines()
      .create({ ...parsed })
      .run();

    return nftDrop.address.toBase58();
  }
}
