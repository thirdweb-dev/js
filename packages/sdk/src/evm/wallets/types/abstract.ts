import { ethers } from "ethers";

export abstract class AbstractWallet {
  abstract getSigner(
    provider?: ethers.providers.Provider,
  ): Promise<ethers.Signer>;
}
