import { ethers } from "ethers";

export interface EVMWallet {
  getSigner(): Promise<ethers.Signer>;
}
