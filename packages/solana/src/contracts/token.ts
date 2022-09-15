import { Amount, AmountSchema, TransactionResult } from "../types/common";
import { TokenMetadata } from "../types/nft";
import {
  findMetadataPda,
  Metaplex,
  token,
  toMetadata,
  toMetadataAccount,
} from "@metaplex-foundation/js";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { IStorage } from "@thirdweb-dev/storage";

export class Token {
  private connection: Connection;
  private metaplex: Metaplex;
  private storage: IStorage;
  tokenMintAddress: PublicKey;

  constructor(tokenMintAddress: string, metaplex: Metaplex, storage: IStorage) {
    this.storage = storage;
    this.metaplex = metaplex;
    this.connection = metaplex.connection;
    this.tokenMintAddress = new PublicKey(tokenMintAddress);
  }

  async getMint() {
    return await this.metaplex
      .tokens()
      .findMintByAddress({ address: this.tokenMintAddress })
      .run(); // TODO abstract types away
  }

  async getMetadata(): Promise<TokenMetadata> {
    const addr = findMetadataPda(this.tokenMintAddress);
    const account = await this.metaplex.rpc().getAccount(addr);
    const meta = toMetadata(toMetadataAccount(account));
    return {
      id: meta.address.toBase58(),
      uri: meta.uri,
      name: meta.name,
      symbol: meta.symbol,
      ...meta.json,
    } as TokenMetadata;
  }

  async totalSupply(): Promise<bigint> {
    const info = await this.getMint();
    const value = BigInt(info.supply.basisPoints.toString());
    // TODO use CurrencyValue to provide a human readable display value
    return value;
  }

  async mint(amount: Amount) {
    const amountParsed = AmountSchema.parse(amount);
    const info = await this.getMint();
    const result = await this.metaplex
      .tokens()
      .mint({
        amount: token(amountParsed, info.decimals),
        mintAddress: this.tokenMintAddress,
      })
      .run();
    return {
      signature: result.response.signature,
    };
  }

  async transfer(
    receiverAddress: string,
    amount: Amount,
  ): Promise<TransactionResult> {
    const info = await this.getMint();
    const result = await this.metaplex
      .tokens()
      .send({
        mintAddress: this.tokenMintAddress,
        amount: token(amount, info.decimals),
        toOwner: new PublicKey(receiverAddress),
      })
      .run();
    return {
      signature: result.response.signature,
    };
  }

  async balance(): Promise<bigint> {
    return this.balanceOf(this.metaplex.identity().publicKey.toBase58());
  }

  async balanceOf(walletAddress: string): Promise<bigint> {
    const addr = await getAssociatedTokenAddress(
      this.tokenMintAddress,
      new PublicKey(walletAddress),
    );
    try {
      const account = await getAccount(this.connection, addr);
      return account.amount;
    } catch (e) {
      return 0n;
    }
  }
}
