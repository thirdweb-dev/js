import {
  Metadata,
  Metaplex,
  TokenMetadataProgram,
} from "@metaplex-foundation/js";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";

type RelevantWalletAccounts = {
  tokens: string[];
  nftCollections: string[];
  drops: string[];
};

export class Registry {
  private metaplex: Metaplex;

  constructor(metaplex: Metaplex) {
    this.metaplex = metaplex;
  }

  public async getAllMetadataAccontsForWallet(walletAddress: string) {
    const pubKeys = await this.getAllMetadataAddressesForWallet(walletAddress);
    const metadatas = await this.metaplex
      .nfts()
      .findAllByMintList({ mints: pubKeys })
      .run();

    return metadatas.reduce(
      (accounts, mintMetadata) => {
        const meta = mintMetadata as Metadata;
        if (!meta) {
          return accounts;
        }
        if (meta?.collectionDetails) {
          accounts.nftCollections.push(meta.mintAddress.toBase58());
        } else {
          if (meta.tokenStandard === TokenStandard.Fungible) {
            accounts.tokens.push(meta.mintAddress.toBase58());
          }
        }
        return accounts;
      },
      {
        tokens: [],
        nftCollections: [],
        drops: [],
      } as RelevantWalletAccounts,
    );
  }

  public async getAllMetadataAddressesForWallet(walletAddress: string) {
    // const accounts = await this.metaplex
    //   .nfts()
    //   .findAllByOwner({ owner: new PublicKey(walletAddress) })
    //   .run();

    // console.log("owned", accounts.length);

    // const created = await this.metaplex
    //   .nfts()
    //   .findAllByCreator({ creator: new PublicKey(walletAddress) })
    //   .run();

    // console.log("created", created.length);

    //accounts.reduce((acc, curr) => {}, []);
    const mints = await TokenMetadataProgram.metadataV1Accounts(this.metaplex)
      .selectMint()
      .whereCreator(1, new PublicKey(walletAddress))
      .getDataAsPublicKeys();

    return mints;
  }
}
