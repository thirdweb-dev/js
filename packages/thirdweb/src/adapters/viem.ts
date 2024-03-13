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
import type { Account, Wallet } from "../wallets/interfaces/wallet.js";
import type { Prettify } from "../utils/type-utils.js";
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

type ToViemWalletClientOptions = Prettify<
  (
    | {
        wallet: Wallet;
        account?: never;
      }
    | {
        wallet?: never;
        account: Account;
      }
  ) & {
    client: ThirdwebClient;
    chain: Chain;
  }
>;

function toViemWalletClient(options: ToViemWalletClientOptions): WalletClient {
  const account = options.account || options.wallet.getAccount();
  if (!account) {
    throw new Error("Wallet not connected.");
  }

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

  const rpcClient = getRpcClient({ client, chain });
  const transport = custom({
    request: async (request) => {
      console.log("request", request);
      if (request.method === "eth_sendTransaction") {
        const result = await account.sendTransaction(request.params[0]);
        if (result.userOpHash) {
          return result.userOpHash; // TODO this should return the tx hash instead to ensure compatibility with other libs
        }
        return result.transactionHash;
      }
      if (request.method === "eth_estimateGas") {
        if (options.wallet?.estimateGas) {
          return options.wallet.estimateGas(request.params[0]);
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
        return account.signTypedData(JSON.parse(request.params[1]));
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
