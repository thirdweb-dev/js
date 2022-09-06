import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { IStorage } from "@thirdweb-dev/storage";
import { NFTMetadataInput } from "../../../sdk/dist/thirdweb-dev-sdk.cjs";
import { UserWallet } from "../classes/user-wallet";
import { NFTDropContractSchema, NFTDropMetadataInput } from "../types/contracts/nft-drop.js";
import { CommonNFTInput } from "../types/nft";

export class NFTDrop {
  private connection: Connection;
  private wallet: UserWallet;
  private metaplex: Metaplex;
  private storage: IStorage;
  dropMintAddress: PublicKey;

  constructor(
    dropMintAddress: string,
    metaplex: Metaplex,
    wallet: UserWallet,
    storage: IStorage,
  ) {
    this.wallet = wallet;
    this.storage = storage;
    this.metaplex = metaplex;
    this.connection = metaplex.connection;
    this.dropMintAddress = new PublicKey(dropMintAddress);
  }

  async getInfo() {
    return this.metaplex
      .candyMachines()
      .findByAddress({ address: this.dropMintAddress })
      .run()
  }

  async totalUnclaimedSupply() {
    const info = await this.getInfo();
    return info.itemsRemaining;
  }

  async totalClaimedSupply() {
    const info = await this.getInfo();
    return info.itemsMinted;
  }

  async lazyMint(metadatas: NFTMetadataInput[]) {
    const items = await Promise.all(
      metadatas.map(async (metadata) => {
        const parsedMetadata = CommonNFTInput.parse(metadata);
        const uri = await this.storage.uploadMetadata(parsedMetadata);
        return {
          name: parsedMetadata.name || "",
          uri
        }
      })
    )

    return await this.metaplex
      .candyMachines()
      .insertItems({
        candyMachine: await this.getInfo(),
        authority: this.metaplex.identity(),
        items,
      })
      .run()
  }

  async claim() {
    return await this.metaplex
      .candyMachines()
      .mint({ candyMachine: await this.getInfo() })
      .run()
  }

  async setClaimConditions(metadata: NFTDropMetadataInput) {
    const parsed = NFTDropContractSchema.parse(metadata);

    return await this.metaplex
      .candyMachines()
      .update({ 
        candyMachine: await this.getInfo(),
        ...parsed,
      })
      .run()
  }
}