import { UserWallet } from "../classes/user-wallet";
import { Amount, AmountSchema, CurrencyValue } from "../types/common";
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
  private wallet: UserWallet;
  private metaplex: Metaplex;
  private storage: IStorage;
  tokenMintAddress: PublicKey;

  constructor(
    tokenMintAddress: string,
    metaplex: Metaplex,
    wallet: UserWallet,
    storage: IStorage,
  ) {
    this.wallet = wallet;
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

  async getMetadata() {
    const addr = findMetadataPda(this.tokenMintAddress);
    const account = await this.metaplex.rpc().getAccount(addr);
    return toMetadata(toMetadataAccount(account));
  }

  async totalSupply(): Promise<BigInt> {
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
    return result.response;
  }

  async transfer(receiverAddress: string, amount: Amount) {
    const info = await this.getMint();
    return await this.metaplex
      .tokens()
      .send({
        mintAddress: this.tokenMintAddress,
        amount: token(amount, info.decimals),
        toOwner: new PublicKey(receiverAddress),
      })
      .run();
  }

  async balance(): Promise<bigint> {
    return this.balanceOf(this.wallet.getSigner().publicKey.toBase58());
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
