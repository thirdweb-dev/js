import type { Account, Wallet } from "../../interfaces/wallet.js";
import { disconnectWalletConnectSession } from "./index.js";
import { getSessions, saveSession } from "./session-store.js";
import type { WalletConnectClient } from "./types.js";
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
  onConnect?: (session: WalletConnectSession) => void;
}) {
  const { wallet, walletConnectClient, event, onConnect } = options;

  const account = wallet.getAccount();
  if (!account) {
    throw new Error("[WalletConnect] No account connected to provided wallet");
  }

  const origin = event.verifyContext?.verified?.origin;
  if (origin) {
    await disconnectExistingSessions({ origin, walletConnectClient });
  }
  const session = await acceptSessionProposal({
    account,
    walletConnectClient,
    sessionProposal: event,
  });

  await saveSession(session);

  wallet.subscribe("disconnect", () => {
    disconnectWalletConnectSession({ session, walletConnectClient });
  });

  onConnect?.(session);
}

/**
 * @internal
 */
export async function disconnectExistingSessions({
  walletConnectClient,
  origin,
}: { walletConnectClient: WalletConnectClient; origin: string }) {
  const sessions = await getSessions();
  for (const session of sessions) {
    if (session.origin === origin) {
      await disconnectWalletConnectSession({ session, walletConnectClient });
    }
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
  sessionProposal: WalletConnectSessionProposalEvent;
}): Promise<WalletConnectSession> {
  if (!sessionProposal.params.requiredNamespaces.eip155) {
    throw new Error(
      "[WalletConnect] No EIP155 namespace found in Wallet Connect session proposal",
    );
  }

  if (!sessionProposal.params.requiredNamespaces.eip155.chains) {
    throw new Error(
      "[WalletConnect] No chains found in EIP155 Wallet Connect session proposal namespace",
    );
  }

  const namespaces = {
    chains: [
      ...sessionProposal.params.requiredNamespaces.eip155.chains.map(
        (chain: string) => `${chain}:${account.address}`,
      ),
      ...(sessionProposal.params.optionalNamespaces?.eip155?.chains?.map(
        (chain: string) => `${chain}:${account.address}`,
      ) ?? []),
    ],
    methods: [
      ...sessionProposal.params.requiredNamespaces.eip155.methods,
      ...(sessionProposal.params.optionalNamespaces?.eip155?.methods ?? []),
    ],
    events: [
      ...sessionProposal.params.requiredNamespaces.eip155.events,
      ...(sessionProposal.params.optionalNamespaces?.eip155?.events ?? []),
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
  return {
    topic: session.topic,
    origin: sessionProposal.verifyContext?.verified?.origin || "Unknown origin",
  };
}
