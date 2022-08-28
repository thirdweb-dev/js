// import { getPayer } from "../utils/local-config";
import { Signer } from "@metaplex-foundation/js";
import EventEmitter from "eventemitter3";

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
  connected: [Signer];
  /**
   * Emitted when `sdk.wallet.disconnect()` is called.
   */
  disconnected: void;
}

export class UserWallet {
  public signer: Signer | undefined;
  public events = new EventEmitter<UserWalletEvents>();

  public connect(wallet: Signer) {
    this.signer = wallet;
    this.events.emit("connected", wallet);
  }

  public disconnect() {
    this.signer = undefined;
    this.events.emit("disconnected");
  }
}
