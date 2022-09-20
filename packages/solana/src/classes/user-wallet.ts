import { CurrencyValue, WalletSigner } from "../types/common";
import { toCurrencyValue } from "../utils/token";
import {
  guestIdentity,
  isIdentitySigner,
  isKeypairSigner,
  keypairIdentity,
  Metaplex,
  Signer,
  sol,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { Keypair } from "@solana/web3.js";
import EventEmitter from "eventemitter3";
import invariant from "tiny-invariant";

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
 *
 *
 * @public
 */
export class UserWallet {
  public signer: Signer | undefined;
  public events = new EventEmitter<UserWalletEvents>();
  private metaplex: Metaplex;

  constructor(metaplex: Metaplex) {
    this.metaplex = metaplex;
  }

  public connect(wallet: WalletSigner) {
    this.connectToMetaplex(wallet);
    this.events.emit("connected", wallet);
  }

  public disconnect() {
    // TODO implement our own read only identity plugin with our own error messages
    this.metaplex.use(guestIdentity());
    this.events.emit("disconnected");
  }

  public getAddress() {
    return this.metaplex.identity().publicKey.toBase58();
  }

  public getSigner() {
    return this.metaplex.identity();
  }

  public async getBalance(): Promise<CurrencyValue> {
    const value = await this.metaplex.connection.getBalance(
      this.metaplex.identity().publicKey,
    );
    return toCurrencyValue(sol(value));
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
