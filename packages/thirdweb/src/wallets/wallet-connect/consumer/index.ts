import { SignClient } from "@walletconnect/sign-client";
import type { Prettify } from "../../../utils/type-utils.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import { getDefaultAppMetadata } from "../../utils/defaultDappMetadata.js";
import { DEFAULT_PROJECT_ID } from "../constants.js";
import type {
  WalletConnectConfig,
  WalletConnectRequestHandlers,
  WalletConnectSession,
  WalletConnectSessionEvent,
  WalletConnectSessionProposalEvent,
  WalletConnectSessionRequestEvent,
} from "./types.js";

export type WalletConnectClient = Awaited<ReturnType<typeof SignClient.init>>;

export type CreateWalletConnectSessionOptions = Prettify<
  WalletConnectConfig & {
    /**
     * The thirdweb wallet that will be connected to the WalletConnect session.
     */
    wallet: Wallet;

    /**
     * The WalletConnect client returned from `createWalletConnectClient`
     */
    walletConnectClient: WalletConnectClient;

    /**
     * Custom request handlers for wallet RPC requests.
     */
    requestHandlers?: WalletConnectRequestHandlers;

    /**
     * The WalletConnect session URI retrieved from the dApp to connect with.
     */
    uri: string;
  }
>;

export const walletConnectSessions: WeakMap<Wallet, WalletConnectSession> =
  new WeakMap();

export async function createWalletConnectClient(
  options?: WalletConnectConfig,
): Promise<WalletConnectClient> {
  const defaults = getDefaultAppMetadata();
  return await SignClient.init({
    projectId: options?.projectId ?? DEFAULT_PROJECT_ID,
    metadata: {
      name: options?.appMetadata?.name ?? defaults.name,
      url: options?.appMetadata?.url ?? defaults.url,
      description: options?.appMetadata?.description ?? defaults.description,
      icons: [options?.appMetadata?.logoUrl ?? defaults.logoUrl],
    },
  });
}

export function createWalletConnectSession(
  options: CreateWalletConnectSessionOptions,
) {
  const { uri, walletConnectClient, wallet, requestHandlers } = options;

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

  walletConnectClient.core.pairing.pair({ uri });
}

export function hasActiveWalletConnectSession(wallet: Wallet): boolean {
  return walletConnectSessions.has(wallet);
}

export function getActiveWalletConnectSession(
  wallet: Wallet,
): WalletConnectSession | undefined {
  return walletConnectSessions.get(wallet);
}
