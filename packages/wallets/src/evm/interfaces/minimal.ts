import { ethers } from "ethers";

export interface MinimalWallet {
  getSigner(): Promise<ethers.Signer>;
}
