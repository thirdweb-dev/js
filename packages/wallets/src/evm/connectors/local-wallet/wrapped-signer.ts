import { getDefaultGasOverrides } from "@thirdweb-dev/sdk";
import { Bytes, Signer, providers } from "ethers";
import { Deferrable, defineReadOnly } from "ethers/lib/utils";

export class WrappedSigner extends Signer {
  constructor(private signer: Signer) {
    super();
    defineReadOnly(this, "provider", signer.provider);
  }

  override async getAddress(): Promise<string> {
    return await this.signer.getAddress();
  }

  override async signMessage(message: Bytes | string): Promise<string> {
    return await this.signer.signMessage(message);
  }

  override async signTransaction(
    transaction: Deferrable<providers.TransactionRequest>,
  ): Promise<string> {
    return await this.signer.signTransaction(transaction);
  }

  override connect(provider: providers.Provider): Signer {
    return new WrappedSigner(this.signer.connect(provider));
  }

  override async sendTransaction(
    transaction: Deferrable<providers.TransactionRequest>,
  ): Promise<providers.TransactionResponse> {
    if (!this.provider) {
      throw new Error("Provider not found");
    }
    const gas = await getDefaultGasOverrides(this.provider);
    const txWithGas = {
      ...gas,
      ...transaction,
    };
    return await this.signer.sendTransaction(txWithGas);
  }
}
