import {
  Amount,
  AmountSchema,
  CurrencyValue,
  TransactionResult,
} from "../types/common";
import { TokenMetadata } from "../types/nft";
import { toCurrencyValue } from "../utils/token";
import {
  findMetadataPda,
  Metaplex,
  toBigNumber,
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
  public publicKey: PublicKey;

  constructor(tokenMintAddress: string, metaplex: Metaplex, storage: IStorage) {
    this.storage = storage;
    this.metaplex = metaplex;
    this.connection = metaplex.connection;
    this.publicKey = new PublicKey(tokenMintAddress);
  }

  async getMint() {
    return await this.metaplex
      .tokens()
      .findMintByAddress({ address: this.publicKey })
      .run(); // TODO abstract types away
  }

  async getMetadata(): Promise<TokenMetadata> {
    const mint = await this.getMint();
    const addr = findMetadataPda(this.publicKey);
    const account = await this.metaplex.rpc().getAccount(addr);
    const meta = toMetadata(toMetadataAccount(account));
    return {
      id: meta.address.toBase58(),
      uri: meta.uri,
      name: meta.name,
      symbol: meta.symbol,
      decimals: mint.decimals,
      supply: toCurrencyValue(mint.supply),
      ...meta.json,
    } as TokenMetadata;
  }

  async totalSupply(): Promise<CurrencyValue> {
    const info = await this.getMint();
    return toCurrencyValue(info.supply);
  }

  async mint(amount: Amount) {
    const amountParsed = AmountSchema.parse(amount);
    const info = await this.getMint();
    const result = await this.metaplex
      .tokens()
      .mint({
        amount: token(amountParsed, info.decimals),
        mintAddress: this.publicKey,
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
        mintAddress: this.publicKey,
        amount: token(amount, info.decimals),
        toOwner: new PublicKey(receiverAddress),
      })
      .run();
    return {
      signature: result.response.signature,
    };
  }

  async balance(): Promise<CurrencyValue> {
    return this.balanceOf(this.metaplex.identity().publicKey.toBase58());
  }

  async balanceOf(walletAddress: string): Promise<CurrencyValue> {
    const mint = await this.getMint();
    const addr = await getAssociatedTokenAddress(
      this.publicKey,
      new PublicKey(walletAddress),
    );
    try {
      const account = await getAccount(this.connection, addr);
      return toCurrencyValue({
        basisPoints: toBigNumber(account.amount.toString()),
        currency: {
          symbol: "",
          decimals: mint.decimals,
          namespace: "spl-token",
        },
      });
    } catch (e) {
      throw Error(`No balance found for address '${walletAddress}' - ${e}`);
    }
  }
}
