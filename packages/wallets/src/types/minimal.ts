import { ethers } from "ethers";

export interface MinimalWallet {
  getSigner(provider?: ethers.providers.Provider): Promise<ethers.Signer>;
}
