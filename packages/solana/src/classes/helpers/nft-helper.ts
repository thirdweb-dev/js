import { TransactionResult } from "../../types/common";
import { NFTMetadata } from "../../types/nft";
import {
  JsonMetadata,
  Metadata,
  Metaplex,
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

  async get(mintAddress: string): Promise<NFTMetadata> {
    const meta = await this.metaplex
      .nfts()
      .findByMint({
        mintAddress: new PublicKey(mintAddress),
      })
      .run();

    return this.toNFTMetadata(meta);
  }

  async transfer(
    receiverAddress: string,
    mintAddress: string,
    quantity: number = 1,
  ): Promise<TransactionResult> {
    const result = await this.metaplex
      .nfts()
      .send({
        mintAddress: new PublicKey(mintAddress),
        toOwner: new PublicKey(receiverAddress),
        amount: token(quantity, 0),
      })
      .run();

    return {
      signature: result.response.signature,
    };
  }

  async balanceOf(walletAddress: string, mintAddress: string): Promise<number> {
    const address = await getAssociatedTokenAddress(
      new PublicKey(mintAddress),
      new PublicKey(walletAddress),
    );

    try {
      const account = await getAccount(this.connection, address);
      return Number(account.amount);
    } catch (e) {
      return 0;
    }
  }

  toNFTMetadata(
    meta:
      | Nft
      | Sft
      | NftWithToken
      | SftWithToken
      | Metadata<JsonMetadata<string>>,
  ) {
    return {
      id: meta.address.toBase58(),
      uri: meta.uri,
      name: meta.name,
      symbol: meta.symbol,
      ...meta.json,
    } as NFTMetadata;
  }
}
