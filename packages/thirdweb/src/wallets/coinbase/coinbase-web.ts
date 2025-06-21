import type { ProviderInterface } from "@coinbase/wallet-sdk";
import type { Preference } from "@coinbase/wallet-sdk/dist/core/provider/interface.js";
import type { Address } from "abitype";
import * as ox__Hex from "ox/Hex";
import * as ox__TypedData from "ox/TypedData";
import { trackTransaction } from "../../analytics/track/transaction.js";
import type { Chain } from "../../chains/types.js";
import { getCachedChain, getChainMetadata } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getAddress } from "../../utils/address.js";
import {
  type Hex,
  numberToHex,
  stringToHex,
  uint8ArrayToHex,
} from "../../utils/encoding/hex.js";
import { parseTypedData } from "../../utils/signatures/helpers/parse-typed-data.js";
import { COINBASE } from "../constants.js";
import type {
  Account,
  SendTransactionOption,
  Wallet,
} from "../interfaces/wallet.js";
import type { AppMetadata, DisconnectFn, SwitchChainFn } from "../types.js";
import { getValidPublicRPCUrl } from "../utils/chains.js";
import { getDefaultAppMetadata } from "../utils/defaultDappMetadata.js";
import { normalizeChainId } from "../utils/normalizeChainId.js";
import type { WalletEmitter } from "../wallet-emitter.js";
import type {
  CreateWalletArgs,
  WalletConnectionOption,
} from "../wallet-types.js";
import { showCoinbasePopup } from "./utils.js";

export type CoinbaseWalletCreationOptions =
  | {
      /**
       * Metadata of the dApp that will be passed to connected wallet.
       *
       * Some wallets may display this information to the user.
       *
       * Setting this property is highly recommended. If this is not set, Below default metadata will be used:
       *
       * ```ts
       * {
       *   name: "thirdweb powered dApp",
       *   url: "https://thirdweb.com",
       *   description: "thirdweb powered dApp",
       *   logoUrl: "https://thirdweb.com/favicon.ico",
       * };
       * ```
       */
      appMetadata?: AppMetadata;

      /**
       * Wallet configuration, choices are 'all' | 'smartWalletOnly' | 'eoaOnly'
       * @default 'all'
       * @example
       * ```ts
       * {
       *  walletConfig: {
       *   options: 'all',
       *  }
       * }
       * ```
       */
      walletConfig?: Preference;

      /**
       * Chains that the wallet can switch chains to, will default to the first chain in this array on first connection.
       * @default Ethereum mainnet
       * @example
       * ```ts
       * {
       *   chains: [base, optimisim]
       * }
       */
      chains?: Chain[];

      mobileConfig?: {
        /**
         * The univeral callback URL to redirect the user to after they have completed the wallet connection with the cb wallet app.
         * This needs to be setup as a Universal link for iOS https://docs.cdp.coinbase.com/wallet-sdk/docs/ios-setup/
         * and App link on Android https://docs.cdp.coinbase.com/wallet-sdk/docs/android-setup/
         */
        callbackURL?: string;
      };
    }
  | undefined;

/**
 * Options for connecting to the CoinbaseSDK Wallet
 */
export type CoinbaseSDKWalletConnectionOptions = {
  /**
   * The Thirdweb client object
   */
  client: ThirdwebClient;

  /**
   * If you want the wallet to be connected to a specific blockchain, you can pass a `Chain` object to the `connect` method.
   * This will trigger a chain switch if the wallet provider is not already connected to the specified chain.
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain.
   *
   * ```ts
   * import { defineChain } from "thirdweb";
   * const myChain = defineChain(myChainId);
   *
   * const address = await wallet.connect({ chain: myChain })
   */
  chain?: Chain;
};

// Need to keep the provider around because it keeps a single popup window connection behind the scenes
// this should be ok since all the creation options are provided at build time
let _provider: ProviderInterface | undefined;

/**
 * @internal
 */
export async function getCoinbaseWebProvider(
  options?: CreateWalletArgs<typeof COINBASE>[1],
): Promise<ProviderInterface> {
  if (!_provider) {
    let CoinbaseWalletSDK: unknown = (await import("@coinbase/wallet-sdk"))
      .default;
    // Workaround for Vite dev import errors
    // https://github.com/vitejs/vite/issues/7112
    if (
      typeof CoinbaseWalletSDK !== "function" &&
      typeof (CoinbaseWalletSDK as { default: unknown }).default === "function"
    ) {
      CoinbaseWalletSDK = (
        CoinbaseWalletSDK as unknown as { default: typeof CoinbaseWalletSDK }
      ).default;
    }

    // @ts-expect-error This import error is not visible to TypeScript
    const client = new CoinbaseWalletSDK({
      appChainIds: options?.chains
        ? options.chains.map((c) => c.id)
        : undefined,
      appLogoUrl:
        options?.appMetadata?.logoUrl || getDefaultAppMetadata().logoUrl,
      appName: options?.appMetadata?.name || getDefaultAppMetadata().name,
    });

    const provider = client.makeWeb3Provider(options?.walletConfig);
    _provider = provider;
    return provider;
  }
  return _provider;
}

/**
 * Checks if the provided wallet is a Coinbase SDK wallet.
 *
 * @param wallet - The wallet to check.
 * @returns True if the wallet is a Coinbase SDK wallet, false otherwise.
 */
export function isCoinbaseSDKWallet(
  wallet: Wallet,
): wallet is Wallet<typeof COINBASE> {
  return wallet.id === COINBASE;
}

function createAccount({
  provider,
  address,
  client,
}: {
  provider: ProviderInterface;
  address: string;
  client: ThirdwebClient;
}) {
  const account: Account = {
    address: getAddress(address),
    onTransactionRequested: async () => {
      // make sure to show the coinbase popup BEFORE doing any transaction preprocessing
      // otherwise the popup might get blocked in safari
      await showCoinbasePopup(provider);
    },
    async sendTransaction(tx: SendTransactionOption) {
      const transactionHash = (await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            accessList: tx.accessList,
            data: tx.data,
            from: getAddress(address),
            gas: tx.gas ? numberToHex(tx.gas) : undefined,
            to: tx.to as Address,
            value: tx.value ? numberToHex(tx.value) : undefined,
          },
        ],
      })) as Hex;

      trackTransaction({
        chainId: tx.chainId,
        client: client,
        contractAddress: tx.to ?? undefined,
        gasPrice: tx.gasPrice,
        transactionHash,
        walletAddress: getAddress(address),
        walletType: COINBASE,
      });

      return {
        transactionHash,
      };
    },
    async signMessage({ message }) {
      if (!account.address) {
        throw new Error("Provider not setup");
      }

      const messageToSign = (() => {
        if (typeof message === "string") {
          return stringToHex(message);
        }
        if (message.raw instanceof Uint8Array) {
          return uint8ArrayToHex(message.raw);
        }
        return message.raw;
      })();

      const res = await provider.request({
        method: "personal_sign",
        params: [messageToSign, account.address],
      });
      if (!ox__Hex.validate(res)) {
        throw new Error("Invalid signature returned");
      }
      return res;
    },
    async signTypedData(typedData) {
      if (!account.address) {
        throw new Error("Provider not setup");
      }

      const { domain, message, primaryType } = parseTypedData(
        typedData,
      ) as ox__TypedData.Definition;

      const types = {
        EIP712Domain: ox__TypedData.extractEip712DomainTypes(domain),
        ...typedData.types,
      };

      // Need to do a runtime validation check on addresses, byte ranges, integer ranges, etc
      // as we can't statically check this with TypeScript.
      ox__TypedData.validate({ domain, message, primaryType, types });

      const stringifiedData = ox__TypedData.serialize({
        domain: domain ?? {},
        message,
        primaryType,
        types,
      });

      const res = await provider.request({
        method: "eth_signTypedData_v4",
        params: [account.address, stringifiedData],
      });
      if (!ox__Hex.validate(res)) {
        throw new Error("Invalid signed payload returned");
      }
      return res;
    },
  };

  return account;
}

function onConnect(
  address: string,
  chain: Chain,
  provider: ProviderInterface,
  emitter: WalletEmitter<typeof COINBASE>,
  client: ThirdwebClient,
): [Account, Chain, DisconnectFn, SwitchChainFn] {
  const account = createAccount({ address, client, provider });

  async function disconnect() {
    provider.removeListener("accountsChanged", onAccountsChanged);
    provider.removeListener("chainChanged", onChainChanged);
    provider.removeListener("disconnect", onDisconnect);
    await provider.disconnect();
  }

  async function onDisconnect() {
    disconnect();
    emitter.emit("disconnect", undefined);
  }

  function onAccountsChanged(accounts: string[]) {
    if (accounts[0]) {
      const newAccount = createAccount({
        address: getAddress(accounts[0]),
        client,
        provider,
      });
      emitter.emit("accountChanged", newAccount);
      emitter.emit("accountsChanged", accounts);
    } else {
      onDisconnect();
    }
  }

  function onChainChanged(newChainId: string) {
    const newChain = getCachedChain(normalizeChainId(newChainId));
    emitter.emit("chainChanged", newChain);
  }

  // subscribe to events
  provider.on("accountsChanged", onAccountsChanged);
  provider.on("chainChanged", onChainChanged);
  provider.on("disconnect", onDisconnect);

  return [
    account,
    chain,
    onDisconnect,
    (newChain) => switchChainCoinbaseWalletSDK(provider, newChain),
  ];
}

/**
 * @internal
 */
export async function connectCoinbaseWalletSDK(
  options: WalletConnectionOption<typeof COINBASE>,
  emitter: WalletEmitter<typeof COINBASE>,
  provider: ProviderInterface,
): Promise<ReturnType<typeof onConnect>> {
  const accounts = (await provider.request({
    method: "eth_requestAccounts",
  })) as string[];

  if (!accounts[0]) {
    throw new Error("No accounts found");
  }

  const address = getAddress(accounts[0]);

  const connectedChainId = (await provider.request({
    method: "eth_chainId",
  })) as string | number;

  const chainId = normalizeChainId(connectedChainId);
  let chain =
    options.chain && options.chain.id === chainId
      ? options.chain
      : getCachedChain(chainId);
  // Switch to chain if provided
  if (chainId && options?.chain && chainId !== options?.chain.id) {
    await switchChainCoinbaseWalletSDK(provider, options.chain);
    chain = options.chain;
  }

  return onConnect(address, chain, provider, emitter, options.client);
}

/**
 * @internal
 */
export async function autoConnectCoinbaseWalletSDK(
  options: WalletConnectionOption<typeof COINBASE>,
  emitter: WalletEmitter<typeof COINBASE>,
  provider: ProviderInterface,
): Promise<ReturnType<typeof onConnect>> {
  // connected accounts
  const addresses = (await provider.request({
    method: "eth_accounts",
  })) as string[];

  const address = addresses[0];

  if (!address) {
    throw new Error("No accounts found");
  }

  const connectedChainId = (await provider.request({
    method: "eth_chainId",
  })) as string | number;
  const chainId = normalizeChainId(connectedChainId);
  const chain =
    options.chain && options.chain.id === chainId
      ? options.chain
      : getCachedChain(chainId);

  return onConnect(address, chain, provider, emitter, options.client);
}

async function switchChainCoinbaseWalletSDK(
  provider: ProviderInterface,
  chain: Chain,
) {
  const chainIdHex = numberToHex(chain.id);

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (error) {
    const apiChain = await getChainMetadata(chain);

    // Indicates chain is not added to provider
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix later
    if ((error as any)?.code === 4902) {
      // try to add the chain
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            blockExplorerUrls: apiChain.explorers?.map((x) => x.url) || [],
            chainId: chainIdHex,
            chainName: apiChain.name,
            nativeCurrency: apiChain.nativeCurrency, // no client id on purpose here
            rpcUrls: getValidPublicRPCUrl(apiChain),
          },
        ],
      });
    }
  }
}
