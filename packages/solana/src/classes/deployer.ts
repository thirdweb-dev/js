import {
  NFTCollectionMetadataInput,
  TokenMetadataInput,
  TokenMetadataInputSchema,
} from "../types/contracts";
import { UserWallet } from "./user-wallet";
import {
  createTokenWithMintBuilder,
  findMetadataPda,
  Metaplex,
  token,
  TransactionBuilder,
} from "@metaplex-foundation/js";
import {
  createCreateMetadataAccountV2Instruction,
  createCreateMetadataAccountV3Instruction,
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

  async createToken(tokenMetadata: TokenMetadataInput) {
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

    await this.metaplex.rpc().sendAndConfirmTransaction(
      TransactionBuilder.make()
        .setFeePayer(this.wallet.getSigner())
        .add(mintTx)
        .add({ instruction: metaTx, signers: [this.wallet.getSigner()] })
        .toTransaction(),
    );

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
}
