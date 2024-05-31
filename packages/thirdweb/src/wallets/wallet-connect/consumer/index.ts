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
  WalletConnectConfig,
  WalletConnectRequestHandlers,
  WalletConnectSession,
  WalletConnectSessionEvent,
  WalletConnectSessionProposalEvent,
  WalletConnectSessionRequestEvent,
} from "./types.js";

export type WalletConnectClient = Awaited<ReturnType<typeof SignClient.init>>;

export type CreateWalletConnectSessionOptions = {
  /**
   * The WalletConnect client returned from `createWalletConnectClient`
   */
  walletConnectClient: WalletConnectClient;

  /**
   * The WalletConnect session URI retrieved from the dApp to connect with.
   */
  uri: string;
};

export async function createWalletConnectClient(
  options: Prettify<
    WalletConnectConfig & {
      client: ThirdwebClient;
      wallet: Wallet;
      requestHandlers?: WalletConnectRequestHandlers;
    }
  >,
): Promise<WalletConnectClient> {
  const { wallet, requestHandlers } = options;

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
      onSessionProposal({ wallet, walletConnectClient, event });
    },
  );

  walletConnectClient.on(
    "session_request",
    async (event: WalletConnectSessionRequestEvent) => {
      const { fulfillRequest } = await import("./session-request.js");
      console.log("Received session request", event);
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
      console.log("Received session event", _event);
      // TODO
    },
  );

  walletConnectClient.on(
    "session_ping",
    (event: { id: number; topic: string }) => {
      console.log("Received session ping", event);
      // TODO
    },
  );

  walletConnectClient.on(
    "session_delete",
    (event: { id: number; topic: string }) => {
      console.log("Received session delete", event);
      removeSession({
        topic: event.topic,
      });
    },
  );

  return walletConnectClient;
}

export function createWalletConnectSession(
  options: CreateWalletConnectSessionOptions,
) {
  const { uri, walletConnectClient } = options;

  walletConnectClient.core.pairing.pair({ uri });
}

export async function getActiveWalletConnectSessions() {
  return getSessions();
}

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
