import { WalletAccount } from "../types/common";
import {
  CandyMachine,
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

  public async getAccountType(address: string) {
    try {
      const metadata = await this.metaplex
        .nfts()
        .findByMint({ mintAddress: new PublicKey(address) })
        .run();
      if (metadata) {
        if (metadata.collectionDetails) {
          return "nft-collection";
        } else {
          if (metadata.tokenStandard === TokenStandard.Fungible) {
            return "token";
          }
        }
      }
    } catch (e) {
      try {
        const candyMachine = await this.metaplex
          .candyMachines()
          .findByAddress({ address: new PublicKey(address) })
          .run();
        if (candyMachine) {
          return "nft-drop";
        }
      } catch (err) {
        return undefined;
      }
    }
    return undefined;
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
          const drop = this.getDropForCollection(candyMachines, meta);
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

  private getDropForCollection(candyMachines: CandyMachine[], meta: Metadata) {
    return candyMachines.find(
      (candyMachine) =>
        candyMachine.collectionMintAddress?.toBase58() ===
        meta.mintAddress.toBase58(),
    );
  }

  public async getMetadataAddressesForWallet(walletAddress: string) {
    return await TokenMetadataProgram.metadataV1Accounts(this.metaplex)
      .selectMint()
      .whereCreator(1, new PublicKey(walletAddress))
      .getDataAsPublicKeys();
  }
}
