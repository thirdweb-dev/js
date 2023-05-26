import { Ecosystem, GenericAuthWallet } from "../../core";
import { SolanaSigner, SolanaWallet } from "../interfaces";
import bs58 from "bs58";
import nacl from "tweetnacl";

export abstract class AbstractWallet
  implements GenericAuthWallet, SolanaWallet
{
  type: Ecosystem = "solana";
  protected signer: SolanaSigner | undefined;

  public abstract getSigner(): Promise<SolanaSigner>;

  public async getAddress(): Promise<string> {
    const signer = await this.getSigner();
    return signer.publicKey.toBase58();
  }

  public async signMessage(message: string): Promise<string> {
    const signer = await this.getSigner();
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
}
