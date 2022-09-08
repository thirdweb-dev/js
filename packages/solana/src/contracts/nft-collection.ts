import { NFTHelper } from "../classes/helpers/nft-helper";
import { UserWallet } from "../classes/user-wallet";
import { TransactionResult } from "../types/common";
import {
  NFTCollectionMetadata,
  NFTMetadata,
  NFTMetadataInput,
} from "../types/nft";
import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { IStorage } from "@thirdweb-dev/storage";

export class NFTCollection {
  private wallet: UserWallet;
  private metaplex: Metaplex;
  private storage: IStorage;
  private nft: NFTHelper;
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
    this.nft = new NFTHelper(metaplex);
    this.collectionMintAddress = new PublicKey(collectionMintAddress);
  }

  async getMetadata(): Promise<NFTCollectionMetadata> {
    const metadata = await this.metaplex
      .nfts()
      .findByMint({ mintAddress: this.collectionMintAddress })
      .run();

    return this.nft.toNFTMetadata(metadata);
  }

  async get(mintAddress: string): Promise<NFTMetadata> {
    return this.nft.get(mintAddress);
  }

  async getAll(collectionMintAddress: string): Promise<string[]> {
    return this.nft.getAll(collectionMintAddress);
  }

  async balanceOf(walletAddress: string, mintAddress: string): Promise<bigint> {
    return this.nft.balanceOf(walletAddress, mintAddress);
  }

  async transfer(
    receiverAddress: string,
    mintAddress: string,
  ): Promise<TransactionResult> {
    return this.nft.transfer(receiverAddress, mintAddress);
  }

  async mint(metadata: NFTMetadataInput): Promise<string> {
    const uri = await this.storage.uploadMetadata(metadata);
    const { nft } = await this.metaplex
      .nfts()
      .create({
        name: metadata.name || "",
        uri,
        sellerFeeBasisPoints: 0,
        collection: this.collectionMintAddress,
        collectionAuthority: this.wallet.signer,
        // Always sets max supply to unlimited so editions can be minted
        maxSupply: null,
      })
      .run();

    return nft.address.toBase58();
  }

  async mintAdditionalSupply(mintAddress: string): Promise<TransactionResult> {
    const result = await this.metaplex
      .nfts()
      .printNewEdition({
        originalMint: new PublicKey(mintAddress),
      })
      .run();

    return {
      signature: result.response.signature,
    };
  }
}
