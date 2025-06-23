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
    expiryTimestamp: 1717020442,
    id: 1717020142228697,
    optionalNamespaces: {
      eip155: {
        events: ["disconnect"],
        methods: ["eth_signTypedData_v4"],
      },
    },
    pairingTopic:
      "80630f62114d67a2c529f785ba5b7ed4b4b7894cc6be17153a548aa9305e89d7",
    proposer: {
      metadata: {
        description: "Example Dapp",
        icons: ["https://walletconnect.com/walletconnect-logo.png"],
        name: "Example Dapp",
        url: "#",
      },
      publicKey:
        "61ae6e6f8f441822cf72e21060029681aec2f50d9cb8bf0c95df461ecd371703",
    },
    relays: [
      {
        protocol: "irn",
      },
    ],
    requiredNamespaces: {
      eip155: {
        chains: ["eip155:1"],
        events: ["chainChanged", "accountsChanged"],
        methods: [
          "eth_sendTransaction",
          "eth_signTransaction",
          "eth_sign",
          "personal_sign",
          "eth_signTypedData",
        ],
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
  approve: vi.fn().mockResolvedValue({
    acknowledged: vi.fn().mockResolvedValue(mocks.session),
  }),
  disconnect: vi.fn(),
  on: vi.fn(),
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
      event: PROPOSAL_EVENT_MOCK,
      wallet: walletMock,
      walletConnectClient: signClientMock,
    });

    await expect(promise).rejects.toThrow(
      "No account connected to provided wallet",
    );
  });

  it("should connect new session", async () => {
    await onSessionProposal({
      event: PROPOSAL_EVENT_MOCK,
      wallet: walletMock,
      walletConnectClient: signClientMock,
    });

    expect(signClientMock.approve).toHaveBeenCalledWith({
      id: PROPOSAL_EVENT_MOCK.id,
      namespaces: {
        eip155: {
          accounts: [`eip155:1:${TEST_ACCOUNT_A.address}`],
          events: [
            ...(PROPOSAL_EVENT_MOCK.params.requiredNamespaces?.eip155?.events ??
              []),
            ...(PROPOSAL_EVENT_MOCK.params.optionalNamespaces?.eip155?.events ??
              []),
          ],
          methods: [
            ...(PROPOSAL_EVENT_MOCK.params.requiredNamespaces?.eip155
              ?.methods ?? []),
            ...(PROPOSAL_EVENT_MOCK.params.optionalNamespaces?.eip155
              ?.methods ?? []),
          ],
        },
      },
    });
  });

  it("should connect new session with custom chains", async () => {
    await onSessionProposal({
      chains: [ANVIL_CHAIN],
      event: PROPOSAL_EVENT_MOCK,
      wallet: walletMock,
      walletConnectClient: signClientMock,
    });

    expect(signClientMock.approve).toHaveBeenCalledWith({
      id: PROPOSAL_EVENT_MOCK.id,
      namespaces: {
        eip155: {
          accounts: [
            `eip155:1:${TEST_ACCOUNT_A.address}`,
            `eip155:31337:${TEST_ACCOUNT_A.address}`,
          ],
          events: [
            ...(PROPOSAL_EVENT_MOCK.params.requiredNamespaces?.eip155?.events ??
              []),
            ...(PROPOSAL_EVENT_MOCK.params.optionalNamespaces?.eip155?.events ??
              []),
          ],
          methods: [
            ...(PROPOSAL_EVENT_MOCK.params.requiredNamespaces?.eip155
              ?.methods ?? []),
            ...(PROPOSAL_EVENT_MOCK.params.optionalNamespaces?.eip155
              ?.methods ?? []),
          ],
        },
      },
    });
  });

  it("should disconnect existing session", async () => {
    vi.spyOn(SessionStore, "getSessions").mockResolvedValueOnce([
      {
        origin: "https://example.com",
        topic: "old-session",
      },
    ]);

    mocks.session.topic = "new-session";
    const sessionProposal = cloneObject(PROPOSAL_EVENT_MOCK);
    sessionProposal.verifyContext = {
      verified: { origin: "https://example.com" },
    };
    await onSessionProposal({
      event: sessionProposal,
      wallet: walletMock,
      walletConnectClient: signClientMock,
    });

    expect(signClientMock.disconnect).toHaveBeenCalledWith({
      reason: expect.anything(),
      topic: "old-session",
    });
  });

  it("should throw if no eip155 namespace provided", async () => {
    const proposal = {
      ...PROPOSAL_EVENT_MOCK,
      params: {
        ...PROPOSAL_EVENT_MOCK.params,
        optionalNamespaces: {},
        requiredNamespaces: {},
      },
    };

    const promise = onSessionProposal({
      event: proposal,
      wallet: walletMock,
      walletConnectClient: signClientMock,
    });
    await expect(promise).rejects.toThrow(
      "No EIP155 namespace found in Wallet Connect session proposal",
    );
  });

  it("should call onConnect on successful connection", async () => {
    const onConnect = vi.fn();
    await onSessionProposal({
      event: PROPOSAL_EVENT_MOCK,
      onConnect,
      wallet: walletMock,
      walletConnectClient: signClientMock,
    });
    expect(onConnect).toHaveBeenCalledWith({
      origin: expect.anything(),
      topic: mocks.session.topic,
    });
  });
});
