import { beforeEach } from "node:test";
import { afterAll, describe, expect, it, vi } from "vitest";
import { ANVIL_CHAIN } from "../../../../test/src/chains.js";
import {
  TEST_ACCOUNT_A,
  TEST_IN_APP_WALLET_A,
} from "../../../../test/src/test-wallets.js";
import { cloneObject } from "../../../../test/src/utils.js";
import { onSessionProposal } from "./session-proposal.js";
import * as SessionStore from "./session-store.js";
import type {
  WalletConnectClient,
  WalletConnectSessionProposalEvent,
} from "./types.js";

const PROPOSAL_EVENT_MOCK: WalletConnectSessionProposalEvent = {
  id: 1717020142228697,
  params: {
    id: 1717020142228697,
    pairingTopic:
      "80630f62114d67a2c529f785ba5b7ed4b4b7894cc6be17153a548aa9305e89d7",
    expiryTimestamp: 1717020442,
    requiredNamespaces: {
      eip155: {
        methods: [
          "eth_sendTransaction",
          "eth_signTransaction",
          "eth_sign",
          "personal_sign",
          "eth_signTypedData",
        ],
        chains: ["eip155:1"],
        events: ["chainChanged", "accountsChanged"],
      },
    },
    optionalNamespaces: {
      eip155: {
        methods: ["eth_signTypedData_v4"],
        events: ["disconnect"],
      },
    },
    relays: [
      {
        protocol: "irn",
      },
    ],
    proposer: {
      publicKey:
        "61ae6e6f8f441822cf72e21060029681aec2f50d9cb8bf0c95df461ecd371703",
      metadata: {
        name: "Example Dapp",
        description: "Example Dapp",
        url: "#",
        icons: ["https://walletconnect.com/walletconnect-logo.png"],
      },
    },
  },
};

const mocks = vi.hoisted(() => ({
  session: { topic: "session" },
}));

const walletMock = {
  ...TEST_IN_APP_WALLET_A,
  getAccount: vi.fn().mockReturnValue(TEST_IN_APP_WALLET_A.getAccount()),
};

const signClientMock = {
  on: vi.fn(),
  disconnect: vi.fn(),
  approve: vi.fn().mockResolvedValue({
    acknowledged: vi.fn().mockResolvedValue(mocks.session),
  }),
} as unknown as WalletConnectClient;

describe("session_proposal", () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw if no account is connected", async () => {
    walletMock.getAccount.mockReturnValueOnce(null);

    const promise = onSessionProposal({
      wallet: walletMock,
      walletConnectClient: signClientMock,
      event: PROPOSAL_EVENT_MOCK,
    });

    await expect(promise).rejects.toThrow(
      "No account connected to provided wallet",
    );
  });

  it("should connect new session", async () => {
    await onSessionProposal({
      walletConnectClient: signClientMock,
      wallet: walletMock,
      event: PROPOSAL_EVENT_MOCK,
    });

    expect(signClientMock.approve).toHaveBeenCalledWith({
      id: PROPOSAL_EVENT_MOCK.id,
      namespaces: {
        eip155: {
          accounts: [`eip155:1:${TEST_ACCOUNT_A.address}`],
          methods: [
            ...(PROPOSAL_EVENT_MOCK.params.requiredNamespaces?.eip155
              ?.methods ?? []),
            ...(PROPOSAL_EVENT_MOCK.params.optionalNamespaces?.eip155
              ?.methods ?? []),
          ],
          events: [
            ...(PROPOSAL_EVENT_MOCK.params.requiredNamespaces?.eip155?.events ??
              []),
            ...(PROPOSAL_EVENT_MOCK.params.optionalNamespaces?.eip155?.events ??
              []),
          ],
        },
      },
    });
  });

  it("should connect new session with custom chains", async () => {
    await onSessionProposal({
      walletConnectClient: signClientMock,
      wallet: walletMock,
      event: PROPOSAL_EVENT_MOCK,
      chains: [ANVIL_CHAIN],
    });

    expect(signClientMock.approve).toHaveBeenCalledWith({
      id: PROPOSAL_EVENT_MOCK.id,
      namespaces: {
        eip155: {
          accounts: [
            `eip155:1:${TEST_ACCOUNT_A.address}`,
            `eip155:31337:${TEST_ACCOUNT_A.address}`,
          ],
          methods: [
            ...(PROPOSAL_EVENT_MOCK.params.requiredNamespaces?.eip155
              ?.methods ?? []),
            ...(PROPOSAL_EVENT_MOCK.params.optionalNamespaces?.eip155
              ?.methods ?? []),
          ],
          events: [
            ...(PROPOSAL_EVENT_MOCK.params.requiredNamespaces?.eip155?.events ??
              []),
            ...(PROPOSAL_EVENT_MOCK.params.optionalNamespaces?.eip155?.events ??
              []),
          ],
        },
      },
    });
  });

  it("should disconnect existing session", async () => {
    vi.spyOn(SessionStore, "getSessions").mockResolvedValueOnce([
      {
        topic: "old-session",
        origin: "https://example.com",
      },
    ]);

    mocks.session.topic = "new-session";
    const sessionProposal = cloneObject(PROPOSAL_EVENT_MOCK);
    sessionProposal.verifyContext = {
      verified: { origin: "https://example.com" },
    };
    await onSessionProposal({
      walletConnectClient: signClientMock,
      wallet: walletMock,
      event: sessionProposal,
    });

    expect(signClientMock.disconnect).toHaveBeenCalledWith({
      topic: "old-session",
      reason: expect.anything(),
    });
  });

  it("should throw if no eip155 namespace provided", async () => {
    const proposal = {
      ...PROPOSAL_EVENT_MOCK,
      params: {
        ...PROPOSAL_EVENT_MOCK.params,
        requiredNamespaces: {},
        optionalNamespaces: {},
      },
    };

    const promise = onSessionProposal({
      walletConnectClient: signClientMock,
      wallet: walletMock,
      event: proposal,
    });
    await expect(promise).rejects.toThrow(
      "No EIP155 namespace found in Wallet Connect session proposal",
    );
  });

  it("should call onConnect on successful connection", async () => {
    const onConnect = vi.fn();
    await onSessionProposal({
      walletConnectClient: signClientMock,
      wallet: walletMock,
      event: PROPOSAL_EVENT_MOCK,
      onConnect,
    });
    expect(onConnect).toHaveBeenCalledWith({
      origin: expect.anything(),
      topic: mocks.session.topic,
    });
  });
});
