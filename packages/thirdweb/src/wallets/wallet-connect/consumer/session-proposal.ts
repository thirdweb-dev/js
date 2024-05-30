import type { Account, Wallet } from "../../interfaces/wallet.js";
import {
  type WalletConnectClient,
  getActiveWalletConnectSession,
  hasActiveWalletConnectSession,
  walletConnectSessions,
} from "./index.js";
import type {
  WalletConnectSession,
  WalletConnectSessionProposalEvent,
} from "./types.js";

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

  walletConnectSessions.set(wallet, session);
}

/**
 * @internal
 */
export async function disconnectExistingSession({
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

/**
 * @internal
 */
export async function acceptSessionProposal({
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
