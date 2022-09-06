import { isDateTime, Metaplex, toBigNumber, toDateTime } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { BigNumberSchema } from "@thirdweb-dev/sdk/dist/declarations/src/schema/shared.js";
import { IStorage } from "@thirdweb-dev/storage";
import { NFTMetadataInput } from "../../../sdk/dist/thirdweb-dev-sdk.cjs";
import { UserWallet } from "../classes/user-wallet";
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

  get info() {
    return this.metaplex
      .candyMachines()
      .findByAddress({ address: this.dropMintAddress })
      .run()
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
        candyMachine: await this.info,
        authority: this.metaplex.identity(),
        items,
      })
      .run()
  }

  async claim() {
    return await this.metaplex
      .candyMachines()
      .mint({ candyMachine: await this.info })
      .run()
  }

  // End settings
  // Whitelist
  // Price / token amount
  // Delayed reveal
  // Start time
  async setClaimConditions() {
    return await this.metaplex
      .candyMachines()
      .update({ 
        candyMachine: await this.info,
        goLiveDate: toDateTime(Date.now() / 1000),
      })
      .run()
  }
}