import { UserWallet } from "../classes/user-wallet";
import { TransactionResult } from "../types/common";
import {
  NFTDropClaimInput,
  NFTDropClaimSchema,
} from "../types/contracts/nft-drop";
import { CommonNFTInput, NFTMetadataInput } from "../types/nft";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { IStorage } from "@thirdweb-dev/storage";
import { parse } from "yaml";

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

  async totalUnclaimedSupply(): Promise<bigint> {
    const info = await this.getCandyMachine();
    return BigInt(info.itemsRemaining.toNumber());
  }

  async totalClaimedSupply(): Promise<bigint> {
    const info = await this.getCandyMachine();
    return BigInt(info.itemsMinted.toNumber());
  }

  async lazyMint(metadatas: NFTMetadataInput[]): Promise<TransactionResult> {
    const parsedMetadatas = metadatas.map((metadata) =>
      CommonNFTInput.parse(metadata),
    );
    const upload = await this.storage.uploadMetadataBatch(parsedMetadatas);
    const items = upload.uris.map((uri, i) => ({
      name: parsedMetadatas[i].name || "",
      uri,
    }));

    const result = await this.metaplex
      .candyMachines()
      .insertItems({
        candyMachine: await this.getCandyMachine(),
        authority: this.metaplex.identity(),
        items,
      })
      .run();

    return {
      signature: result.response.signature,
    };
  }

  async claim(): Promise<TransactionResult> {
    const result = await this.metaplex
      .candyMachines()
      .mint({ candyMachine: await this.getCandyMachine() })
      .run();

    return {
      signature: result.response.signature,
    };
  }

  async setClaimConditions(
    metadata: NFTDropClaimInput,
  ): Promise<TransactionResult> {
    const parsed = NFTDropClaimSchema.parse(metadata);

    const result = await this.metaplex
      .candyMachines()
      .update({
        candyMachine: await this.getCandyMachine(),
        ...parsed,
      })
      .run();

    return {
      signature: result.response.signature,
    };
  }

  private async getCandyMachine() {
    return this.metaplex
      .candyMachines()
      .findByAddress({ address: this.dropMintAddress })
      .run(); // TODO abstract return types away
  }
}
