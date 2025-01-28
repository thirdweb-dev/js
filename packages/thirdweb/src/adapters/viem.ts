import type { Abi } from "abitype";
import {
  http,
  type GetContractReturnType,
  type PublicClient,
  type TransactionSerializableEIP1559,
  type Chain as ViemChain,
  type WalletClient,
  createPublicClient,
  createWalletClient,
  custom,
} from "viem";
import type { Chain } from "../chains/types.js";
import { getRpcUrlForChain } from "../chains/utils.js";
import type { ThirdwebClient } from "../client/client.js";
import { resolveContractAbi } from "../contract/actions/resolve-abi.js";
import { type ThirdwebContract, getContract } from "../contract/contract.js";
import { getRpcClient } from "../rpc/rpc.js";
import { estimateGas } from "../transaction/actions/estimate-gas.js";
import { sendTransaction } from "../transaction/actions/send-transaction.js";
import { prepareTransaction } from "../transaction/prepare-transaction.js";
import { getAddress } from "../utils/address.js";
import type { Account } from "../wallets/interfaces/wallet.js";

/**
 * Converts thirdweb accounts and contracts to viem wallet clients and contract objects or the other way around.
 * @example
 *
 * ### Converting a thirdweb account to a viem wallet client
 *
 * ```ts
 * import { viemAdapter } from "thirdweb/adapters/viem";
 *
 * const walletClient = viemAdapter.walletClient.toViem({
 *  account,
 *  client,
 *  chain: ethereum,
 * });
 * ```
 *
 * ### Converting a viem wallet client to a thirdweb account
 * ```ts
 * import { viemAdapter } from "thirdweb/adapters";
 *
 * const account = viemAdapter.walletClient.fromViem({
 *   walletClient,
 * });
 * ```
 *
 * ### Converting a thirdweb contract to a viem contract
 * ```ts
 * import { viemAdapter } from "thirdweb/adapters";
 *  const viemContract = await viemAdapter.contract.toViem({ thirdwebContract });
 * ```
 *
 * ### Converting a viem contract to a thirdweb contract
 * ```ts
 * import { viemAdapter } from "thirdweb/adapters/viem";
 *
 * const contract = viemAdapter.contract.fromViem({
 *  viemContract: viemContract,
 *  chain: ethereum,
 *  client,
 * });
 * ```
 *
 * ### Converting a thirdweb client to a public viem client
 * ```ts
 * import { viemAdapter } from "thirdweb/adapters";
 *
 * const publicClient = viemAdapter.publicClient.toViem({
 *  chain: ethereum,
 *  client,
 * });
 * ```
 *
 */
export const viemAdapter = {
  /**
   * Creates a ThirdwebContract from a Viem contract or the other way around.
   * @param options - The options for creating the contract.
   * @returns The ThirdwebContract.
   * @example
   *
   * ### fromViem
   *
   * ```ts
   * import { viemAdapter } from "thirdweb/adapters/viem";
   *
   * const contract = viemAdapter.contract.fromViem({
   *  viemContract: viemContract,
   *  chain: ethereum,
   *  client,
   * });
   * ```
   *
   * ### toViem
   *
   * ```ts
   * import { viemAdapter } from "thirdweb/adapters";
   *  const viemContract = await viemAdapter.contract.toViem({ thirdwebContract });
   * ```
   */
  contract: {
    fromViem: fromViemContract,
    toViem: toViemContract,
  },

  /**
   * Converts options to a Viem public client.
   * @param options - The options for creating the Viem public client.
   * @returns The Viem public client.
   * @example
   * ```ts
   * import { viemAdapter } from "thirdweb/adapters/viem";
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

  /**
   * Converts a thirdweb account to a Viem Wallet client or the other way around.
   * @param options - The options for creating the Viem Wallet client.
   * @returns The Viem Wallet client.
   * @example
   *
   * ### toViem
   * ```ts
   * import { viemAdapter } from "thirdweb/adapters/viem";
   *
   * const walletClient = viemAdapter.walletClient.toViem({
   *  account,
   *  client,
   *  chain: ethereum,
   * });
   * ```
   *
   * ### fromViem
   * ```ts
   * import { viemAdapter } from "thirdweb/adapters";
   *
   * const account = viemAdapter.walletClient.fromViem({
   *   walletClient,
   * });
   * ```
   */
  walletClient: {
    /**
     * Converts a Thirdweb wallet to a Viem wallet client.
     * @param options - The options for converting a Thirdweb wallet to a Viem wallet client.
     * @param options.account - The Thirdweb wallet to convert.
     * @returns A Promise that resolves to a Viem wallet client.
     * @example
     * ```ts
     * import { viemAdapter } from "thirdweb/adapters";
     * const walletClient = viemAdapter.walletClient.toViem({ account, client, chain });
     * ```
     */
    toViem: toViemWalletClient,
    /**
     * Converts a Viem wallet client to a Thirdweb wallet.
     * @param options - The options for converting a Viem wallet client to a Thirdweb wallet.
     * @param options.walletClient - The Viem wallet client to convert.
     * @returns A Promise that resolves to a Thirdweb wallet.
     * @example
     * ```ts
     * import { viemAdapter } from "thirdweb/adapters";
     * const account = viemAdapter.walletClient.fromViem({ walletClient });
     * ```
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

/**
 * @internal
 */
export async function toViemContract<const TAbi extends Abi>(options: {
  thirdwebContract: ThirdwebContract<TAbi>;
}): Promise<GetContractReturnType<TAbi>> {
  return {
    address: getAddress(options.thirdwebContract.address),
    abi: await resolveContractAbi(options.thirdwebContract),
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
        const result = await sendTransaction({
          transaction: prepareTransaction({
            ...request.params[0],
            chain,
            client,
          }),
          account: account,
        });
        return result.transactionHash;
      }
      if (request.method === "eth_estimateGas") {
        return estimateGas({
          transaction: prepareTransaction({
            ...request.params[0],
            chain,
            client,
          }),
          account: account,
        });
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
      if (request.method === "eth_accounts") {
        return [account.address];
      }
      return rpcClient(request);
    },
  });

  return createWalletClient({
    transport,
    account: getAddress(account.address),
    chain: viemChain,
    key: "thirdweb-wallet",
  });
}

function fromViemWalletClient(options: {
  walletClient: WalletClient;
}): Account {
  const viemAccount = options.walletClient.account;
  if (!viemAccount) {
    throw new Error(
      "Account not found in walletClient, please pass it explicitly.",
    );
  }
  return {
    address: viemAccount.address,
    signMessage: async (msg) => {
      return options.walletClient.signMessage({
        account: viemAccount,
        ...msg,
      });
    },
    sendTransaction: async (tx) => {
      const tx1559 = tx as TransactionSerializableEIP1559; // TODO check other txTypes
      const txHash = await options.walletClient.sendTransaction({
        account: viemAccount,
        chain: options.walletClient.chain,
        ...tx1559,
      });
      return {
        transaction: tx,
        transactionHash: txHash,
      };
    },
    signTypedData(_typedData) {
      if (!_typedData) {
        throw new Error("Typed data is required to signTypedData");
      }
      // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
      return options.walletClient.signTypedData(_typedData as any);
    },
  };
}
