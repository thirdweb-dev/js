import { ethers } from "ethers";

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

    const queueId = res.result.queueId;

    while (true) {
      const {
        result: { status, transactionHash },
      } = await this.fetch({
        path: `/transaction/status/${queueId}`,
        method: "GET",
      });

      if (status === "errored" || status === "cancelled") {
        throw new Error(`Transaction ${status}`);
      }

      if (transactionHash) {
        return transactionHash;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
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
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  }
}
