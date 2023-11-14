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

  connect(provider: ethers.providers.Provider): EngineSigner {
    return new EngineSigner(this.config, provider);
  }

  private engineProvider(
    provider: ethers.providers.Provider,
  ): ethers.providers.Provider {
    provider.sendTransaction = async (
      transaction: ethers.providers.TransactionRequest,
    ): Promise<ethers.providers.TransactionResponse> => {
      const tx = await ethers.utils.resolveProperties(transaction);
      const res = await this.fetch({
        path: "/backend-wallet/send-transaction",
        method: "POST",
        // Most of these are unused by the endpoint for now, but we preserve them anyway
        // in case we implement more in the future
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

      // Wait for the transaction to be sent
      while (true) {
        // TODO: Maybe we should add a timeout here?
        const { result: txRes } = await this.fetch({
          path: `/transaction/status/${queueId}`,
          method: "GET",
        });

        if (txRes.status === "errored") {
          throw new Error(
            `Transaction errored with reason: ${txRes.errorMessage}`,
          );
        }

        if (txRes.status === "cancelled") {
          throw new Error(`Transaction execution cancelled.`);
        }

        if (txRes.transactionHash) {
          return {
            hash: txRes.transactionHash,
            to: txRes.toAddress,
            from: txRes.fromAddress,
            nonce: txRes.nonce,
            gasLimit: BigNumber.from(txRes.gasLimit),
            gasPrice: BigNumber.from(txRes.gasPrice),
            data: txRes.data,
            value: BigNumber.from(txRes.value),
            chainId: parseInt(txRes.chainId),
            type: txRes.transactionType,
            maxPriorityFeePerGas: BigNumber.from(txRes.maxPriorityFeePerGas),
            maxFeePerGas: BigNumber.from(txRes.maxFeePerGas),
            confirmations: 0,
            wait(confirmations) {
              return provider.waitForTransaction(
                txRes.transactionHash,
                confirmations,
              );
            },
          };
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    };

    return provider;
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
