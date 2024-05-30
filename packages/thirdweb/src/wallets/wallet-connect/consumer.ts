import { SignClient } from "@walletconnect/sign-client";
import { hexToNumber } from "viem";
import { hexToBigInt } from "../../utils/encoding/hex.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { getDefaultAppMetadata } from "../utils/defaultDappMetadata.js";
import { DEFAULT_PROJECT_ID } from "./constants.js";
import type {
  WalletConnectConfig,
  WalletConnectSession,
  WalletConnectSessionEvent,
  WalletConnectSessionProposalEvent,
  WalletConnectSessionRequestEvent,
  WalletConnectSignRequestPrams,
  WalletConnectSignTransactionRequestParams,
  WalletConnectSignTypedDataRequestParams,
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
  const { uri, walletConnectClient, wallet } = options;

  walletConnectClient.on(
    "session_proposal",
    async (event: WalletConnectSessionProposalEvent) => {
      onSessionProposal({ wallet, walletConnectClient, event });
    },
  );

  walletConnectClient.on(
    "session_request",
    async (event: WalletConnectSessionRequestEvent) => {
      console.log("Received session request", event);
      fulfillRequest({ wallet, walletConnectClient, event });
    },
  );

  walletConnectClient.on(
    "session_event",
    async (event: WalletConnectSessionEvent) => {
      console.log("Received session event", event);
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

/**
 * @internal
 */
export async function onSessionProposal(options: {
  wallet: Wallet;
  walletConnectClient: WalletConnectClient;
  event: WalletConnectSessionProposalEvent;
}) {
  const { wallet, walletConnectClient, event } = options;
  const account = wallet.getAccount();
  if (!account) {
    throw new Error("[WalletConnect] No account connected to provided wallet");
  }

  await disconnectExistingSession({ wallet, walletConnectClient });
  const session = await acceptSessionProposal({
    account,
    walletConnectClient,
    sessionProposal: event.params,
  });
  console.log("Session", session);
  walletConnectSessions.set(wallet, session);
}

/**
 * @internal
 */
export async function fulfillRequest(options: {
  wallet: Wallet;
  walletConnectClient: WalletConnectClient;
  event: WalletConnectSessionRequestEvent;
}) {
  const {
    wallet,
    walletConnectClient,
    event: {
      topic,
      id,
      params: { request },
    },
  } = options;
  const account = wallet.getAccount();
  if (!account) {
    throw new Error("[WalletConnect] No account connected to provided wallet");
  }

  let result: unknown;
  switch (request.method) {
    case "personal_sign":
    case "eth_sign": {
      const signParams = request.params as WalletConnectSignRequestPrams; // WalletConnect only gives us an any back so we have to assume this
      if (account.address !== signParams[1]) {
        throw new Error(
          `[WalletConnect] Active account address (${account.address}) differs from requested address (${signParams[1]})`,
        );
      }
      result = await account.signMessage({ message: signParams[0] });
      break;
    }
    case "eth_signTypedData":
    case "eth_signTypedData_v4": {
      const signTypedDataParams =
        request.params as WalletConnectSignTypedDataRequestParams;
      if (account.address !== signTypedDataParams[0]) {
        throw new Error(
          `[WalletConnect] Active account address (${account.address}) differs from requested address (${signTypedDataParams[0]})`,
        );
      }

      result = await account.signTypedData(
        typeof signTypedDataParams[1] === "string"
          ? JSON.parse(signTypedDataParams[1])
          : signTypedDataParams[1],
      );
      break;
    }
    case "eth_signTransaction": {
      if (!account.signTransaction) {
        throw new Error(
          "[WalletConnect] The current account does not support signing transactions",
        );
      }
      const transaction = (
        request.params as WalletConnectSignTransactionRequestParams
      )[0];
      result = await account.signTransaction({
        gas: hexToBigInt(transaction.gas),
        gasPrice: hexToBigInt(transaction.gasPrice),
        value: hexToBigInt(transaction.value),
        nonce: hexToNumber(transaction.nonce),
        to: transaction.to,
        data: transaction.data,
      });
      break;
    }
    default:
      throw new Error(
        `[WalletConnect] Unsupported request method: ${request.method}`,
      );
  }

  walletConnectClient.respond({
    topic,
    response: {
      id,
      jsonrpc: "2.0",
      result,
    },
  });
}

async function disconnectExistingSession({
  wallet,
  walletConnectClient,
}: { wallet: Wallet; walletConnectClient: WalletConnectClient }) {
  if (hasActiveWalletConnectSession(wallet)) {
    const existingSession = getActiveWalletConnectSession(
      wallet,
    ) as WalletConnectSession;

    await walletConnectClient.disconnect({
      topic: existingSession.topic,
      reason: { code: 6000, message: "New session" }, // Code 6000 is user disconnected
    });

    walletConnectSessions.delete(wallet);
  }
}

async function acceptSessionProposal({
  account,
  walletConnectClient,
  sessionProposal,
}: {
  account: Account;
  walletConnectClient: WalletConnectClient;
  sessionProposal: WalletConnectSessionProposalEvent["params"];
}): Promise<WalletConnectSession> {
  if (!sessionProposal.requiredNamespaces.eip155) {
    throw new Error(
      "[WalletConnect] No EIP155 namespace found in Wallet Connect session proposal",
    );
  }

  if (!sessionProposal.requiredNamespaces.eip155.chains) {
    throw new Error(
      "[WalletConnect] No chains found in EIP155 Wallet Connect session proposal namespace",
    );
  }

  const namespaces = {
    chains: [
      ...sessionProposal.requiredNamespaces.eip155.chains.map(
        (chain: string) => `${chain}:${account.address}`,
      ),
      ...(sessionProposal.optionalNamespaces?.eip155?.chains?.map(
        (chain: string) => `${chain}:${account.address}`,
      ) ?? []),
    ],
    methods: [
      ...sessionProposal.requiredNamespaces.eip155.methods,
      ...(sessionProposal.optionalNamespaces?.eip155?.methods ?? []),
    ],
    events: [
      ...sessionProposal.requiredNamespaces.eip155.events,
      ...(sessionProposal.optionalNamespaces?.eip155?.events ?? []),
    ],
  };
  const approval = await walletConnectClient.approve({
    id: sessionProposal.id,
    namespaces: {
      eip155: {
        accounts: namespaces.chains,
        methods: namespaces.methods,
        events: namespaces.events,
      },
    },
  });

  const session = await approval.acknowledged();
  return session;
}
