import {
  type CoinbaseWalletProvider,
  CoinbaseWalletSDK,
} from "@coinbase/wallet-sdk";
import type { Address } from "abitype";
import {
  type SignTypedDataParameters,
  getTypesForEIP712Domain,
  validateTypedData,
} from "viem";
import { stringify } from "../../utils/json.js";
import type { Ethereum } from "../interfaces/ethereum.js";
import type { Account } from "../interfaces/wallet.js";
import type { SendTransactionOption } from "../interfaces/wallet.js";
import type { AppMetadata, DisconnectFn, SwitchChainFn } from "../types.js";
import { getValidPublicRPCUrl } from "../utils/chains.js";
import { normalizeChainId } from "../utils/normalizeChainId.js";

import { ethereum } from "../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../chains/types.js";
import { defineChain, getChainMetadata } from "../../chains/utils.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getAddress } from "../../utils/address.js";
import {
  type Hex,
  isHex,
  numberToHex,
  stringToHex,
  uint8ArrayToHex,
} from "../../utils/encoding/hex.js";
import { getDefaultAppMetadata } from "../utils/defaultDappMetadata.js";
import type { WalletEmitter } from "../wallet-emitter.js";

/**
 * Options for connecting to the CoinbaseSDK Wallet
 */
export type CoinbaseSDKWalletConnectionOptions = {
  /**
   * The Thirdweb client object
   */
  client: ThirdwebClient;

  /**
   * Whether to use Dark theme in the Coinbase Wallet "Onboarding Overlay" popup.
   *
   * This popup is opened when `headlessMode` is set to `true`.
   */
  darkMode?: boolean;

  /**
   * Whether to open Coinbase "Onboarding Overlay" popup or not when connecting to the wallet.
   * By default it is enabled if Coinbase Wallet extension is NOT installed and prompts the users to connect to the Coinbase Wallet mobile app by scanning a QR code
   *
   * If you want to render the QR code yourself, you should set this to `false` and use the `onUri` callback to get the QR code URI and render it in your app.
   * ```ts
   * const account = await wallet.connect({
   *  headlessMode: false,
   *  onUri: (uri) => {
   *    // render the QR code with `uri`
   *    // when user scans the QR code with Coinbase Wallet app, the promise will resolve with the connected account
   *  }
   * })
   * ```
   */
  headlessMode?: boolean;

  /**
   * Whether or not to reload dapp automatically after disconnect, defaults to `true`
   */
  reloadOnDisconnect?: boolean;

  /**
   * If you want the wallet to be connected to a specific blockchain, you can pass a `Chain` object to the `connect` method.
   * This will trigger a chain switch if the wallet provider is not already connected to the specified chain.
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain.
   *
   * ```ts
   * import { defineChain } from "thirdweb";
   * const mumbai = defineChain({
   *  id: 80001,
   * });
   *
   * const address = await wallet.connect({ chain: mumbai })
   */
  chain?: Chain;

  /**
   * This is only relevant when the Coinbase Extension is not installed and you do not want to use the default Coinbase Wallet "Onboarding Overlay" popup.
   *
   * If you want to render the QR code yourself, you need to set `headlessMode` to `false` and use the `onUri` callback to get the QR code URI and render it in your app.
   * ```ts
   * const account = await wallet.connect({
   *  headlessMode: false,
   *  onUri: (uri) => {
   *    // render the QR code with `uri`
   *    // when user scans the QR code with Coinbase Wallet app, the promise will resolve with the connected account
   *  }
   * })
   * ```
   * Callback to be called with QR code URI
   * @param uri - The URI for rendering QR code
   */
  onUri?: (uri: string | undefined) => void;
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
};

async function initProvider(options: CoinbaseSDKWalletConnectionOptions) {
  const client = new CoinbaseWalletSDK({
    ...options,
    appName: options.appMetadata?.name || getDefaultAppMetadata().name,
  });

  if (options.onUri) {
    options.onUri(client.getQrUrl() || undefined);
  }

  const chain = options?.chain || ethereum;

  return client.makeWeb3Provider(chain.rpc, chain.id);
}

function onConnect(
  address: string,
  chain: Chain,
  provider: CoinbaseWalletProvider,
  emitter: WalletEmitter<"com.coinbase.wallet">,
): [Account, Chain, DisconnectFn, SwitchChainFn] {
  const account: Account = {
    address,
    async sendTransaction(tx: SendTransactionOption) {
      const transactionHash = (await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            accessList: tx.accessList,
            value: tx.value ? numberToHex(tx.value) : undefined,
            gas: tx.gas ? numberToHex(tx.gas) : undefined,
            from: this.address,
            to: tx.to as Address,
            data: tx.data,
          },
        ],
      })) as Hex;

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

      return await provider.request({
        method: "personal_sign",
        params: [messageToSign, account.address],
      });
    },
    async signTypedData(typedData) {
      if (!account.address) {
        throw new Error("Provider not setup");
      }
      const { domain, message, primaryType } =
        typedData as unknown as SignTypedDataParameters;

      const types = {
        EIP712Domain: getTypesForEIP712Domain({ domain }),
        ...typedData.types,
      };

      // Need to do a runtime validation check on addresses, byte ranges, integer ranges, etc
      // as we can't statically check this with TypeScript.
      validateTypedData({ domain, message, primaryType, types });

      const stringifiedData = stringify(
        { domain: domain ?? {}, message, primaryType, types },
        (_, value) => (isHex(value) ? value.toLowerCase() : value),
      );

      return await provider.request({
        method: "eth_signTypedData_v4",
        params: [account.address, stringifiedData],
      });
    },
  };

  async function disconnect() {
    provider.removeListener("accountsChanged", onAccountsChanged);
    provider.removeListener("chainChanged", onChainChanged);
    provider.removeListener("disconnect", onDisconnect);
    provider.disconnect();
    await provider.close();
  }

  function onDisconnect() {
    disconnect();
    emitter.emit("disconnect", undefined);
  }

  function onAccountsChanged(accounts: string[]) {
    if (accounts[0]) {
      const newAccount = {
        ...account,
        address: getAddress(accounts[0]),
      };
      emitter.emit("accountChanged", newAccount);
      emitter.emit("accountsChanged", accounts);
    } else {
      onDisconnect();
    }
  }

  function onChainChanged(newChainId: string) {
    const newChain = defineChain(normalizeChainId(newChainId));
    emitter.emit("chainChanged", newChain);
  }

  // subscribe to events
  provider.on("accountsChanged", onAccountsChanged);
  provider.on("chainChanged", onChainChanged);
  provider.on("disconnect", onDisconnect);

  return [
    account,
    chain,
    disconnect,
    (newChain) => switchChainCoinbaseWalletSDK(provider, newChain),
  ];
}

/**
 * @internal
 */
export async function connectCoinbaseWalletSDK(
  options: CoinbaseSDKWalletConnectionOptions,
  emitter: WalletEmitter<"com.coinbase.wallet">,
): Promise<ReturnType<typeof onConnect>> {
  const provider = await initProvider(options);

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
  let chain = defineChain(chainId);
  // Switch to chain if provided
  if (
    connectedChainId &&
    options?.chain &&
    connectedChainId !== options?.chain.id
  ) {
    await switchChainCoinbaseWalletSDK(provider, options.chain);
    chain = options.chain;
  }

  return onConnect(address, chain, provider, emitter);
}

/**
 * @internal
 */
export async function autoConnectCoinbaseWalletSDK(
  options: CoinbaseSDKWalletConnectionOptions,
  emitter: WalletEmitter<"com.coinbase.wallet">,
): Promise<ReturnType<typeof onConnect>> {
  const provider = await initProvider(options);

  // connected accounts
  const addresses = await (provider as Ethereum).request({
    method: "eth_accounts",
  });

  const address = addresses[0];

  if (!address) {
    throw new Error("No accounts found");
  }

  const connectedChainId = (await provider.request({
    method: "eth_chainId",
  })) as string | number;
  const chainId = normalizeChainId(connectedChainId);
  const chain = defineChain(chainId);

  return onConnect(address, chain, provider, emitter);
}

async function switchChainCoinbaseWalletSDK(
  provider: CoinbaseWalletProvider,
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
            chainId: chainIdHex,
            chainName: apiChain.name,
            nativeCurrency: apiChain.nativeCurrency,
            rpcUrls: getValidPublicRPCUrl(apiChain), // no client id on purpose here
            blockExplorerUrls: apiChain.explorers?.map((x) => x.url) || [],
          },
        ],
      });
    }
  }
}
