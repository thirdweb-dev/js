import { describe, test, expect, vi, afterAll, beforeEach } from "vitest";
import { createWalletConnectClient, createWalletConnectSession, getActiveWalletConnectSession, onSessionProposal, walletConnectSessions, type WalletConnectClient, fulfillRequest } from "./consumer.js";
import { getDefaultAppMetadata } from "../utils/defaultDappMetadata.js";
import { DEFAULT_PROJECT_ID } from "./constants.js";
import * as WCSignClientExports from "@walletconnect/sign-client";
import { TEST_IN_APP_WALLET_A } from "../../../test/src/test-wallets.js";
import type { WalletConnectSession, WalletConnectSessionProposalEvent, WalletConnectSessionRequestEvent } from "./types.js";

const TEST_METADATA = {
    name: "test",
    url: "https://test.com",
    description: "test",
    logoUrl: "https://test.com/favicon.ico",
}
const URI_MOCK = "wc:a34fc4c6f0db6277f7883c325629a8363eab950933e15caac9e6c7408a82541e@2?expiryTimestamp=1717021490&relay-protocol=irn&symKey=00626dec650109ed09de73bc9364589a3c14a77e57598417fe27f44062904b77";
const PROPOSAL_EVENT_MOCK: WalletConnectSessionProposalEvent = {
    "id": 1717020142228697,
    "params": {
        "id": 1717020142228697,
        "pairingTopic": "80630f62114d67a2c529f785ba5b7ed4b4b7894cc6be17153a548aa9305e89d7",
        "expiryTimestamp": 1717020442,
        "requiredNamespaces": {
            "eip155": {
                "methods": [
                    "eth_sendTransaction",
                    "eth_signTransaction",
                    "eth_sign",
                    "personal_sign",
                    "eth_signTypedData"
                ],
                "chains": [
                    "eip155:1"
                ],
                "events": [
                    "chainChanged",
                    "accountsChanged"
                ]
            }
        },
        "relays": [
            {
                "protocol": "irn"
            }
        ],
        "proposer": {
            "publicKey": "61ae6e6f8f441822cf72e21060029681aec2f50d9cb8bf0c95df461ecd371703",
            "metadata": {
                "name": "Example Dapp",
                "description": "Example Dapp",
                "url": "#",
                "icons": [
                    "https://walletconnect.com/walletconnect-logo.png"
                ]
            }
        }
    }
}
const REQUEST_EVENT_MOCK: WalletConnectSessionRequestEvent = {
    "id": 1717020142228697,
    "topic": "session",
    "params": {
        "request": {
            "method": "personal_sign",
            "params": ["0x00", "0x00"],
        },
        "chainId": "0x1"
    }
}
const DEFAULT_METADATA = getDefaultAppMetadata();

const mocks = vi.hoisted(() => ({
    session: { topic: "session" }
}));

const signClientMock = { on: vi.fn(), respond: vi.fn(), core: { pairing: { pair: vi.fn() } }, disconnect: vi.fn(), approve: vi.fn().mockResolvedValue({ acknowledged: vi.fn().mockResolvedValue(mocks.session) }) } as unknown as WalletConnectClient;
const walletMock = {
    ...TEST_IN_APP_WALLET_A,
    getAccount: vi.fn().mockReturnValue(TEST_IN_APP_WALLET_A.getAccount())
};
const signClientInitMock = vi.spyOn(WCSignClientExports.SignClient, "init").mockResolvedValue(signClientMock);

afterAll(() => {
    vi.restoreAllMocks();
});

beforeEach(() => {
    vi.clearAllMocks();
    walletMock.getAccount.mockReturnValue(TEST_IN_APP_WALLET_A.getAccount()); // reset any mocked accounts
    walletConnectSessions.delete(walletMock);
});

describe("createWalletConnectClient", () => {  
    test("creates a client with provided metadata", async () => {
        const client = await createWalletConnectClient({
            projectId: "test",
            appMetadata: TEST_METADATA,
        });
        expect(signClientInitMock).toHaveBeenCalledWith({
            projectId: "test",
            metadata: {
                name: TEST_METADATA.name,
                url: TEST_METADATA.url,
                description: TEST_METADATA.description,
                icons: [TEST_METADATA.logoUrl],
            },
        });
        expect(client).toEqual(signClientMock);
    });

    test("creates a client with defaults", async () => {
        const client = await createWalletConnectClient();
        expect(signClientInitMock).toHaveBeenCalledWith({
            projectId: DEFAULT_PROJECT_ID,
            metadata: {
                name: DEFAULT_METADATA.name,
                url: DEFAULT_METADATA.url,
                description: DEFAULT_METADATA.description,
                icons: [DEFAULT_METADATA.logoUrl],
            },
        });
        expect(client).toEqual(signClientMock);
    });
});

describe("createWalletConnectSession", () => {
    test("sends a session_proposal event", async () => {
        createWalletConnectSession({ walletConnectClient: signClientMock, wallet: walletMock, uri: URI_MOCK })

        expect(signClientMock.core.pairing.pair).toHaveBeenCalledWith({ uri: URI_MOCK });
        expect(signClientMock.on).toHaveBeenCalledWith("session_proposal", expect.anything());
    });
});

describe("session_proposal", () => {
    test("should throw if no account is connected", async () => {
        walletMock.getAccount.mockReturnValue(null);
        
        const promise = onSessionProposal({ wallet: walletMock, walletConnectClient: signClientMock, event: PROPOSAL_EVENT_MOCK });
      
        await expect(promise).rejects.toThrow("[WalletConnect] No account connected to provided wallet");
    })

    test("should connect new session", async () => {
        await onSessionProposal({ walletConnectClient: signClientMock, wallet: walletMock, event: PROPOSAL_EVENT_MOCK });

        expect(signClientMock.approve).toHaveBeenCalled();
        expect(getActiveWalletConnectSession(walletMock)?.topic).toEqual(mocks.session.topic);
    });

    test("should disconnect existing session", async () => {
        walletConnectSessions.set(walletMock, { topic: "old-session" } as WalletConnectSession);
        mocks.session.topic = "new-session";
        await onSessionProposal({ walletConnectClient: signClientMock, wallet: walletMock, event: PROPOSAL_EVENT_MOCK });
        
        expect(signClientMock.disconnect).toHaveBeenCalled();
        expect(getActiveWalletConnectSession(walletMock)?.topic).toEqual(mocks.session.topic);
    });

    test("should throw if no eip155 namespace provided", async () => {
        const proposal = { ...PROPOSAL_EVENT_MOCK, params: { ...PROPOSAL_EVENT_MOCK.params, requiredNamespaces: {} } };

        const promise = onSessionProposal({ walletConnectClient: signClientMock, wallet: walletMock, event: proposal });
        await expect(promise).rejects.toThrow("[WalletConnect] No EIP155 namespace found in Wallet Connect session proposal");
    });

    test("should throw if no eip155 chains provided", async () => {
        const proposal = { ...PROPOSAL_EVENT_MOCK, params: { ...PROPOSAL_EVENT_MOCK.params, requiredNamespaces: { eip155: { methods: [], events: [] } } } };
         
        const promise = onSessionProposal({ walletConnectClient: signClientMock, wallet: walletMock, event: proposal });
        await expect(promise).rejects.toThrow("[WalletConnect] No chains found in EIP155 Wallet Connect session proposal namespace");
    });
});

describe("session_request", () => {
    test("should throw if no account is connected", async () => {
        walletMock.getAccount.mockReturnValue(null);
        const promise = fulfillRequest({ walletConnectClient: signClientMock, wallet: walletMock, event: REQUEST_EVENT_MOCK });
        await expect(promise).rejects.toThrow("[WalletConnect] No account connected to provided wallet");
    });

    
    test("should throw if unsupported request method", async () => {
        const unsupportedRequest = { ...REQUEST_EVENT_MOCK, params: { ...REQUEST_EVENT_MOCK.params, request: { ...REQUEST_EVENT_MOCK.params.request, method: "eth_unsupported" } } };
        const promise = fulfillRequest({ walletConnectClient: signClientMock, wallet: walletMock, event: unsupportedRequest });

        await expect(promise).rejects.toThrow("[WalletConnect] Unsupported request method: eth_unsupported");
    });
    

    describe("personal_sign", () => {
        test("should sign message", async () => {
            const personalSignRequest = { ...REQUEST_EVENT_MOCK, params: { ...REQUEST_EVENT_MOCK.params, request: { ...REQUEST_EVENT_MOCK.params.request, params: ["my message"] } } };

            await fulfillRequest({ walletConnectClient: signClientMock, wallet: walletMock, event: personalSignRequest });
            expect(signClientMock.respond).toHaveBeenCalledWith({
                topic: REQUEST_EVENT_MOCK.topic,
                response: {
                    id: REQUEST_EVENT_MOCK.id,
                    jsonrpc: "2.0",
                    result: "0x66ea9c2ac4a99a5ac26f5fa3e800171036210e135d486f1d0d02d64eaa7dd56275b4323e153e62c1fad57a6be54420248ed54604f4857ec75ce7761eefad10e41c"
                }
            });
        });
    });
})

