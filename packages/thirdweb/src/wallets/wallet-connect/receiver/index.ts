import { SignClient } from "@walletconnect/sign-client";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { Prettify } from "../../../utils/type-utils.js";
import type { Wallet } from "../../interfaces/wallet.js";
import { getDefaultAppMetadata } from "../../utils/defaultDappMetadata.js";
import { DEFAULT_PROJECT_ID } from "../constants.js";
import { handleSendRawTransactionRequest } from "./request-handlers/send-raw-transaction.js";
import { handleSendTransactionRequest } from "./request-handlers/send-transaction.js";
import { handleSignTransactionRequest } from "./request-handlers/sign-transaction.js";
import { handleSignTypedDataRequest } from "./request-handlers/sign-typed-data.js";
import { handleSignRequest } from "./request-handlers/sign.js";
import { handleSwitchChain } from "./request-handlers/switch-chain.js";
import {
  getSessions,
  initializeSessionStore,
  removeSession,
} from "./session-store.js";
import type {
  WalletConnectAddEthereumChainRequestParams,
  WalletConnectClient,
  WalletConnectConfig,
  WalletConnectRequestHandlers,
  WalletConnectSession,
  WalletConnectSessionEvent,
  WalletConnectSessionProposalEvent,
  WalletConnectSessionRequestEvent,
} from "./types.js";

export type CreateWalletConnectClientOptions = Prettify<
  WalletConnectConfig & {
    /**
     * Your application's thirdweb client.
     */
    client: ThirdwebClient;

    /**
     * The wallet to connect to the WalletConnect URI.
     */
    wallet: Wallet;

    /**
     * Any chains to enable for the wallet. Apps can request access to specific chains, but this list will always be available for use with the wallet.
     */
    chains?: Chain[];

    /**
     * Custom RPC handlers to override the defaults. Useful when creating a custom approval UI.
     */
    requestHandlers?: WalletConnectRequestHandlers;

    /**
     * Callback triggered whenever a session is successfully created.
     */
    onConnect?: (session: WalletConnectSession) => void;

    /**
     * Callback triggered whenever a session is disconnected.
     */
    onDisconnect?: (session: WalletConnectSession) => void;

    /**
     * Callback for handling errors.
     */
    onError?: (error: Error) => void;
  }
>;

export type CreateWalletConnectSessionOptions = {
  /**
   * The WalletConnect client returned from `createWalletConnectClient`
   */
  walletConnectClient: WalletConnectClient;

  /**
   * The WalletConnect session URI retrieved from the application to connect with.
   */
  uri: string;
};

let walletConnectClientCache = new WeakMap<
  ThirdwebClient,
  WalletConnectClient
>();

/*
 * @internal
 */
export const clearWalletConnectClientCache = () => {
  walletConnectClientCache = new WeakMap<ThirdwebClient, WalletConnectClient>();
};

/**
 * Default request handlers for WalletConnect requests.
 */
export const DefaultWalletConnectRequestHandlers = {
  personal_sign: handleSignRequest,
  eth_sign: handleSignRequest,
  eth_signTypedData: handleSignTypedDataRequest,
  eth_signTypedData_v4: handleSignTypedDataRequest,
  eth_signTransaction: handleSignTransactionRequest,
  eth_sendTransaction: handleSendTransactionRequest,
  eth_sendRawTransaction: handleSendRawTransactionRequest,
  wallet_addEthereumChain: (_: {
    wallet: Wallet;
    params: WalletConnectAddEthereumChainRequestParams;
  }) => {
    throw new Error("Unsupported request method: wallet_addEthereumChain");
  },
  wallet_switchEthereumChain: handleSwitchChain,
};

/**
 * Creates a new WalletConnect client for interacting with another application.
 * @param options - The options to use to create the WalletConnect client.
 *
 * @returns The WalletConnect client. Use this client to connect to a WalletConnect URI with {@link createWalletConnectSession}.
 * @example
 * ```ts
 * import { createWalletConnectClient } from "thirdweb/wallets";
 *
 * const client = await createWalletConnectClient({
 *   wallet: wallet,
 *   client: client,
 * });
 * ```
 * Pass custom handlers:
 * ```ts
 * import { createWalletConnectClient } from "thirdweb/wallets";
 *
 * const client = await createWalletConnectClient({
 *   wallet: wallet,
 *   client: client,
 *   requestHandlers: {
 *     eth_signTransaction: ({ account, chainId, params }) => {
 *       // handle transaction signing
 *     },
 *   },
 * });
 * ```
 * Pass connect and disconnect callbacks:
 * ```ts
 * import { createWalletConnectClient } from "thirdweb/wallets";
 *
 * const client = await createWalletConnectClient({
 *   wallet: wallet,
 *   client: client,
 *   onConnect: (session) => {
 *     console.log("Connected to WalletConnect", session);
 *   },
 *   onDisconnect: (session) => {
 *     console.log("Disconnected from WalletConnect", session);
 *   },
 * });
 * ```
 * @wallets
 */
export async function createWalletConnectClient(
  options: CreateWalletConnectClientOptions,
): Promise<WalletConnectClient> {
  const { wallet, requestHandlers, chains, onConnect, onDisconnect } = options;

  if (walletConnectClientCache.has(options.client)) {
    return walletConnectClientCache.get(options.client) as WalletConnectClient;
  }

  initializeSessionStore({ clientId: options.client.clientId });

  const defaults = getDefaultAppMetadata();
  const walletConnectClient = await SignClient.init({
    projectId: options.projectId ?? DEFAULT_PROJECT_ID,
    metadata: {
      name: options.appMetadata?.name ?? defaults.name,
      url: options.appMetadata?.url ?? defaults.url,
      description: options.appMetadata?.description ?? defaults.description,
      icons: [options.appMetadata?.logoUrl ?? defaults.logoUrl],
    },
  });

  walletConnectClient.on(
    "session_proposal",
    async (event: WalletConnectSessionProposalEvent) => {
      const { onSessionProposal } = await import("./session-proposal.js");
      await onSessionProposal({
        wallet,
        walletConnectClient,
        event,
        chains,
        onConnect,
      }).catch((error) => {
        if (options.onError) {
          options.onError(error as Error);
        } else {
          throw error;
        }
      });
    },
  );

  walletConnectClient.on(
    "session_request",
    async (event: WalletConnectSessionRequestEvent) => {
      const { fulfillRequest } = await import("./session-request.js");
      await fulfillRequest({
        wallet,
        walletConnectClient,
        event,
        handlers: requestHandlers,
      }).catch((error) => {
        if (options.onError) {
          options.onError(error as Error);
        } else {
          throw error;
        }
      });
    },
  );

  walletConnectClient.on(
    "session_event",
    async (_event: WalletConnectSessionEvent) => {
      // TODO (accountsChanged, chainChanged)
    },
  );

  walletConnectClient.on(
    "session_ping",
    (_event: { id: number; topic: string }) => {
      // TODO
    },
  );

  walletConnectClient.on(
    "session_delete",
    async (event: { id: number; topic: string }) => {
      await disconnectWalletConnectSession({
        session: { topic: event.topic },
        walletConnectClient,
      }).catch((error) => {
        if (options.onError) {
          options.onError(error as Error);
        } else {
          throw error;
        }
      });
    },
  );

  // Disconnects can come from the user or the connected app, so we inject the callback to ensure its always triggered
  const _disconnect = walletConnectClient.disconnect;
  walletConnectClient.disconnect = async (args) => {
    const result = await _disconnect(args);
    if (onDisconnect) {
      disconnectHook({ topic: args.topic, onDisconnect });
    }
    return result;
  };

  walletConnectClientCache.set(options.client, walletConnectClient);

  return walletConnectClient;
}

/**
 * Initiates a new WalletConnect session for interacting with another application.
 * @param options - The options to use to create the WalletConnect session.
 * @example
 * ```ts
 * import { createWalletConnectClient, createWalletConnectSession } from "thirdweb/wallets";
 *
 * const client = await createWalletConnectClient({
 *   wallet: wallet,
 *   client: client,
 * });
 *
 * const session = await createWalletConnectSession({
 *   walletConnectClient: client,
 *   uri: "wc:...",
 * });
 * ```
 * @wallets
 */
export function createWalletConnectSession(
  options: CreateWalletConnectSessionOptions,
) {
  const { uri, walletConnectClient } = options;

  walletConnectClient.core.pairing.pair({ uri });
}

/**
 * Retrieves all active WalletConnect sessions.
 * @returns All active WalletConnect sessions.
 * @example
 * ```ts
 * import { getActiveWalletConnectSessions } from "thirdweb/wallets";
 *
 * const sessions = await getActiveWalletConnectSessions();
 * ```
 * @wallets
 */
export async function getActiveWalletConnectSessions(): Promise<
  WalletConnectSession[]
> {
  return getSessions();
}

/**
 * Disconnects a WalletConnect session.
 * @param options - The options to use to disconnect the WalletConnect session.
 * @example
 * ```ts
 * import { disconnectWalletConnectSession } from "thirdweb/wallets";
 *
 * await disconnectWalletConnectSession({
 *   session: mySession,
 *   walletConnectClient: wcClient,
 * });
 * ```
 * @wallets
 */
export async function disconnectWalletConnectSession(options: {
  session: WalletConnectSession;
  walletConnectClient: WalletConnectClient;
}): Promise<void> {
  try {
    await options.walletConnectClient.disconnect({
      topic: options.session.topic,
      reason: {
        code: 6000,
        message: "Disconnected",
      },
    });
  } catch {
    // ignore, the session doesn't exist already
  }
  removeSession(options.session);
}

/**
 * @internal
 */
async function disconnectHook(options: {
  topic: string;
  onDisconnect: (session: WalletConnectSession) => void;
}) {
  const { topic, onDisconnect } = options;
  const sessions = await getSessions();
  onDisconnect(
    sessions.find((s) => s.topic === topic) ?? {
      topic,
    },
  );
}
