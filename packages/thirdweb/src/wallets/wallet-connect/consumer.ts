import { SignClient } from "@walletconnect/sign-client";
import type { WalletConnectConfig, WalletConnectSession, WalletConnectSessionProposalEvent } from "./types.js";
import { getDefaultAppMetadata } from "../utils/defaultDappMetadata.js";
import { DEFAULT_PROJECT_ID } from "./constants.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import type { Prettify } from "../../utils/type-utils.js";

export type WalletConnectClient = Awaited<ReturnType<typeof SignClient.init>>;

export type CreateWalletConnectSessionOptions = Prettify<WalletConnectConfig & {
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
}>;

export const walletConnectSessions: WeakMap<Wallet, WalletConnectSession> = new WeakMap();

export async function createWalletConnectClient(options?: WalletConnectConfig): Promise<WalletConnectClient> {
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

export function createWalletConnectSession(options: CreateWalletConnectSessionOptions) {
    const { uri, walletConnectClient, wallet } = options;
    
    walletConnectClient.on("session_proposal", async (event: WalletConnectSessionProposalEvent) => {
        onSessionProposal({ wallet, walletConnectClient, event });
    });

    walletConnectClient.core.pairing.pair({ uri });
}

export function hasActiveWalletConnectSession(wallet: Wallet): boolean {
    return walletConnectSessions.has(wallet);
}

export function getActiveWalletConnectSession(wallet: Wallet): WalletConnectSession | undefined {
    return walletConnectSessions.get(wallet);
}

/**
 * @internal
 */
export async function onSessionProposal(options: {wallet: Wallet, walletConnectClient: WalletConnectClient, event: WalletConnectSessionProposalEvent}) {
    const { wallet, walletConnectClient, event } = options;
    const account = wallet.getAccount();
    if (!account) {
        throw new Error("onSessionProposal: No account connected to provided wallet");
    }

    await disconnectExistingSession({ wallet, walletConnectClient });
    const session = await acceptSessionProposal({ account, walletConnectClient, sessionProposal: event.params });

    walletConnectSessions.set(wallet, session);
}

/**
 * @internal
 */
async function disconnectExistingSession({ wallet, walletConnectClient }: { wallet: Wallet, walletConnectClient: WalletConnectClient }) {
    if (hasActiveWalletConnectSession(wallet)) {
        const existingSession = getActiveWalletConnectSession(wallet) as WalletConnectSession;

        await walletConnectClient.disconnect({
            topic: existingSession.topic,
            reason: { code: 6000, message: "New session" } // Code 6000 is user disconnected
        });

        walletConnectSessions.delete(wallet);
    }
}

/**
 * @internal
 */
async function acceptSessionProposal({ account, walletConnectClient, sessionProposal }: { account: Account, walletConnectClient: WalletConnectClient, sessionProposal: WalletConnectSessionProposalEvent["params"] }): Promise<WalletConnectSession> {
    if (!sessionProposal.requiredNamespaces.eip155) {
        throw new Error("No EIP155 namespace found in Wallet Connect session proposal");
    }

    if (!sessionProposal.requiredNamespaces.eip155.chains) {
        throw new Error("No chains found in EIP155 Wallet Connect session proposal namespace");
    }

    const approval = await walletConnectClient.approve({
        id: sessionProposal.id,
        namespaces: {
            eip155: {
                accounts: sessionProposal.requiredNamespaces.eip155.chains.map((chain: string) => `${chain}:${account}`),
                methods: sessionProposal.requiredNamespaces.eip155.methods,
                events: sessionProposal.requiredNamespaces.eip155.events
            }
        }
    })
    const session = await approval.acknowledged();
    return session;
}

