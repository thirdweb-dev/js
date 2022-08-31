import { UserWallet } from "../classes/user-wallet";
import { METAPLEX_PROGRAM_ID } from "../constants/addresses";
import { NFTMetadataInput } from "../types/nft";
import { Metaplex } from "@metaplex-foundation/js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { ConfirmedSignatureInfo, Connection, PublicKey } from "@solana/web3.js";
import { IStorage } from "@thirdweb-dev/storage";

export class NFTCollection {
  private connection: Connection;
  private wallet: UserWallet;
  private metaplex: Metaplex;
  private storage: IStorage;
  collectionMintAddress: PublicKey;

  constructor(
    collectionMintAddress: string,
    metaplex: Metaplex,
    wallet: UserWallet,
    storage: IStorage,
  ) {
    this.wallet = wallet;
    this.storage = storage;
    this.metaplex = metaplex;
    this.connection = metaplex.connection;
    this.collectionMintAddress = new PublicKey(collectionMintAddress);
  }

  async getCollectionInfo() {
    return await this.metaplex
      .nfts()
      .findByMint({ mintAddress: this.collectionMintAddress })
      .run(); // TODO abstract types away
  }

  async mint(metadata: NFTMetadataInput) {
    const uri = await this.storage.uploadMetadata(metadata);
    const { nft: mintedNFT } = await this.metaplex
      .nfts()
      .create({
        name: metadata.name || "",
        uri,
        sellerFeeBasisPoints: 0,
        collection: this.collectionMintAddress,
        collectionAuthority: this.wallet.signer,
      })
      .run();
    return mintedNFT;
  }

  async get(mintAddress: string) {
    return await this.metaplex
      .nfts()
      .findByMint({
        mintAddress: new PublicKey(mintAddress),
      })
      .run(); // TODO abstract types away
  }

  async getAll(): Promise<string[]> {
    const allSignatures: ConfirmedSignatureInfo[] = [];
    // This returns the first 1000, so we need to loop through until we run out of signatures to get.
    let signatures = await this.connection.getSignaturesForAddress(
      this.collectionMintAddress,
    );
    allSignatures.push(...signatures);
    do {
      const options = {
        before: signatures[signatures.length - 1]?.signature,
      };
      signatures = await this.connection.getSignaturesForAddress(
        this.collectionMintAddress,
        options,
      );
      allSignatures.push(...signatures);
    } while (signatures.length > 0);

    const metadataAddresses: PublicKey[] = [];
    const mintAddresses = new Set<string>();

    // TODO RPC's will throttle this, need to do some optimizations here
    const batchSize = 1000; // alchemy RPC batch limit
    console.log(`Found ${allSignatures.length} sigs`);
    for (let i = 0; i < allSignatures.length; i += batchSize) {
      console.log(`Getting ${i} to ${i + batchSize}`);
      const batch = allSignatures.slice(
        i,
        Math.min(allSignatures.length, i + batchSize),
      );
      const transactions = await this.connection.getTransactions(
        batch.map((s) => s.signature),
      );
      for (const tx of transactions) {
        if (tx) {
          const programIds = tx.transaction.message
            .programIds()
            .map((p) => p.toString());
          const accountKeys = tx.transaction.message.accountKeys.map((p) =>
            p.toString(),
          );
          // Only look in transactions that call the Metaplex token metadata program
          if (programIds.includes(METAPLEX_PROGRAM_ID)) {
            // Go through all instructions in a given transaction
            for (const ix of tx.transaction.message.instructions) {
              // Filter for setAndVerify or verify instructions in the Metaplex token metadata program
              if (
                (ix.data === "K" || ix.data === "S" || ix.data === "X") &&
                accountKeys[ix.programIdIndex] === METAPLEX_PROGRAM_ID
              ) {
                const metadataAddressIndex = ix.accounts[0];
                const metadata_address =
                  tx.transaction.message.accountKeys[metadataAddressIndex];
                metadataAddresses.push(metadata_address);
              }
            }
          }
        }
      }
    }
    console.log(`Found ${metadataAddresses.length} metadata addresses`);

    const metadataAccounts = await Promise.all(
      metadataAddresses.map((a) => {
        try {
          return this.connection.getAccountInfo(a);
        } catch (e) {
          console.log(e);
          return undefined;
        }
      }),
    );
    for (const account of metadataAccounts) {
      if (account) {
        const [metadata] = Metadata.deserialize(account.data);
        mintAddresses.add(metadata.mint.toBase58());
      }
    }
    return Array.from(mintAddresses);
  }
}
