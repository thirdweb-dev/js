import {
  Bytes,
  Signer,
  TypedDataDomain,
  TypedDataField,
  providers,
} from "ethers";
import { Deferrable, defineReadOnly } from "ethers/lib/utils";
import type { ClientIdWithQuerierType } from "../../interfaces/embedded-wallets/embedded-wallets";
import type {
  GetAddressReturnType,
  SignMessageReturnType,
  SignTransactionReturnType,
  SignedTypedDataReturnType,
} from "../../interfaces/embedded-wallets/signer";

import Provider from "ethereum-provider";
import type { EmbeddedWalletIframeCommunicator } from "../../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator";

export type SignerProcedureTypes = {
  getAddress: void;
  signMessage: {
    message: string | Bytes;
    chainId: number;
    rpcEndpoint: string;
  };
  signTransaction: {
    transaction: Deferrable<providers.TransactionRequest>;
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
    provider: providers.Provider;
  }) {
    super();
    this.clientId = clientId;
    this.querier = querier;
    // we try to extract a url if possible
    this.endpoint = (provider as providers.JsonRpcProvider).connection?.url;
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
    transaction: providers.TransactionRequest,
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

  override connect(provider: providers.Provider): EthersSigner {
    return new EthersSigner({
      clientId: this.clientId,
      provider,
      querier: this.querier,
    });
  }
}
