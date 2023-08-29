import type {
  Provider,
  TransactionRequest,
} from "@ethersproject/abstract-provider";
import type {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import { Signer } from "@ethersproject/abstract-signer";
import type { Bytes } from "@ethersproject/bytes";
import type { Deferrable } from "@ethersproject/properties";
import { defineReadOnly } from "@ethersproject/properties";
import type { ClientIdWithQuerierType } from "../../interfaces/EmbeddedWallets/EmbeddedWallets";
import type {
  GetAddressReturnType,
  SignMessageReturnType,
  SignTransactionReturnType,
  SignedTypedDataReturnType,
} from "../../interfaces/EmbeddedWallets/Signer";

import type { JsonRpcProvider } from "@ethersproject/providers";
import type { EmbeddedWalletIframeCommunicator } from "../../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator";

export type SignerProcedureTypes = {
  getAddress: void;
  signMessage: {
    message: string | Bytes;
    chainId: number;
    rpcEndpoint: string;
  };
  signTransaction: {
    transaction: Deferrable<TransactionRequest>;
    chainId: number;
    rpcEndpoint: string;
  };
  signTypedDataV4: {
    domain: TypedDataDomain;
    types: Record<string, Array<TypedDataField>>;
    message: Record<string, unknown>;
    chainId: number;
    rpcEndpoint: string;
  };
  connect: { provider: Provider };
};

export class EthersSigner extends Signer {
  protected querier: EmbeddedWalletIframeCommunicator<SignerProcedureTypes>;
  protected clientId: string;
  protected endpoint: string;
  private DEFAULT_ETHEREUM_CHAIN_ID = 5;
  constructor({
    provider,
    clientId,
    querier,
  }: ClientIdWithQuerierType & {
    provider: Provider;
  }) {
    super();
    this.clientId = clientId;
    this.querier = querier;
    // we try to extract a url if possible
    this.endpoint = (provider as JsonRpcProvider).connection?.url;
    defineReadOnly(this, "provider", provider);
  }

  override async getAddress(): Promise<string> {
    const { address } = await this.querier.call<GetAddressReturnType>({
      procedureName: "getAddress",
      params: undefined,
    });
    return address;
  }

  override async signMessage(message: string | Bytes): Promise<string> {
    const network = await this.provider?.getNetwork();
    if (network) {
      network._defaultProvider;
    }

    const { signedMessage } = await this.querier.call<SignMessageReturnType>({
      procedureName: "signMessage",
      params: {
        message,
        chainId:
          (await this.provider?.getNetwork())?.chainId ??
          this.DEFAULT_ETHEREUM_CHAIN_ID,
        rpcEndpoint: this.endpoint,
      },
    });
    return signedMessage;
  }

  override async signTransaction(
    transaction: TransactionRequest,
  ): Promise<string> {
    const { signedTransaction } =
      await this.querier.call<SignTransactionReturnType>({
        procedureName: "signTransaction",
        params: {
          transaction,
          chainId:
            (await this.provider?.getNetwork())?.chainId ??
            this.DEFAULT_ETHEREUM_CHAIN_ID,
          rpcEndpoint: this.endpoint,
        },
      });
    return signedTransaction;
  }

  async _signTypedData(
    domain: SignerProcedureTypes["signTypedDataV4"]["domain"],
    types: SignerProcedureTypes["signTypedDataV4"]["types"],
    message: SignerProcedureTypes["signTypedDataV4"]["message"],
  ): Promise<string> {
    const { signedTypedData } =
      await this.querier.call<SignedTypedDataReturnType>({
        procedureName: "signTypedDataV4",
        params: {
          domain,
          types,
          message,
          chainId:
            (await this.provider?.getNetwork())?.chainId ??
            this.DEFAULT_ETHEREUM_CHAIN_ID,
          rpcEndpoint: this.endpoint,
        },
      });
    return signedTypedData;
  }

  override connect(provider: Provider): EthersSigner {
    return new EthersSigner({
      clientId: this.clientId,
      provider,
      querier: this.querier,
    });
  }
}
