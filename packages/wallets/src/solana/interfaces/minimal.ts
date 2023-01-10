import { SolanaSigner } from "./signer";

export interface MinimalWallet {
  getSigner(): Promise<SolanaSigner>;
}
