import {
  Metadata,
  Metaplex,
  TokenMetadataProgram,
} from "@metaplex-foundation/js";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";

export type WalletAccount = {
  type: "nft-collection" | "nft-drop" | "token";
  address: string;
  name: string;
};

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

  public async getAccountsForWallet(walletAddress: string) {
    const pubKeys = await this.getMetadataAddressesForWallet(walletAddress);
    const metadatas = await this.metaplex
      .nfts()
      .findAllByMintList({ mints: pubKeys })
      .run();

    const candyMachines = await this.metaplex
      .candyMachines()
      .findAllBy({
        type: "wallet",
        publicKey: new PublicKey(walletAddress),
      })
      .run();

    return metadatas.reduce(
      (accounts, mintMetadata) => {
        const meta = mintMetadata as Metadata;
        if (!meta) {
          return accounts;
        }
        if (meta?.collectionDetails) {
          // check if it's part of a candy machine
          const drop = candyMachines.find(
            (candyMachine) =>
              candyMachine.collectionMintAddress?.toBase58() ===
              meta.mintAddress.toBase58(),
          );
          if (drop) {
            accounts.drops.push(drop.address.toBase58());
          } else {
            accounts.nftCollections.push(meta.mintAddress.toBase58());
          }
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

  public async getMetadataAddressesForWallet(walletAddress: string) {
    const mints = await TokenMetadataProgram.metadataV1Accounts(this.metaplex)
      .selectMint()
      .whereCreator(1, new PublicKey(walletAddress))
      .getDataAsPublicKeys();

    return mints;
  }
}
