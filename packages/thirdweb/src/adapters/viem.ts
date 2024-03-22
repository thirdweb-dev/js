import {
  createPublicClient,
  http,
  type GetContractReturnType,
  type PublicClient,
  type Chain as ViemChain,
  type WalletClient,
  createWalletClient,
  custom,
} from "viem";
import { getContract, type ThirdwebContract } from "../contract/contract.js";
import type { Abi } from "abitype";
import type { Chain } from "../chains/types.js";
import type { ThirdwebClient } from "../client/client.js";
import { resolveContractAbi } from "../contract/actions/resolve-abi.js";
import { getRpcUrlForChain } from "../chains/utils.js";
import type { Account } from "../wallets/interfaces/wallet.js";
import { getRpcClient } from "../rpc/rpc.js";

export const viemAdapter = {
  contract: {
    /**
     * Creates a ThirdwebContract from a Viem contract.
     * @param options - The options for creating the contract.
     * @returns The ThirdwebContract.
     * @example
     * ```ts
     * import { viemAdapter } from "thirdweb/adapters";
     *
     * const contract = viemmAdapter.contract.fromViem({
     *  viemContract: viemContract,
     *  chain: ethereum,
     *  client,
     * });
     * ```
     */
    fromViem: fromViemContract,
    /**
     * Converts a ThirdwebContract instance to a Viem contract representation.
     * @param contract The ThirdwebContract instance to convert.
     * @returns A promise that resolves to the Viem contract representation.
     * @example
     * ```ts
     * import { viemAdapter } from "thirdweb/adapters";
     *  const viemContract = await viemAdapter.contract.toViem(contract);
     * ```
     */
    toViem: toViemContract,
  },

  /**
   * Converts options to a Viem public client.
   * @param options - The options for creating the Viem public client.
   * @returns The Viem public client.
   * @example
   * ```ts
   * import { viemAdapter } from "thirdweb/adapters";
   *
   *  const publicClient = viemAdapter.publicClient.toViem({
   *  chain: ethereum,
   *  client,
   * });
   * ```
   */
  publicClient: {
    toViem: toViemPublicClient,
  },

  walletClient: {
    /**
     * Converts options to a Viem Wallet client.
     * @param options - The options for creating the Viem Wallet client.
     * @returns The Viem Wallet client.
     * @example
     * ```ts
     * import { viemAdapter } from "thirdweb/adapters";
     *
     * const walletClient = viemAdapter.walletClient.toViem({
     *  wallet: wallet,
     *  client,
     *  chain: ethereum,
     * });
     * ```
     */
    toViem: toViemWalletClient,

    /**
     * Converts a Viem Wallet client to an Account.
     * @param options - The options for creating the Account.
     * @returns The Account.
     * @example
     * ```ts
     * import { viemAdapter } from "thirdweb/adapters";
     *
     * const account = viemAdapter.walletClient.fromViem({
     *   walletClient,
     * });
     */
    fromViem: fromViemWalletClient,
  },
};

type FromViemContractOptions<TAbi extends Abi> = {
  client: ThirdwebClient;
  viemContract: GetContractReturnType<TAbi>;
  chain: Chain;
};

function fromViemContract<const TAbi extends Abi>(
  options: FromViemContractOptions<TAbi>,
): ThirdwebContract<TAbi> {
  return getContract({
    address: options.viemContract.address,
    abi: options.viemContract.abi,
    chain: options.chain,
    client: options.client,
  });
}

async function toViemContract<const TAbi extends Abi>(
  contract: ThirdwebContract<TAbi>,
): Promise<GetContractReturnType<TAbi>> {
  return {
    address: contract.address,
    abi: await resolveContractAbi(contract),
  };
}

type ToViemPublicClientOptions = {
  client: ThirdwebClient;
  chain: Chain;
};

function toViemPublicClient(options: ToViemPublicClientOptions): PublicClient {
  const { chain, client } = options;
  const rpcUrl = getRpcUrlForChain({ chain, client });
  const viemChain: ViemChain = {
    id: chain.id,
    name: chain.name || "",
    rpcUrls: {
      default: { http: [rpcUrl] },
    },
    nativeCurrency: {
      name: chain.nativeCurrency?.name || "Ether",
      symbol: chain.nativeCurrency?.symbol || "ETH",
      decimals: chain.nativeCurrency?.decimals || 18,
    },
  };
  return createPublicClient({
    transport: http(rpcUrl, {
      fetchOptions: client.secretKey
        ? {
            headers: {
              "x-secret-key": client.secretKey,
            },
          }
        : undefined,
    }),
    chain: viemChain,
  });
}

type ToViemWalletClientOptions = {
  account: Account;
  client: ThirdwebClient;
  chain: Chain;
};

function toViemWalletClient(options: ToViemWalletClientOptions): WalletClient {
  const { account, chain, client } = options;
  if (!account) {
    throw new Error("Wallet not connected.");
  }

  const rpcUrl = getRpcUrlForChain({ chain, client });
  const viemChain: ViemChain = {
    id: chain.id,
    name: chain.name || "",
    rpcUrls: {
      default: { http: [rpcUrl] },
    },
    nativeCurrency: {
      name: chain.nativeCurrency?.name || "Ether",
      symbol: chain.nativeCurrency?.symbol || "ETH",
      decimals: chain.nativeCurrency?.decimals || 18,
    },
  };

  const rpcClient = getRpcClient({ client, chain });
  const transport = custom({
    request: async (request) => {
      if (request.method === "eth_sendTransaction") {
        const result = await account.sendTransaction(request.params[0]);
        return result.transactionHash;
      }
      if (request.method === "eth_estimateGas") {
        if (account.estimateGas) {
          return account.estimateGas(request.params[0]);
        }
      }
      if (request.method === "personal_sign") {
        return account.signMessage({
          message: {
            raw: request.params[0],
          },
        });
      }
      if (request.method === "eth_signTypedData_v4") {
        const data = JSON.parse(request.params[1]);
        return account.signTypedData(data);
      }
      return rpcClient(request);
    },
  });

  return createWalletClient({
    transport,
    account: account.address,
    chain: viemChain,
    key: "thirdweb-wallet",
  });
}

function fromViemWalletClient(options: {
  walletClient: WalletClient;
}): Account {
  const viemAccount = options.walletClient.account;
  if (!viemAccount) {
    throw new Error("Wallet not connected.");
  }
  return {
    address: viemAccount.address,
    signMessage: async (msg) => {
      return options.walletClient.signMessage({
        account: viemAccount.address,
        ...msg,
      });
    },
    sendTransaction: async (tx) => {
      const txHash = await options.walletClient.sendTransaction({
        account: viemAccount.address,
        chain: options.walletClient.chain,
        ...tx,
        type: "eip1559",
        gasPrice: undefined,
      });
      return {
        transaction: tx,
        transactionHash: txHash,
      };
    },
    signTypedData(_typedData) {
      return options.walletClient.signTypedData(_typedData as any); // TODO fix types
    },
  };
}
