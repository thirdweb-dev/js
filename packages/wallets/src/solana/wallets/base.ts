import { GenericSignerWallet } from "../../core";
import { SolanaSigner } from "../interfaces/signer";
import bs58 from "bs58";
import nacl from "tweetnacl";

export abstract class AbstractSigner implements GenericSignerWallet {
  protected signer: SolanaSigner | undefined;

  public abstract getSigner(): Promise<SolanaSigner>;

  public async getAddress(): Promise<string> {
    const signer = await this.getCachedSigner();
    return signer.publicKey.toBase58();
  }

  public async signMessage(message: string): Promise<string> {
    const signer = await this.getCachedSigner();
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await signer.signMessage(encodedMessage);
    const signature = bs58.encode(signedMessage);

    return signature;
  }

  public async verifySignature(
    message: string,
    signature: string,
    address: string,
  ): Promise<boolean> {
    return nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      bs58.decode(signature),
      bs58.decode(address),
    );
  }

  public async getCachedSigner(): Promise<SolanaSigner> {
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
