import { CurrencyValue } from "../../core/schema/token";
import { WalletSigner } from "../types/common";
import { toCurrencyValue } from "../utils/token";
import {
  amount,
  guestIdentity,
  isIdentitySigner,
  isKeypairSigner,
  keypairIdentity,
  Metaplex,
  Signer,
  SOL,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import EventEmitter from "eventemitter3";
import invariant from "tiny-invariant";
import nacl from "tweetnacl";

/**
 *
 * {@link UserWallet} events that you can subscribe to using `sdk.wallet.events`.
 *
 * @public
 */
export interface UserWalletEvents {
  /**
   * Emitted when `sdk.wallet.connect()` is called.
   */
  connected: [WalletSigner];
  /**
   * Emitted when `sdk.wallet.disconnect()` is called.
   */
  disconnected: void;
}

/**
 * Handle and view info about the wallet connected to the SDK.
 *
 * @example
 * ```jsx
 * // Connect a wallet to the SDK, pass in a keypair or browser wallet adapter
 * sdk.wallet.connect(signer)
 *
 * // Then you can read data about the connected wallet
 * const address = sdk.wallet.getAddress();
 * ```
 *
 * @public
 */
export class UserWallet {
  public signer: Signer | undefined;
  public events = new EventEmitter<UserWalletEvents>();
  private metaplex: Metaplex;

  public get network() {
    const url = new URL(this.metaplex.connection.rpcEndpoint);
    // try this first to avoid hitting `custom` network for alchemy urls
    if (url.hostname.includes("devnet")) {
      return "devnet";
    }
    if (url.hostname.includes("mainnet")) {
      return "mainnet-beta";
    }
    return this.metaplex.cluster;
  }

  constructor(metaplex: Metaplex) {
    this.metaplex = metaplex;
  }

  /**
   * Connect a signer to the SDK. Can pass in a keypair or browser wallet adapter
   * @param wallet - The signer to connect to the SDK
   *
   * @example
   * ```jsx
   * const signer = Keypair.generate();
   * sdk.wallet.connect(signer);
   * ```
   */
  public connect(wallet: WalletSigner) {
    this.connectToMetaplex(wallet);
    this.events.emit("connected", wallet);
  }

  /**
   * Disconnect the connect wallet from the SDK
   *
   * @example
   * ```jsx
   * sdk.wallet.disconnect();
   * ```
   */
  public disconnect() {
    // TODO implement our own read only identity plugin with our own error messages
    this.metaplex.use(guestIdentity());
    this.events.emit("disconnected");
  }

  /**
   * Return whether a wallet is connected
   */
  public isConnected() {
    return this.metaplex.identity().publicKey !== PublicKey.default;
  }

  /**
   * Get the address of the connected wallet
   * @returns the address of the connected wallet
   *
   * @example
   * ```jsx
   * const address = sdk.wallet.getAddress()
   * ```
   */
  public getAddress() {
    return this.isConnected()
      ? this.metaplex.identity().publicKey.toBase58()
      : undefined;
  }

  /**
   * Get the connected signer
   * @returns the signer
   *
   * @example
   * ```jsx
   * const signer = sdk.wallet.getSigner()
   * ```
   */
  public getSigner() {
    return this.metaplex.identity();
  }

  public async sign(message: string): Promise<string> {
    const signer = this.getSigner();
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await signer.signMessage(encodedMessage);
    const signature = bs58.encode(signedMessage);

    return signature;
  }

  public verifySignature(
    message: string,
    signature: string,
    publicKey: string,
  ): boolean {
    return nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      bs58.decode(signature),
      bs58.decode(publicKey),
    );
  }

  /**
   * Get the native balance of the connected wallet
   * @returns the native balance currency value
   *
   * @example
   * ```jsx
   * const balance = await sdk.wallet.getBalance();
   * console.log(balance.displayValue);
   * ```
   */
  public async getBalance(): Promise<CurrencyValue> {
    const value = await this.metaplex.connection.getBalance(
      this.metaplex.identity().publicKey,
    );
    return toCurrencyValue(amount(value, SOL));
  }

  private connectToMetaplex(signer: WalletSigner) {
    invariant(signer, "Wallet is not connected");
    const plugin = isKeypairSigner(signer)
      ? keypairIdentity(Keypair.fromSecretKey(signer.secretKey))
      : isIdentitySigner(signer)
      ? walletAdapterIdentity(signer)
      : undefined;
    invariant(plugin, "Wallet is not compatible with Metaplex");
    this.metaplex.use(plugin);
  }
}
