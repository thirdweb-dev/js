import * as WCSignClientExports from "@walletconnect/sign-client";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { TEST_IN_APP_WALLET_A } from "../../../../test/src/test-wallets.js";
import { getDefaultAppMetadata } from "../../utils/defaultDappMetadata.js";
import { DEFAULT_PROJECT_ID } from "../constants.js";
import {
  type WalletConnectClient,
  createWalletConnectClient,
  createWalletConnectSession,
} from "./index.js";

const TEST_METADATA = {
  name: "test",
  url: "https://test.com",
  description: "test",
  logoUrl: "https://test.com/favicon.ico",
};
const URI_MOCK =
  "wc:a34fc4c6f0db6277f7883c325629a8363eab950933e15caac9e6c7408a82541e@2?expiryTimestamp=1717021490&relay-protocol=irn&symKey=00626dec650109ed09de73bc9364589a3c14a77e57598417fe27f44062904b77";

const DEFAULT_METADATA = getDefaultAppMetadata();

const signClientMock = {
  on: vi.fn(),
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

afterAll(() => {
  vi.restoreAllMocks();
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createWalletConnectClient", () => {
  it("creates a client with provided metadata", async () => {
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

  it("creates a client with defaults", async () => {
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
  it("sends a session_proposal event", async () => {
    createWalletConnectSession({
      walletConnectClient: signClientMock,
      wallet: TEST_IN_APP_WALLET_A,
      uri: URI_MOCK,
    });

    expect(signClientMock.core.pairing.pair).toHaveBeenCalledWith({
      uri: URI_MOCK,
    });
    expect(signClientMock.on).toHaveBeenCalledWith(
      "session_proposal",
      expect.anything(),
    );
  });
});
