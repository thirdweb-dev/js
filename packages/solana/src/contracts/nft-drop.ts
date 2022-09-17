import { ClaimConditions } from "../classes/claim-conditions";
import { NFTHelper } from "../classes/helpers/nft-helper";
import { TransactionResult } from "../types/common";
import {
  CommonNFTInput,
  NFTCollectionMetadata,
  NFTMetadata,
  NFTMetadataInput,
} from "../types/nft";
import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { IStorage } from "@thirdweb-dev/storage";
import invariant from "tiny-invariant";

export class NFTDrop {
  private metaplex: Metaplex;
  private storage: IStorage;
  private nft: NFTHelper;
  public accountType = "nft-drop" as const;
  public publicKey: PublicKey;
  public claimConditions: ClaimConditions;

  constructor(dropMintAddress: string, metaplex: Metaplex, storage: IStorage) {
    this.storage = storage;
    this.metaplex = metaplex;
    this.nft = new NFTHelper(metaplex);
    this.publicKey = new PublicKey(dropMintAddress);
    this.claimConditions = new ClaimConditions(dropMintAddress, metaplex);
  }

  async getMetadata(): Promise<NFTCollectionMetadata> {
    const info = await this.getCandyMachine();
    invariant(info.collectionMintAddress, "Collection mint address not found");
    const metadata = await this.metaplex
      .nfts()
      .findByMint({ mintAddress: info.collectionMintAddress })
      .run();
    return this.nft.toNFTMetadata(metadata);
  }

  async get(mintAddress: string): Promise<NFTMetadata> {
    return this.nft.get(mintAddress);
  }

  // TODO: Add pagination to get NFT functions
  async getAll(): Promise<NFTMetadata[]> {
    const info = await this.getCandyMachine();
    // TODO merge with getAllClaimed()
    return await Promise.all(
      info.items.map(async (item) => {
        const metadata = await this.storage.get(item.uri);
        return { uri: item.uri, ...metadata };
      }),
    );
  }

  async getAllClaimed(): Promise<NFTMetadata[]> {
    const nfts = await this.metaplex
      .candyMachines()
      .findMintedNfts({ candyMachine: this.publicKey })
      .run();

    return nfts.map((nft) => this.nft.toNFTMetadata(nft));
  }

  async balance(mintAddress: string): Promise<number> {
    const address = this.metaplex.identity().publicKey.toBase58();
    return this.balanceOf(address, mintAddress);
  }

  async balanceOf(walletAddress: string, mintAddress: string): Promise<number> {
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
      name: parsedMetadatas[i].name?.toString() || "",
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

  private async getCandyMachine() {
    return this.metaplex
      .candyMachines()
      .findByAddress({ address: this.publicKey })
      .run();
  }
}
