import { NFTCollectionMetadataInput } from "../types/contracts";
import { UserWallet } from "./user-wallet";
import { Metaplex, sol, toBigNumber } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { IStorage } from "@thirdweb-dev/storage";
import invariant from "tiny-invariant";
import { NFTDropMetadataInput } from "../types/contracts/nft-drop";

export class Deployer {
  private wallet: UserWallet;
  private metaplex: Metaplex;
  private storage: IStorage;

  constructor(metaplex: Metaplex, wallet: UserWallet, storage: IStorage) {
    this.metaplex = metaplex;
    this.wallet = wallet;
    this.storage = storage;
  }

  async createNftCollection(
    collectionMetadata: NFTCollectionMetadataInput,
  ): Promise<string> {
    invariant(this.wallet.signer, "Wallet is not connected");
    const uri = await this.storage.uploadMetadata(collectionMetadata);

    const { nft: collectionNft } = await this.metaplex
      .nfts()
      .create({
        name: collectionMetadata.name,
        symbol: collectionMetadata.symbol,
        sellerFeeBasisPoints: 0,
        uri,
        isCollection: true,
        collectionAuthority: this.wallet.signer,
        updateAuthority: this.wallet.signer,
        mintAuthority: this.wallet.signer,
        creators: collectionMetadata.creators?.map((creator) => ({
          address: new PublicKey(creator.address),
          share: creator.share,
        })),
      })
      .run();
    return collectionNft.mint.address.toBase58();
  }

  async createNftDrop(dropMetadata: NFTDropMetadataInput): Promise<string> {
    invariant(this.wallet.signer, "Wallet is not connected");

    console.log("deploying...")
    const { candyMachine: nftDrop } = await this.metaplex
      .candyMachines()
      .create({
        price: sol(1.25),
        sellerFeeBasisPoints: 500,
        itemsAvailable: toBigNumber(100),
      })
      .run()

    console.log("Deployed...")

    return nftDrop.address.toBase58();
  }
}
