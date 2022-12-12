import { MinimalWallet } from "@thirdweb-dev/wallets";
import { ethers } from "ethers";

export class WalletSigner {
  private wallet: MinimalWallet;
  private signer: ethers.Signer | undefined;

  constructor(wallet: MinimalWallet) {
    this.wallet = wallet;
  }

  public async getAddress(): Promise<string> {
    const signer = await this.getSigner();
    return signer.getAddress();
  }

  public async sign(message: string): Promise<string> {
    const signer = await this.getSigner();
    return await signer.signMessage(message);
  }

  public recoverAddress(message: string, signature: string): string {
    const messageHash = ethers.utils.hashMessage(message);
    const messageHashBytes = ethers.utils.arrayify(messageHash);
    return ethers.utils.recoverAddress(messageHashBytes, signature);
  }

  // Signer should only be accessed with this function
  async getSigner(): Promise<ethers.Signer> {
    // First check for the cached signer
    if (this.signer) {
      return this.signer;
    }

    // Otherwise newly instantiate it and return
    return (this.signer = await this.wallet.getSigner());
  }
}
