import { GenericSignerWallet } from "../../core";
import { MinimalWallet } from "../interfaces/minimal";
import { ethers } from "ethers";
import EventEmitter from "eventemitter3";

export type WalletData = {
  address?: string;
  chainId?: number;
};

export interface WalletEvents {
  connect(data: WalletData): void;
  change(data: WalletData): void;
  message({ type, data }: { type: string; data?: unknown }): void;
  disconnect(): void;
  error(error: Error): void;
}

export abstract class AbstractSigner
  extends EventEmitter<WalletEvents>
  implements GenericSignerWallet, MinimalWallet
{
  protected signer: ethers.Signer | undefined;

  public abstract getSigner(): Promise<ethers.Signer>;

  public async getAddress(): Promise<string> {
    const signer = await this.getCachedSigner();
    return signer.getAddress();
  }

  public async signMessage(message: string): Promise<string> {
    const signer = await this.getCachedSigner();
    return await signer.signMessage(message);
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

  public async getCachedSigner(): Promise<ethers.Signer> {
    if (!!this.signer) {
      return this.signer;
    }

    this.signer = await this.getSigner();

    if (!this.signer) {
      throw new Error("Unable to get a signer!");
    }

    return this.signer;
  }
}
