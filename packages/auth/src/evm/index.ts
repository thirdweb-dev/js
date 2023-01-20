import type { Ecosystem, GenericSignerWallet } from "@thirdweb-dev/wallets";
import { ethers } from "ethers";

export class SignerWallet implements GenericSignerWallet {
  type: Ecosystem = "evm";
  #signer: ethers.Signer;

  constructor(signer: ethers.Signer) {
    this.#signer = signer;
  }

  public async getAddress(): Promise<string> {
    return this.#signer.getAddress();
  }

  public async signMessage(message: string): Promise<string> {
    return await this.#signer.signMessage(message);
  }

  public async verifySignature(
    message: string,
    signature: string,
    address: string,
  ): Promise<boolean> {
    const messageHash = ethers.utils.hashMessage(message);
    const messageHashBytes = ethers.utils.arrayify(messageHash);
    const recoveredAddress = ethers.utils.recoverAddress(
      messageHashBytes,
      signature,
    );
    return recoveredAddress === address;
  }
}

export class PrivateKeyWallet extends SignerWallet {
  constructor(privateKey: string) {
    super(new ethers.Wallet(privateKey));
  }
}
