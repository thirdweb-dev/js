import * as WCSignClientExports from "@walletconnect/sign-client";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_CLIENT } from "../../../../test/src/test-clients.js";
import { TEST_IN_APP_WALLET_A } from "../../../../test/src/test-wallets.js";
import { getDefaultAppMetadata } from "../../utils/defaultDappMetadata.js";
import { DEFAULT_PROJECT_ID } from "../constants.js";
import {
  clearWalletConnectClientCache,
  createWalletConnectClient,
  createWalletConnectSession,
  disconnectWalletConnectSession,
  getActiveWalletConnectSessions,
} from "./index.js";
import * as SessionProposal from "./session-proposal.js";
import * as SessionRequest from "./session-request.js";
import * as SessionStore from "./session-store.js";
import type { WalletConnectClient } from "./types.js";

const TEST_METADATA = {
  name: "test",
  url: "https://test.com",
  description: "test",
  logoUrl: "https://test.com/favicon.ico",
};
const URI_MOCK =
  "wc:a34fc4c6f0db6277f7883c325629a8363eab950933e15caac9e6c7408a82541e@2?expiryTimestamp=1717021490&relay-protocol=irn&symKey=00626dec650109ed09de73bc9364589a3c14a77e57598417fe27f44062904b77";

const DEFAULT_METADATA = getDefaultAppMetadata();

const listeners: Record<string, (event?: unknown) => Promise<void>> = {};

const signClientMock = {
  on: vi.fn((event, listener) => {
    listeners[event] = listener;
  }),
  respond: vi.fn(),
  disconnect: vi.fn(),
  core: {
    pairing: {
      pair: vi.fn(),
    },
  },
} as unknown as WalletConnectClient;

const signClientInitMock = vi
  .spyOn(WCSignClientExports.SignClient, "init")
  .mockResolvedValue(signClientMock);
const onSessionProposal = vi
  .spyOn(SessionProposal, "onSessionProposal")
  .mockResolvedValue();
const fulfillRequest = vi
  .spyOn(SessionRequest, "fulfillRequest")
  .mockResolvedValue();
const removeSession = vi
  .spyOn(SessionStore, "removeSession")
  .mockResolvedValue();
vi.spyOn(SessionStore, "getSessions").mockResolvedValue([{ topic: "test" }]);

afterAll(() => {
  vi.restoreAllMocks();
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createWalletConnectClient", () => {
  beforeEach(() => {
    clearWalletConnectClientCache();
  });

  it("creates a client with provided metadata", async () => {
    const client = await createWalletConnectClient({
      projectId: "test",
      appMetadata: TEST_METADATA,
      client: TEST_CLIENT,
      wallet: TEST_IN_APP_WALLET_A,
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
    expect(signClientMock.on).toHaveBeenCalledWith(
      "session_proposal",
      expect.anything(),
    );
    expect(signClientMock.on).toHaveBeenCalledWith(
      "session_event",
      expect.anything(),
    );
    expect(signClientMock.on).toHaveBeenCalledWith(
      "session_ping",
      expect.anything(),
    );
    expect(signClientMock.on).toHaveBeenCalledWith(
      "session_delete",
      expect.anything(),
    );
  });

  it("creates a client with defaults", async () => {
    const client = await createWalletConnectClient({
      client: TEST_CLIENT,
      wallet: TEST_IN_APP_WALLET_A,
    });
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

  it("adds listeners for session events", async () => {
    await createWalletConnectClient({
      client: TEST_CLIENT,
      wallet: TEST_IN_APP_WALLET_A,
    });

    await listeners.session_proposal?.();
    expect(onSessionProposal).toHaveBeenCalled();

    await listeners.session_request?.();
    expect(fulfillRequest).toHaveBeenCalled();

    await listeners.session_delete?.({ topic: "test" });
    expect(removeSession).toHaveBeenCalled();
  });

  it("triggers onDisconnect callback", async () => {
    const onDisconnect = vi.fn();
    await createWalletConnectClient({
      client: TEST_CLIENT,
      wallet: TEST_IN_APP_WALLET_A,
      onDisconnect,
    });

    await listeners.session_delete?.({ topic: "test" });
    expect(onDisconnect).toHaveBeenCalledWith({ topic: "test" });
  });

  describe("onError handling", () => {
    it("triggers callback when session_proposal handler throws an error", async () => {
      const onError = vi.fn();
      onSessionProposal.mockRejectedValue(new Error("Proposal Error"));

      await createWalletConnectClient({
        client: TEST_CLIENT,
        wallet: TEST_IN_APP_WALLET_A,
        onError,
      });

      await listeners.session_proposal?.();

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
      expect(onError).toHaveBeenCalledTimes(1);
    });

    it("triggers callback when session_request handler throws an error", async () => {
      const onError = vi.fn();
      fulfillRequest.mockRejectedValue(new Error("Request Error"));

      await createWalletConnectClient({
        client: TEST_CLIENT,
        wallet: TEST_IN_APP_WALLET_A,
        onError,
      });

      await listeners.session_request?.();

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });
});

describe("createWalletConnectSession", () => {
  it("sends a session_proposal event", async () => {
    createWalletConnectSession({
      walletConnectClient: signClientMock,
      uri: URI_MOCK,
    });

    expect(signClientMock.core.pairing.pair).toHaveBeenCalledWith({
      uri: URI_MOCK,
    });
  });
});

describe("disconnectWalletConnectSession", () => {
  it("disconnects a session", async () => {
    await disconnectWalletConnectSession({
      walletConnectClient: signClientMock,
      session: {
        topic: "test",
      },
    });

    expect(removeSession).toHaveBeenCalled();
  });

  it("removes session anyway if disconnect throws", async () => {
    signClientMock.disconnect = vi.fn().mockRejectedValue(new Error("test"));
    await disconnectWalletConnectSession({
      walletConnectClient: signClientMock,
      session: {
        topic: "test",
      },
    });
    expect(removeSession).toHaveBeenCalled();
  });
});

describe("getActiveWalletConnectSession", () => {
  it("gets the active sessions", async () => {
    const session = await getActiveWalletConnectSessions();
    expect(session).toEqual([
      {
        topic: "test",
      },
    ]);
  });
});
