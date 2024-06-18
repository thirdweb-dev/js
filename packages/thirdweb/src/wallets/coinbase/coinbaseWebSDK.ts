import type { ProviderInterface } from "@coinbase/wallet-sdk";
import type { Address } from "abitype";
import {
  type SignTypedDataParameters,
  getTypesForEIP712Domain,
  serializeTypedData,
  validateTypedData,
} from "viem";
import type { Account, Wallet } from "../interfaces/wallet.js";
import type { SendTransactionOption } from "../interfaces/wallet.js";
import type { AppMetadata, DisconnectFn, SwitchChainFn } from "../types.js";
import { getValidPublicRPCUrl } from "../utils/chains.js";
import { normalizeChainId } from "../utils/normalizeChainId.js";

import type { Preference } from "@coinbase/wallet-sdk/dist/core/provider/interface.js";
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
import { parseTypedData } from "../../utils/signatures/helpers/parseTypedData.js";
import { COINBASE } from "../constants.js";
import type {
  GetCallsStatusResponse,
  WalletCapabilities,
  WalletCapabilitiesRecord,
  WalletSendCallsId,
  WalletSendCallsParameters,
} from "../eip5792/types.js";
import { getDefaultAppMetadata } from "../utils/defaultDappMetadata.js";
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
    const { CoinbaseWalletSDK } = await import("@coinbase/wallet-sdk");
    const client = new CoinbaseWalletSDK({
      appName: options?.appMetadata?.name || getDefaultAppMetadata().name,
      appChainIds: options?.chains
        ? options.chains.map((c) => c.id)
        : undefined,
      appLogoUrl:
        options?.appMetadata?.logoUrl || getDefaultAppMetadata().logoUrl,
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

/**
 * @internal
 */
export async function coinbaseSDKWalletGetCapabilities(args: {
  wallet: Wallet<typeof COINBASE>;
}) {
  const { wallet } = args;

  const account = wallet.getAccount();
  if (!account) {
    return {
      message: `Can't get capabilities, no account connected for wallet: ${wallet.id}`,
    };
  }

  const config = wallet.getConfig();
  const provider = await getCoinbaseWebProvider(config);
  try {
    return (await provider.request({
      method: "wallet_getCapabilities",
      params: [account.address],
    })) as WalletCapabilitiesRecord<WalletCapabilities, number>;
  } catch (error: unknown) {
    if (/unsupport|not support/i.test((error as Error).message)) {
      return {
        message: `${wallet.id} does not support wallet_getCapabilities, reach out to them directly to request EIP-5792 support.`,
      };
    }
    throw error;
  }
}

/**
 * @internal
 */
export async function coinbaseSDKWalletSendCalls(args: {
  wallet: Wallet<typeof COINBASE>;
  params: WalletSendCallsParameters;
}) {
  const { wallet, params } = args;

  const config = wallet.getConfig();
  const provider = await getCoinbaseWebProvider(config);

  try {
    return (await provider.request({
      method: "wallet_sendCalls",
      params,
    })) as WalletSendCallsId;
  } catch (error) {
    if (/unsupport|not support/i.test((error as Error).message)) {
      throw new Error(
        `${wallet.id} does not support wallet_sendCalls, reach out to them directly to request EIP-5792 support.`,
      );
    }
    throw error;
  }
}

/**
 * @internal
 */
export async function coinbaseSDKWalletShowCallsStatus(args: {
  wallet: Wallet<typeof COINBASE>;
  bundleId: string;
}) {
  const { wallet, bundleId } = args;

  const provider = await getCoinbaseWebProvider(wallet.getConfig());

  try {
    return await provider.request({
      method: "wallet_showCallsStatus",
      params: [bundleId],
    });
  } catch (error: unknown) {
    if (/unsupport|not support/i.test((error as Error).message)) {
      throw new Error(
        `${wallet.id} does not support wallet_showCallsStatus, reach out to them directly to request EIP-5792 support.`,
      );
    }
    throw error;
  }
}

/**
 * @internal
 */
export async function coinbaseSDKWalletGetCallsStatus(args: {
  wallet: Wallet<typeof COINBASE>;
  bundleId: string;
}) {
  const { wallet, bundleId } = args;

  const config = wallet.getConfig();
  const provider = await getCoinbaseWebProvider(config);

  return provider.request({
    method: "wallet_getCallsStatus",
    params: [bundleId],
  }) as Promise<GetCallsStatusResponse>;
}

function createAccount(provider: ProviderInterface, address: string) {
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
    async signTypedData(_typedData) {
      if (!account.address) {
        throw new Error("Provider not setup");
      }
      const typedData = parseTypedData(_typedData);
      const { domain, message, primaryType } =
        typedData as unknown as SignTypedDataParameters;

      const types = {
        EIP712Domain: getTypesForEIP712Domain({ domain }),
        ...typedData.types,
      };

      // Need to do a runtime validation check on addresses, byte ranges, integer ranges, etc
      // as we can't statically check this with TypeScript.
      validateTypedData({ domain, message, primaryType, types });

      const stringifiedData = serializeTypedData({
        domain: domain ?? {},
        message,
        primaryType,
        types,
      });

      return await provider.request({
        method: "eth_signTypedData_v4",
        params: [account.address, stringifiedData],
      });
    },
    onTransactionRequested: async () => {
      // make sure to show the coinbase popup BEFORE doing any transaction preprocessing
      // otherwise the popup might get blocked in safari
      await showCoinbasePopup(provider);
    },
  };

  return account;
}

function onConnect(
  address: string,
  chain: Chain,
  provider: ProviderInterface,
  emitter: WalletEmitter<typeof COINBASE>,
): [Account, Chain, DisconnectFn, SwitchChainFn] {
  const account = createAccount(provider, address);

  async function disconnect() {
    provider.removeListener("accountsChanged", onAccountsChanged);
    provider.removeListener("chainChanged", onChainChanged);
    provider.removeListener("disconnect", onDisconnect);
    await provider.disconnect();
  }

  function onDisconnect() {
    disconnect();
    emitter.emit("disconnect", undefined);
  }

  function onAccountsChanged(accounts: string[]) {
    if (accounts[0]) {
      const newAccount = createAccount(provider, getAddress(accounts[0]));
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
    disconnect,
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

  return onConnect(address, chain, provider, emitter);
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
