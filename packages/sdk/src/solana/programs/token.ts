import { Amount, AmountSchema } from "../../core/schema/shared";
import { CurrencyValue, TokenMetadata } from "../../core/schema/token";
import { TransactionResult } from "../types/common";
import { toCurrencyValue } from "../utils/token";
import { getNework } from "../utils/urls";
import { Metaplex, toBigNumber, token } from "@metaplex-foundation/js";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

/**
 * Standard token or cryptocurrency.
 *
 * @example
 * ```jsx
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
 *
 * const sdk = ThirdwebSDK.fromNetwork("devnet");
 * sdk.wallet.connect(signer);
 *
 * // Get the interface for your token program
 * const program = await sdk.getProgram("{{program_address}}", "token");
 * ```
 *
 * @public
 */
export class Token {
  private connection: Connection;
  private metaplex: Metaplex;
  private storage: ThirdwebStorage;
  public accountType = "token" as const;
  public publicKey: PublicKey;
  public get network() {
    return getNework(this.metaplex);
  }

  constructor(
    tokenAddress: string,
    metaplex: Metaplex,
    storage: ThirdwebStorage,
  ) {
    this.storage = storage;
    this.metaplex = metaplex;
    this.connection = metaplex.connection;
    this.publicKey = new PublicKey(tokenAddress);
  }

  /**
   * Get the metadata for this token including the name, supply, and decimals.
   * @returns Token metadata
   *
   * @example
   * ```jsx
   * const metadata = await program.getMetadata();
   * console.log(metadata.supply);
   * console.log(metadata.decimals);
   * ```
   */
  async getMetadata(): Promise<TokenMetadata> {
    const mint = await this.getMint();
    const meta = await this.metaplex.nfts().findByMint({
      mintAddress: mint.address,
    });
    return {
      ...meta.json,
      id: meta.address.toBase58(),
      uri: meta.uri,
      name: meta.name,
      symbol: meta.symbol,
      decimals: mint.decimals,
      supply: toCurrencyValue(mint.supply),
    };
  }

  /**
   * Get the total minted supply of this token
   * @returns the total supply
   *
   * @example
   * ```jsx
   * const supply = await program.totalSupply();
   * ```
   */
  async totalSupply(): Promise<CurrencyValue> {
    const info = await this.getMint();
    return toCurrencyValue(info.supply);
  }

  /**
   * Mints the specified amount of new tokens to the connected wallet
   * @param amount - The amount of tokens to mint
   * @returns the transaction result of the mint
   *
   * @example
   * ```jsx
   * // Specify the amount of tokens to mint
   * const amount = 1;
   * // And then you can mint the tokens
   * const tx = await program.mint(amount);
   * ```
   */
  async mint(amount: Amount): Promise<TransactionResult> {
    return this.mintTo(this.metaplex.identity().publicKey.toBase58(), amount);
  }

  /**
   * Mints the specified amount of new tokens to a specific wallet
   * @param amount - The amount of tokens to mint
   * @returns the transaction result of the mint
   *
   * @example
   * ```jsx
   * // Specify the address to mint tokens to
   * const address = "{{wallet_address}}"";
   * // And the amount of tokens to mint
   * const amount = 1;
   * // And then you can make a mint transaction
   * const tx = await program.mintTo(address, 1);
   * ```
   */
  async mintTo(
    receiverAddress: string,
    amount: Amount,
  ): Promise<TransactionResult> {
    const amountParsed = AmountSchema.parse(amount);
    const info = await this.getMint();
    const result = await this.metaplex.tokens().mint({
      amount: token(amountParsed, info.decimals),
      mintAddress: this.publicKey,
      toOwner: new PublicKey(receiverAddress),
    });
    return {
      signature: result.response.signature,
    };
  }

  /**
   * Transfer the specified amount of tokens to another wallet
   * @param receiverAddress - The address to send the tokens to
   * @param amount - The amount of tokens to send
   * @returns the transaction result of the transfer
   *
   * @example
   * ```jsx
   * // Specify the address to transfer tokens to
   * const to = "...";
   * // And the amount of tokens to transfer
   * const amount = 1;
   * // And then you can make the transfer transaction
   * const tx = await program.transfer(to, amount);
   * ```
   */
  async transfer(
    receiverAddress: string,
    amount: Amount,
  ): Promise<TransactionResult> {
    const info = await this.getMint();
    const result = await this.metaplex.tokens().send({
      mintAddress: this.publicKey,
      amount: token(amount, info.decimals),
      toOwner: new PublicKey(receiverAddress),
    });
    return {
      signature: result.response.signature,
    };
  }

  /**
   * Get the token balance of the connected wallet
   * @returns the currency value balance
   *
   * @example
   * ```jsx
   * const balance = await program.balance();
   * console.log(balance.displayValue);
   * ```
   */
  async balance(): Promise<CurrencyValue> {
    return this.balanceOf(this.metaplex.identity().publicKey.toBase58());
  }

  /**
   * Get the token balance of the specified wallet
   * @param walletAddress - the wallet address to get the balance of
   * @returns the currency value balance
   *
   * @example
   * ```jsx
   * const address = "..."
   * const balance = await program.balanceOf(address);
   * console.log(balance.displayValue);
   * ```
   */
  async balanceOf(walletAddress: string): Promise<CurrencyValue> {
    const [mint, addr] = await Promise.all([
      this.getMint(),
      getAssociatedTokenAddress(this.publicKey, new PublicKey(walletAddress)),
    ]);
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

  private async getMint() {
    return await this.metaplex
      .tokens()
      .findMintByAddress({ address: this.publicKey });
  }
}
