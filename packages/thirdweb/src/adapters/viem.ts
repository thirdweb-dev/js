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
import { toAccount } from "viem/accounts";

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
  // this *may* exist as a private function on the wallet
  const provider = (options.wallet as any)?.provider;
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

  const transport = provider
    ? custom(provider)
    : http(rpcUrl, {
        fetchOptions: options.client.secretKey
          ? { headers: { "x-secret-key": options.client.secretKey } }
          : undefined,
      });

  return createWalletClient({
    transport,
    account: account.signTransaction
      ? toAccount({
          address: account.address,
          signMessage: account.signMessage,
          signTransaction: (tx) => {
            if (!account.signTransaction) {
              throw new Error("signTransaction not supported");
            }
            return account.signTransaction(tx);
          },
          signTypedData: account.signTypedData,
        })
      : account.address,
    chain: viemChain,
    key: "thirdweb-wallet",
  });
}
