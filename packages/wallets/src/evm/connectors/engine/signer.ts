import { BigNumber, ethers } from "ethers";

export interface EngineSignerConfiguration {
  engineUrl: string;
  accessToken: string;
  backendWalletAddress: string;
}

export class EngineSigner extends ethers.Signer {
  config: EngineSignerConfiguration;

  constructor(
    config: EngineSignerConfiguration,
    provider?: ethers.providers.Provider,
  ) {
    super();
    this.config = {
      ...config,
      engineUrl: config.engineUrl.replace(/\/$/, ""),
    };
    // @ts-expect-error Allow passing null here
    ethers.utils.defineReadOnly(this, "provider", provider || null);
  }

  async getAddress(): Promise<string> {
    return this.config.backendWalletAddress;
  }

  async signMessage(message: string): Promise<string> {
    const res = await this.fetch({
      path: "/backend-wallet/sign-message",
      method: "POST",
      body: { message },
    });

    return res.result;
  }

  async signTransaction(
    transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>,
  ): Promise<string> {
    const tx = await ethers.utils.resolveProperties(transaction);
    const res = await this.fetch({
      path: "/backend-wallet/sign-transaction",
      method: "POST",
      body: {
        ...tx,
        nonce: tx.nonce?.toString(),
        gasLimit: tx.gasLimit?.toString(),
        gasPrice: tx.gasPrice?.toString(),
        value: tx.value?.toString(),
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas?.toString(),
        maxFeePerGas: tx.maxFeePerGas?.toString(),
      },
    });

    return res.result;
  }

  async sendTransaction(
    transaction: ethers.providers.TransactionRequest,
  ): Promise<ethers.providers.TransactionResponse> {
    if (!this.provider) {
      throw new Error("Sending transactions requires a provider!");
    }

    const chainId = (await this.provider.getNetwork()).chainId;
    const tx = await ethers.utils.resolveProperties(transaction);
    const res = await this.fetch({
      path: `/backend-wallet/${chainId}/send-transaction`,
      method: "POST",
      body: {
        toAddress: tx.to,
        data: tx.data,
        value: tx.value || "0",
      },
    });

    const queueId = res.result.queueId;

    // We return dummy data from here, since we don't have a transaction hash yet
    return {
      hash: queueId,
      confirmations: 0,
      from: this.config.backendWalletAddress,
      nonce: 0,
      gasLimit: BigNumber.from(0),
      value: BigNumber.from(0),
      data: "",
      chainId,
      wait: async (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        confirmations?: number,
      ): Promise<ethers.providers.TransactionReceipt> => {
        if (!this.provider) {
          throw new Error("Sending transactions requires a provider!");
        }

        while (true) {
          const { result: txRes } = await this.fetch({
            path: `/transaction/status/${queueId}`,
            method: "GET",
          });

          switch (txRes.status) {
            case "errored":
              throw new Error(
                `Transaction errored with reason: ${txRes.errorMessage}`,
              );
            case "cancelled":
              throw new Error(`Transaction execution cancelled.`);
            case "mined":
              const receipt = await this.provider.getTransactionReceipt(
                txRes.transactionHash,
              );
              return receipt;
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      },
    };
  }

  connect(provider: ethers.providers.Provider): EngineSigner {
    return new EngineSigner(this.config, provider);
  }

  private async fetch({
    path,
    method,
    body,
  }: {
    path: string;
    method: "GET" | "POST";
    body?: any;
  }) {
    const res = await fetch(`${this.config.engineUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.accessToken}`,
        "x-backend-wallet-address": this.config.backendWalletAddress,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  }
}
