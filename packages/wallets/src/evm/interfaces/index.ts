import type { Signer } from "ethers";

export interface EVMWallet {
  getSigner(): Promise<Signer>;
}
