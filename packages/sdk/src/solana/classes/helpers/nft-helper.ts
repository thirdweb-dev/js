import { NFT } from "../../../core/schema/nft";
import { TransactionResult } from "../../types/common";
import {
  JsonMetadata,
  Metadata,
  Metaplex,
  Mint,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
  token,
} from "@metaplex-foundation/js";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

/**
 * @internal
 */
export class NFTHelper {
  private metaplex: Metaplex;
  private connection: Connection;

  constructor(metaplex: Metaplex) {
    this.metaplex = metaplex;
    this.connection = metaplex.connection;
  }

  async get(nftAddress: string): Promise<NFT> {
    const meta = await this.metaplex
      .nfts()
      .findByMint({
        mintAddress: new PublicKey(nftAddress),
      })
      .run();
    return await this.toNFTMetadata(meta);
  }

  async transfer(
    receiverAddress: string,
    nftAddress: string,
    quantity: number = 1,
  ): Promise<TransactionResult> {
    const result = await this.metaplex
      .nfts()
      .send({
        mintAddress: new PublicKey(nftAddress),
        toOwner: new PublicKey(receiverAddress),
        amount: token(quantity, 0),
      })
      .run();

    return {
      signature: result.response.signature,
    };
  }

  async balanceOf(walletAddress: string, nftAddress: string): Promise<number> {
    const address = await getAssociatedTokenAddress(
      new PublicKey(nftAddress),
      new PublicKey(walletAddress),
    );

    try {
      const account = await getAccount(this.connection, address);
      return Number(account.amount);
    } catch (e) {
      return 0;
    }
  }

  async toNFTMetadata(
    meta:
      | Nft
      | Sft
      | NftWithToken
      | SftWithToken
      | Metadata<JsonMetadata<string>>,
  ): Promise<NFT> {
    let mint = "mint" in meta ? meta.mint : undefined;
    if (meta.model === "metadata") {
      const fetchedMint = await this.metaplex
        .nfts()
        .findByMint({ mintAddress: meta.mintAddress })
        .run();
      mint = fetchedMint.mint;
    }
    if (!mint) {
      throw new Error("No mint found for NFT");
    }
    return this.toNFTMetadataResolved(mint, meta);
  }

  private toNFTMetadataResolved(
    mint: Mint,
    metadata:
      | Nft
      | Sft
      | NftWithToken
      | SftWithToken
      | Metadata<JsonMetadata<string>>,
  ): NFT {
    return {
      metadata: {
        id: mint.address.toBase58(),
        uri: metadata.uri,
        name: metadata.name,
        symbol: metadata.symbol,
        ...metadata.json,
      },
      owner: metadata.updateAuthorityAddress.toBase58(),
      supply: mint.supply.basisPoints.toNumber(),
      type: "metaplex",
    };
  }
}
