import { SignClient } from "@walletconnect/sign-client";
import type { ThirdwebClient } from "../../../client/client.js";
import type { Prettify } from "../../../utils/type-utils.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import { getDefaultAppMetadata } from "../../utils/defaultDappMetadata.js";
import { DEFAULT_PROJECT_ID } from "../constants.js";
import {
  getSessions,
  initializeSessionStore,
  removeSession,
} from "./session-store.js";
import type {
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

  /**
   * Callback triggered when the session is successfully created.
   */
  onConnect?: (session: WalletConnectSession) => void;
};

/**
 * Creates a new WalletConnect client for interacting with another application.
 * @param options - The options to use to create the WalletConnect client.
 *
 * @returns The WalletConnect client. Use this client to connect to a WalletConnect URI with {@link createWalletConnectSession}.
 * @example
 * ```ts
 * import { createWalletConnectClient } from "thirdweb/wallets/wallet-connect";
 *
 * const client = await createWalletConnectClient({
 *   wallet: wallet,
 *   client: client,
 * });
 * ```
 * Pass custom handlers:
 * ```ts
 * import { createWalletConnectClient } from "thirdweb/wallets/wallet-connect";
 *
 * const client = await createWalletConnectClient({
 *   wallet: wallet,
 *   client: client,
 *   requestHandlers: {
 *     eth_signTransaction: ({ transaction }) => {
 *       // handle transaction signing
 *     },
 *   },
 * });
 * ```
 * Pass connect and disconnect callbacks:
 * ```ts
 * import { createWalletConnectClient } from "thirdweb/wallets/wallet-connect";
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
  const { wallet, requestHandlers, onConnect, onDisconnect } = options;

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
      onSessionProposal({
        wallet,
        walletConnectClient,
        event,
        onConnect,
      });
    },
  );

  walletConnectClient.on(
    "session_request",
    async (event: WalletConnectSessionRequestEvent) => {
      const { fulfillRequest } = await import("./session-request.js");
      fulfillRequest({
        wallet,
        walletConnectClient,
        event,
        handlers: requestHandlers,
      });
    },
  );

  walletConnectClient.on(
    "session_event",
    async (_event: WalletConnectSessionEvent) => {
      // TODO
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

  return walletConnectClient;
}

/**
 * Initiates a new WalletConnect session for interacting with another application.
 * @param options - The options to use to create the WalletConnect session.
 * @example
 * ```ts
 * import { createWalletConnectClient, createWalletConnectSession } from "thirdweb/wallets/wallet-connect";
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
 * import { getActiveWalletConnectSessions } from "thirdweb/wallets/wallet-connect";
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
 * import { disconnectWalletConnectSession } from "thirdweb/wallets/wallet-connect";
 *
 * await disconnectWalletConnectSession({
 *   session: { topic: "..." },
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
        message: "Replaced by new session",
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
