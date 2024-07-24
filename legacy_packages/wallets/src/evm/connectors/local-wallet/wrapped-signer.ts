import { getDefaultGasOverrides } from "@thirdweb-dev/sdk";
import {
  type Bytes,
  Signer,
  type TypedDataDomain,
  type TypedDataField,
  type Wallet,
  type providers,
} from "ethers";
import { type Deferrable, defineReadOnly } from "ethers/lib/utils";

export class WrappedSigner extends Signer {
  constructor(private signer: Wallet) {
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
    transaction: providers.TransactionRequest,
  ): Promise<string> {
    return await this.signer.signTransaction(transaction);
  }

  override connect(provider: providers.Provider): Signer {
    return new WrappedSigner(this.signer.connect(provider));
  }

  _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>,
  ): Promise<string> {
    return this.signer._signTypedData(domain, types, value);
  }

  override async sendTransaction(
    transaction: Deferrable<providers.TransactionRequest>,
  ): Promise<providers.TransactionResponse> {
    if (!this.provider) {
      throw new Error("Provider not found");
    }
    let gas = {};
    // only set overrides if we don't have values already
    if (
      !transaction.gasLimit &&
      !(transaction.maxFeePerGas && transaction.maxPriorityFeePerGas)
    ) {
      gas = await getDefaultGasOverrides(this.provider);
    }

    const txWithGas = {
      ...gas,
      ...transaction,
    };
    return await this.signer.sendTransaction(txWithGas);
  }
}
