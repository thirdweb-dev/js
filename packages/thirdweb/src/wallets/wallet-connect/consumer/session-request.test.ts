import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_IN_APP_WALLET_A,
} from "../../../../test/src/test-wallets.js";
import { typedData } from "../../../../test/src/typed-data.js";
import { cloneObject } from "../../../../test/src/utils.js";
import type {
  WalletConnectRawTransactionRequestParams,
  WalletConnectSessionRequestEvent,
  WalletConnectSignRequestPrams,
  WalletConnectSignTypedDataRequestParams,
  WalletConnectTransactionRequestParams,
} from "../types.js";
import { type WalletConnectClient, walletConnectSessions } from "./index.js";
import { fulfillRequest } from "./session-request.js";

const TRANSACTION_MOCK = {
  to: "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
  data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
  gas: "0x76c0", // 30400
  gasPrice: "0x9184e72a000", // 10000000000000
  value: "0x9184e72a", // 2441406250
  nonce: "0x117", // 279
};

const REQUEST_EVENT_MOCK: WalletConnectSessionRequestEvent = {
  id: 1717020142228697,
  topic: "session",
  params: {
    request: {
      method: "personal_sign",
      params: ["0x00", "0x00"],
    },
    chainId: "eip155:1",
  },
};

const walletMock = {
  ...TEST_IN_APP_WALLET_A,
  getAccount: vi.fn().mockReturnValue(TEST_IN_APP_WALLET_A.getAccount()),
};

const mocks = vi.hoisted(() => ({
  sendTransaction: vi.fn().mockResolvedValue({
    transactionHash: "0xabcd",
  }),
  sendRawTransaction: vi.fn().mockResolvedValue({
    transactionHash: "0xabcd",
  }),
}));

const signClientMock = {
  on: vi.fn(),
  respond: vi.fn(),
  disconnect: vi.fn(),
} as unknown as WalletConnectClient;

describe("session_request", () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    walletMock.getAccount.mockReturnValue(TEST_IN_APP_WALLET_A.getAccount()); // reset any mocked accounts
    TEST_ACCOUNT_A.sendTransaction = mocks.sendTransaction;
    TEST_ACCOUNT_A.sendRawTransaction = mocks.sendRawTransaction;
    walletConnectSessions.delete(walletMock);
  });

  it("should throw if no account is connected", async () => {
    walletMock.getAccount.mockReturnValue(null);
    const promise = fulfillRequest({
      walletConnectClient: signClientMock,
      wallet: walletMock,
      event: REQUEST_EVENT_MOCK,
    });
    await expect(promise).rejects.toThrow(
      "[WalletConnect] No account connected to provided wallet",
    );
  });

  it("should throw if unsupported request method", async () => {
    const unsupportedRequest = cloneObject(REQUEST_EVENT_MOCK);
    unsupportedRequest.params.request.method = "eth_unsupported";

    const promise = fulfillRequest({
      walletConnectClient: signClientMock,
      wallet: walletMock,
      event: unsupportedRequest,
    });

    await expect(promise).rejects.toThrow(
      "[WalletConnect] Unsupported request method: eth_unsupported",
    );
  });

  describe("personal_sign", () => {
    it("should sign message", async () => {
      const personalSignRequest = cloneObject(REQUEST_EVENT_MOCK);
      personalSignRequest.params.request.method = "personal_sign";
      personalSignRequest.params.request.params = [
        "my message",
        TEST_ACCOUNT_A.address,
      ] as WalletConnectSignRequestPrams;

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: personalSignRequest,
      });
      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result:
            "0x66ea9c2ac4a99a5ac26f5fa3e800171036210e135d486f1d0d02d64eaa7dd56275b4323e153e62c1fad57a6be54420248ed54604f4857ec75ce7761eefad10e41c",
        },
      });
    });

    it("should reject if active account address differs from requested address", async () => {
      const personalSignRequest = cloneObject(REQUEST_EVENT_MOCK);
      personalSignRequest.params.request.method = "personal_sign";
      personalSignRequest.params.request.params = [
        "my message",
        TEST_ACCOUNT_B.address,
      ] as WalletConnectSignRequestPrams;

      const promise = fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: personalSignRequest,
      });

      await expect(promise).rejects.toThrow(
        `[WalletConnect] Failed to validate account address (${TEST_ACCOUNT_A.address}), differs from ${TEST_ACCOUNT_B.address}`,
      );
    });
  });

  describe("eth_sign", () => {
    it("should sign message", async () => {
      const personalSignRequest = cloneObject(REQUEST_EVENT_MOCK);
      personalSignRequest.params.request.method = "eth_sign";
      personalSignRequest.params.request.params = [
        "my message",
        TEST_ACCOUNT_A.address,
      ] as WalletConnectSignRequestPrams;

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: personalSignRequest,
      });
      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result:
            "0x66ea9c2ac4a99a5ac26f5fa3e800171036210e135d486f1d0d02d64eaa7dd56275b4323e153e62c1fad57a6be54420248ed54604f4857ec75ce7761eefad10e41c",
        },
      });
    });

    it("should reject if active account address differs from requested address", async () => {
      const personalSignRequest = cloneObject(REQUEST_EVENT_MOCK);
      personalSignRequest.params.request.method = "eth_sign";
      personalSignRequest.params.request.params = [
        "my message",
        TEST_ACCOUNT_B.address,
      ] as WalletConnectSignRequestPrams;

      const promise = fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: personalSignRequest,
      });

      await expect(promise).rejects.toThrow(
        `[WalletConnect] Failed to validate account address (${TEST_ACCOUNT_A.address}), differs from ${TEST_ACCOUNT_B.address}`,
      );
    });
  });

  describe("eth_signTypedData", () => {
    it("should sign typed data", async () => {
      const personalSignRequest = cloneObject(REQUEST_EVENT_MOCK);
      personalSignRequest.params.request.method = "eth_signTypedData";
      personalSignRequest.params.request.params = [
        TEST_ACCOUNT_A.address,
        typedData.basic,
      ] as WalletConnectSignTypedDataRequestParams;

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: personalSignRequest,
      });
      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result:
            "0x32f3d5975ba38d6c2fba9b95d5cbed1febaa68003d3d588d51f2de522ad54117760cfc249470a75232552e43991f53953a3d74edf6944553c6bef2469bb9e5921b",
        },
      });
    });

    it("should sign stringified typed data", async () => {
      const personalSignRequest = cloneObject(REQUEST_EVENT_MOCK);
      personalSignRequest.params.request.method = "eth_signTypedData";
      personalSignRequest.params.request.params = [
        TEST_ACCOUNT_A.address,
        typedData.basic,
      ] as WalletConnectSignTypedDataRequestParams;

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: personalSignRequest,
      });
      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result:
            "0x32f3d5975ba38d6c2fba9b95d5cbed1febaa68003d3d588d51f2de522ad54117760cfc249470a75232552e43991f53953a3d74edf6944553c6bef2469bb9e5921b",
        },
      });
    });

    it("should reject if active account address differs from requested address", async () => {
      const personalSignRequest = cloneObject(REQUEST_EVENT_MOCK);
      personalSignRequest.params.request.method = "eth_signTypedData";
      personalSignRequest.params.request.params = [
        TEST_ACCOUNT_B.address,
        typedData.basic,
      ] as WalletConnectSignTypedDataRequestParams;

      const promise = fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: personalSignRequest,
      });

      await expect(promise).rejects.toThrow(
        `[WalletConnect] Failed to validate account address (${TEST_ACCOUNT_A.address}), differs from ${TEST_ACCOUNT_B.address}`,
      );
    });
  });

  describe("eth_signTransaction", () => {
    it("should sign transaction", async () => {
      const signTransactionRequest = cloneObject(REQUEST_EVENT_MOCK);
      signTransactionRequest.params.request.method = "eth_signTransaction";
      signTransactionRequest.params.request.params = [
        TRANSACTION_MOCK,
      ] as WalletConnectTransactionRequestParams;

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: signTransactionRequest,
      });
      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result:
            "0xf8948201178609184e72a0008276c094d46e8dd67c5d32be8058bb8eb970870f07244567849184e72aa9d46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f0724456751ca072ed60498356d3bc60fa9b175e1703e460c2362a8e20b14efdd871a098a96ee6a0548610ee213ea8a6db5e8efd9ece886e97097c106c0a03925a51dd93a7750112",
        },
      });
    });

    it("should throw if the account doesn't support signing transactions", async () => {
      walletMock.getAccount.mockReturnValue({
        ...TEST_IN_APP_WALLET_A,
        signTransaction: undefined,
      });
      const signTransactionRequest = cloneObject(REQUEST_EVENT_MOCK);
      signTransactionRequest.params.request.method = "eth_signTransaction";
      signTransactionRequest.params.request.params = [
        TRANSACTION_MOCK,
      ] as WalletConnectTransactionRequestParams;

      const promise = fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: signTransactionRequest,
      });

      await expect(promise).rejects.toThrow(
        "[WalletConnect] The current account does not support signing transactions",
      );
    });

    it("should throw if from field is different from account", async () => {
      const transaction = {
        ...TRANSACTION_MOCK,
        from: TEST_ACCOUNT_B.address,
      };
      const signTransactionRequest = cloneObject(REQUEST_EVENT_MOCK);
      signTransactionRequest.params.request.method = "eth_signTransaction";
      signTransactionRequest.params.request.params = [
        transaction,
      ] as WalletConnectTransactionRequestParams;

      const promise = fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: signTransactionRequest,
      });

      await expect(promise).rejects.toThrow(
        `[WalletConnect] Failed to validate account address (${TEST_ACCOUNT_A.address}), differs from ${TEST_ACCOUNT_B.address}`,
      );
    });
  });

  describe("eth_sendTransaction", () => {
    it("should send transaction", async () => {
      mocks.sendTransaction.mockResolvedValueOnce({
        transactionHash: "0x1234",
      });
      const sendTransactionRequest = cloneObject(REQUEST_EVENT_MOCK);
      sendTransactionRequest.params.request.method = "eth_sendTransaction";
      sendTransactionRequest.params.request.params = [
        TRANSACTION_MOCK,
      ] as WalletConnectTransactionRequestParams;

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: sendTransactionRequest,
      });

      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result: "0x1234",
        },
      });
    });

    it("should throw if no chain is provided", async () => {
      const sendTransactionRequest = cloneObject(REQUEST_EVENT_MOCK);
      sendTransactionRequest.params.request.method = "eth_sendTransaction";
      sendTransactionRequest.params.request.params = [
        TRANSACTION_MOCK,
      ] as WalletConnectTransactionRequestParams;
      sendTransactionRequest.params.chainId = "eip155:?";

      const promise = fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: sendTransactionRequest,
      });

      await expect(promise).rejects.toThrow(
        "[WalletConnect] Invalid chainId eip155:?, should have the format 'eip155:1'",
      );
    });

    it("should throw if from address differs from account", async () => {
      const transaction = {
        ...TRANSACTION_MOCK,
        from: TEST_ACCOUNT_B.address,
      };

      const signTransactionRequest = cloneObject(REQUEST_EVENT_MOCK);
      signTransactionRequest.params.request.method = "eth_sendTransaction";
      signTransactionRequest.params.request.params = [
        transaction,
      ] as WalletConnectTransactionRequestParams;

      const promise = fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: signTransactionRequest,
      });

      await expect(promise).rejects.toThrow(
        `[WalletConnect] Failed to validate account address (${TEST_ACCOUNT_A.address}), differs from ${TEST_ACCOUNT_B.address}`,
      );
    });
  });

  describe("eth_sendRawTransaction", () => {
    it("should send raw transaction", async () => {
      mocks.sendRawTransaction.mockResolvedValueOnce({
        transactionHash: "0xabcde",
      });
      const sendRawTransactionRequest = cloneObject(REQUEST_EVENT_MOCK);
      sendRawTransactionRequest.params.request.method =
        "eth_sendRawTransaction";
      sendRawTransactionRequest.params.request.params = [
        "0x12345",
      ] as WalletConnectRawTransactionRequestParams;

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: sendRawTransactionRequest,
      });

      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result: "0xabcde",
        },
      });
    });

    it("should throw if the account does not support sending raw transactions", async () => {
      TEST_ACCOUNT_A.sendRawTransaction = undefined;
      const sendRawTransactionRequest = cloneObject(REQUEST_EVENT_MOCK);
      sendRawTransactionRequest.params.request.method =
        "eth_sendRawTransaction";
      sendRawTransactionRequest.params.request.params = [
        "0x12345",
      ] as WalletConnectRawTransactionRequestParams;

      const promise = fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: sendRawTransactionRequest,
      });

      await expect(promise).rejects.toThrow(
        "[WalletConnect] The current account does not support sending raw transactions",
      );
    });

    it("should throw if no chain is provided", async () => {
      const sendRawTransactionRequest = cloneObject(REQUEST_EVENT_MOCK);
      sendRawTransactionRequest.params.request.method =
        "eth_sendRawTransaction";
      sendRawTransactionRequest.params.request.params = [
        "0x12345",
      ] as WalletConnectRawTransactionRequestParams;
      sendRawTransactionRequest.params.chainId = "eip155:?";

      const promise = fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: sendRawTransactionRequest,
      });

      await expect(promise).rejects.toThrow(
        "[WalletConnect] Invalid chainId eip155:?, should have the format 'eip155:1'",
      );
    });
  });
});
