import { Signer } from "ethers";
import { AbstractWallet } from "./abstract";
import {
  GcpKmsSigner,
  GcpKmsSignerCredentials,
} from "../connectors/gcp-kms/signer";

/**
 * @wallet
 */
export class GcpKmsWallet extends AbstractWallet {
  #options: GcpKmsSignerCredentials;

  constructor(options: GcpKmsSignerCredentials) {
    super();
    this.#options = options;
  }

  async getSigner(): Promise<Signer> {
    return new GcpKmsSigner(this.#options);
  }
}
