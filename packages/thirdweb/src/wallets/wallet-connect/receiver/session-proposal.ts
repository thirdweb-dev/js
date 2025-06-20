import type { Chain } from "../../../chains/types.js";
import type { Account, Wallet } from "../../interfaces/wallet.js";
import { disconnectWalletConnectSession } from "./index.js";
import { getSessions, saveSession } from "./session-store.js";
import type {
  WalletConnectClient,
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
  chains?: Chain[];
  onConnect?: (session: WalletConnectSession) => void;
}) {
  const { wallet, walletConnectClient, event, chains, onConnect } = options;

  const account = wallet.getAccount();
  if (!account) {
    throw new Error("No account connected to provided wallet");
  }

  const origin = event.verifyContext?.verified?.origin;
  if (origin) {
    await disconnectExistingSessions({ origin, walletConnectClient });
  }
  const session = await acceptSessionProposal({
    account,
    chains,
    sessionProposal: event,
    walletConnectClient,
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
}: {
  walletConnectClient: WalletConnectClient;
  origin: string;
}) {
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
  chains,
}: {
  account: Account;
  walletConnectClient: WalletConnectClient;
  sessionProposal: WalletConnectSessionProposalEvent;
  chains?: Chain[];
}): Promise<WalletConnectSession> {
  if (
    !sessionProposal.params.requiredNamespaces?.eip155 &&
    !sessionProposal.params.optionalNamespaces?.eip155
  ) {
    throw new Error(
      "No EIP155 namespace found in Wallet Connect session proposal",
    );
  }

  const namespaces = {
    chains: [
      ...Array.from(
        new Set([
          ...(sessionProposal.params.requiredNamespaces?.eip155?.chains?.map(
            (chain: string) => `${chain}:${account.address}`,
          ) ?? []),
          ...(sessionProposal.params.optionalNamespaces?.eip155?.chains?.map(
            (chain: string) => `${chain}:${account.address}`,
          ) ?? []),
          ...(chains?.map((chain) => `eip155:${chain.id}:${account.address}`) ??
            []),
        ]),
      ),
    ],
    events: [
      ...(sessionProposal.params.requiredNamespaces?.eip155?.events ?? []),
      ...(sessionProposal.params.optionalNamespaces?.eip155?.events ?? []),
    ],
    methods: [
      ...(sessionProposal.params.requiredNamespaces?.eip155?.methods ?? []),
      ...(sessionProposal.params.optionalNamespaces?.eip155?.methods ?? []),
    ],
  };
  const approval = await walletConnectClient.approve({
    id: sessionProposal.id,
    namespaces: {
      eip155: {
        accounts: namespaces.chains,
        events: namespaces.events,
        methods: namespaces.methods,
      },
    },
  });

  const session = await approval.acknowledged();
  return {
    origin: sessionProposal.verifyContext?.verified?.origin || "Unknown origin",
    topic: session.topic,
  };
}
