import { WalletAccount } from "../types/common";
import {
  Metadata,
  Metaplex,
  TokenMetadataProgram,
} from "@metaplex-foundation/js";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";

export class Registry {
  private metaplex: Metaplex;

  constructor(metaplex: Metaplex) {
    this.metaplex = metaplex;
  }

  public async getAccountsForWallet(
    walletAddress: string,
  ): Promise<WalletAccount[]> {
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

    return metadatas
      .map((mintMetadata) => {
        const meta = mintMetadata as Metadata;
        if (!meta) {
          return undefined;
        }
        if (meta?.collectionDetails) {
          // check if it's part of a candy machine
          const drop = candyMachines.find(
            (candyMachine) =>
              candyMachine.collectionMintAddress?.toBase58() ===
              meta.mintAddress.toBase58(),
          );
          if (drop) {
            return {
              type: "nft-drop",
              address: drop.address.toBase58(),
              name: meta.name,
            };
          } else {
            return {
              type: "nft-collection",
              address: meta.mintAddress.toBase58(),
              name: meta.name,
            };
          }
        } else {
          if (meta.tokenStandard === TokenStandard.Fungible) {
            return {
              type: "token",
              address: meta.mintAddress.toBase58(),
              name: meta.name,
            };
          }
        }
      })
      .filter((account) => account !== undefined) as WalletAccount[];
  }

  public async getMetadataAddressesForWallet(walletAddress: string) {
    return await TokenMetadataProgram.metadataV1Accounts(this.metaplex)
      .selectMint()
      .whereCreator(1, new PublicKey(walletAddress))
      .getDataAsPublicKeys();
  }
}
