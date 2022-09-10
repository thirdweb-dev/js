import { NFTHelper } from "../classes/helpers/nft-helper";
import { UserWallet } from "../classes/user-wallet";
import { TransactionResult } from "../types/common";
import {
  NFTDropClaimInput,
  NFTDropClaimSchema,
  NFTDropOutput,
} from "../types/contracts/nft-drop";
import { CommonNFTInput, NFTMetadata, NFTMetadataInput } from "../types/nft";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { IStorage } from "@thirdweb-dev/storage";
import { parse } from "yaml";

export class NFTDrop {
  private connection: Connection;
  private wallet: UserWallet;
  private metaplex: Metaplex;
  private storage: IStorage;
  private nft: NFTHelper;
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
    this.nft = new NFTHelper(metaplex);
    this.dropMintAddress = new PublicKey(dropMintAddress);
  }

  async get(mintAddress: string): Promise<NFTMetadata> {
    return this.nft.get(mintAddress);
  }

  async balance(mintAddress: string): Promise<bigint> {
    const address = this.metaplex.identity().publicKey.toBase58();
    return this.balanceOf(address, mintAddress);
  }

  async balanceOf(walletAddress: string, mintAddress: string): Promise<bigint> {
    return this.nft.balanceOf(walletAddress, mintAddress);
  }

  async totalUnclaimedSupply(): Promise<bigint> {
    const info = await this.getCandyMachine();
    return BigInt(
      Math.min(info.itemsLoaded.toNumber(), info.itemsRemaining.toNumber()),
    );
  }

  async totalClaimedSupply(): Promise<bigint> {
    const info = await this.getCandyMachine();
    return BigInt(info.itemsMinted.toNumber());
  }

  async transfer(
    receiverAddress: string,
    mintAddress: string,
  ): Promise<TransactionResult> {
    return this.nft.transfer(receiverAddress, mintAddress);
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

  async claim(): Promise<string> {
    const result = await this.metaplex
      .candyMachines()
      .mint({ candyMachine: await this.getCandyMachine() })
      .run();

    return result.nft.address.toBase58();
  }

  async getClaimConditions(): Promise<NFTDropOutput> {
    const candyMachine = await this.getCandyMachine();

    return {
      price: BigInt(candyMachine.price.basisPoints.toNumber()),
      sellerFeeBasisPoints: BigInt(candyMachine.sellerFeeBasisPoints),
      itemsAvailable: BigInt(candyMachine.itemsAvailable.toNumber()),
      goLiveDate: candyMachine.goLiveDate
        ? new Date(candyMachine.goLiveDate.toNumber() * 1000)
        : undefined,
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
