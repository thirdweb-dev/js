import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
  TEST_IN_APP_WALLET_A,
} from "../../../../test/src/test-wallets.js";
import { typedData } from "../../../../test/src/typed-data.js";
import { cloneObject } from "../../../../test/src/utils.js";
import { defineChain } from "../../../chains/utils.js";
import { fulfillRequest } from "./session-request.js";
import type {
  WalletConnectAddEthereumChainRequestParams,
  WalletConnectClient,
  WalletConnectRawTransactionRequestParams,
  WalletConnectSessionRequestEvent,
  WalletConnectSignRequestPrams,
  WalletConnectSignTypedDataRequestParams,
  WalletConnectSwitchEthereumChainRequestParams,
  WalletConnectTransactionRequestParams,
} from "./types.js";

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
  switchChain: vi.fn(),
  getChain: vi.fn(),
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
  });

  it("should throw if no account is connected", async () => {
    walletMock.getAccount.mockReturnValue(null);
    const promise = fulfillRequest({
      walletConnectClient: signClientMock,
      wallet: walletMock,
      event: REQUEST_EVENT_MOCK,
    });
    await expect(promise).rejects.toThrow(
      "No account connected to provided wallet",
    );
  });

  it("should throw if unsupported request method", async () => {
    const unsupportedRequest = cloneObject(REQUEST_EVENT_MOCK);
    unsupportedRequest.params.request.method = "eth_unsupported";

    await fulfillRequest({
      walletConnectClient: signClientMock,
      wallet: walletMock,
      event: unsupportedRequest,
    });

    expect(signClientMock.respond).toHaveBeenCalledWith({
      topic: REQUEST_EVENT_MOCK.topic,
      response: {
        id: REQUEST_EVENT_MOCK.id,
        jsonrpc: "2.0",
        result: {
          code: 500,
          message: "Unsupported request method: eth_unsupported",
        },
      },
    });
  });

  it("should use custom request handlers", async () => {
    const customHandlers = {
      eth_magic: vi.fn(),
    };
    const event = cloneObject(REQUEST_EVENT_MOCK);
    event.params.request.method = "eth_magic";

    const promise = fulfillRequest({
      walletConnectClient: signClientMock,
      wallet: walletMock,
      event,
      handlers: customHandlers,
    });

    await expect(promise).resolves.not.toThrow();
    expect(customHandlers.eth_magic).toHaveBeenCalledWith({
      account: TEST_ACCOUNT_A,
      chainId: 1,
      params: REQUEST_EVENT_MOCK.params.request.params,
    });
  });

  describe("personal_sign", () => {
    let personalSignRequest: WalletConnectSessionRequestEvent;
    beforeEach(() => {
      personalSignRequest = cloneObject(REQUEST_EVENT_MOCK);
      personalSignRequest.params.request.method = "personal_sign";
      personalSignRequest.params.request.params = [
        "my message",
        TEST_ACCOUNT_A.address,
      ] as WalletConnectSignRequestPrams;
    });

    it("should sign message", async () => {
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
      personalSignRequest.params.request.params[1] = TEST_ACCOUNT_B.address;

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
          result: {
            code: 500,
            message: `Failed to validate account address (${TEST_ACCOUNT_A.address}), differs from ${TEST_ACCOUNT_B.address}`,
          },
        },
      });
    });

    it("should use custom handler if provided", async () => {
      const customHandlers = {
        personal_sign: vi.fn().mockResolvedValue("0xRESULT"),
      };

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: personalSignRequest,
        handlers: customHandlers,
      });

      expect(customHandlers.personal_sign).toHaveBeenCalledWith({
        account: TEST_ACCOUNT_A,
        params: personalSignRequest.params.request.params,
      });
      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result: "0xRESULT",
        },
      });
    });
  });

  describe("eth_sign", () => {
    let ethSignRequest: WalletConnectSessionRequestEvent;
    beforeEach(() => {
      ethSignRequest = cloneObject(REQUEST_EVENT_MOCK);
      ethSignRequest.params.request.method = "eth_sign";
      ethSignRequest.params.request.params = [
        "my message",
        TEST_ACCOUNT_A.address,
      ] as WalletConnectSignRequestPrams;
    });

    it("should sign message", async () => {
      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: ethSignRequest,
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
      ethSignRequest.params.request.params = [
        "my message",
        TEST_ACCOUNT_B.address,
      ] as WalletConnectSignRequestPrams;

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: ethSignRequest,
      });

      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result: {
            code: 500,
            message: `Failed to validate account address (${TEST_ACCOUNT_A.address}), differs from ${TEST_ACCOUNT_B.address}`,
          },
        },
      });
    });

    it("should use custom handler if provided", async () => {
      const customHandlers = {
        eth_sign: vi.fn().mockResolvedValue("0xRESULT"),
      };

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: ethSignRequest,
        handlers: customHandlers,
      });

      expect(customHandlers.eth_sign).toHaveBeenCalledWith({
        account: TEST_ACCOUNT_A,
        params: ethSignRequest.params.request.params,
      });
      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result: "0xRESULT",
        },
      });
    });
  });

  describe("eth_signTypedData", () => {
    let ethSignTypedDataRequest: WalletConnectSessionRequestEvent;
    beforeEach(() => {
      ethSignTypedDataRequest = cloneObject(REQUEST_EVENT_MOCK);
      ethSignTypedDataRequest.params.request.method = "eth_signTypedData";
      ethSignTypedDataRequest.params.request.params = [
        TEST_ACCOUNT_A.address,
        typedData.basic,
      ] as WalletConnectSignTypedDataRequestParams;
    });

    it("should sign typed data", async () => {
      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: ethSignTypedDataRequest,
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
      ethSignTypedDataRequest.params.request.params = [
        TEST_ACCOUNT_A.address,
        typedData.basic,
      ] as WalletConnectSignTypedDataRequestParams;

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: ethSignTypedDataRequest,
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
  });

  describe("eth_signTypedData_v4", () => {
    let ethSignTypedDataRequest: WalletConnectSessionRequestEvent;
    beforeEach(() => {
      ethSignTypedDataRequest = cloneObject(REQUEST_EVENT_MOCK);
      ethSignTypedDataRequest.params.request.method = "eth_signTypedData_v4";
      ethSignTypedDataRequest.params.request.params = [
        TEST_ACCOUNT_A.address,
        typedData.basic,
      ] as WalletConnectSignTypedDataRequestParams;
    });

    it("should sign typed data", async () => {
      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: ethSignTypedDataRequest,
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
      ethSignTypedDataRequest.params.request.params = [
        TEST_ACCOUNT_A.address,
        typedData.basic,
      ] as WalletConnectSignTypedDataRequestParams;

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: ethSignTypedDataRequest,
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
      ethSignTypedDataRequest.params.request.params = [
        TEST_ACCOUNT_B.address,
        typedData.basic,
      ] as WalletConnectSignTypedDataRequestParams;

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: ethSignTypedDataRequest,
      });

      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result: {
            code: 500,
            message: `Failed to validate account address (${TEST_ACCOUNT_A.address}), differs from ${TEST_ACCOUNT_B.address}`,
          },
        },
      });
    });

    it("should use custom handler if provided", async () => {
      const customHandlers = {
        eth_signTypedData_v4: vi.fn().mockResolvedValue("0xRESULT"),
      };

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: ethSignTypedDataRequest,
        handlers: customHandlers,
      });

      expect(customHandlers.eth_signTypedData_v4).toHaveBeenCalledWith({
        account: TEST_ACCOUNT_A,
        params: ethSignTypedDataRequest.params.request.params,
      });
      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result: "0xRESULT",
        },
      });
    });
  });

  describe("eth_signTransaction", () => {
    let signTransactionRequest: WalletConnectSessionRequestEvent;
    beforeEach(() => {
      signTransactionRequest = cloneObject(REQUEST_EVENT_MOCK);
      signTransactionRequest.params.request.method = "eth_signTransaction";
      signTransactionRequest.params.request.params = [
        TRANSACTION_MOCK,
      ] as WalletConnectTransactionRequestParams;
    });

    it("should sign transaction", async () => {
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
          result: {
            code: 500,
            message:
              "The current account does not support signing transactions",
          },
        },
      });
    });

    it("should throw if from field is different from account", async () => {
      const transaction = {
        ...TRANSACTION_MOCK,
        from: TEST_ACCOUNT_B.address,
      };
      signTransactionRequest.params.request.params = [
        transaction,
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
          result: {
            code: 500,
            message: `Failed to validate account address (${TEST_ACCOUNT_A.address}), differs from ${TEST_ACCOUNT_B.address}`,
          },
        },
      });
    });

    it("should use custom handler if provided", async () => {
      const customHandlers = {
        eth_signTransaction: vi.fn().mockResolvedValue("0xRESULT"),
      };

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: signTransactionRequest,
        handlers: customHandlers,
      });

      expect(customHandlers.eth_signTransaction).toHaveBeenCalledWith({
        account: TEST_ACCOUNT_A,
        params: signTransactionRequest.params.request.params,
      });
      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result: "0xRESULT",
        },
      });
    });
  });

  describe("eth_sendTransaction", () => {
    let sendTransactionRequest: WalletConnectSessionRequestEvent;
    beforeEach(() => {
      sendTransactionRequest = cloneObject(REQUEST_EVENT_MOCK);
      sendTransactionRequest.params.request.method = "eth_sendTransaction";
      sendTransactionRequest.params.request.params = [
        TRANSACTION_MOCK,
      ] as WalletConnectTransactionRequestParams;
      mocks.sendTransaction.mockResolvedValueOnce({
        transactionHash: "0x1234",
      });
    });

    it("should send transaction", async () => {
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
      sendTransactionRequest.params.chainId = "eip155:?";

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
          result: {
            code: 500,
            message:
              "Invalid chainId eip155:?, should have the format 'eip155:1'",
          },
        },
      });
    });

    it("should throw if from address differs from account", async () => {
      const transaction = {
        ...TRANSACTION_MOCK,
        from: TEST_ACCOUNT_B.address,
      };

      sendTransactionRequest.params.request.params = [
        transaction,
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
          result: {
            code: 500,
            message: `Failed to validate account address (${TEST_ACCOUNT_A.address}), differs from ${TEST_ACCOUNT_B.address}`,
          },
        },
      });
    });

    it("should use custom handler if provided", async () => {
      const customHandlers = {
        eth_sendTransaction: vi.fn().mockResolvedValue("0xRESULT"),
      };

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: sendTransactionRequest,
        handlers: customHandlers,
      });

      expect(customHandlers.eth_sendTransaction).toHaveBeenCalledWith({
        account: TEST_ACCOUNT_A,
        chainId: 1,
        params: sendTransactionRequest.params.request.params,
      });
      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result: "0xRESULT",
        },
      });
    });
  });

  describe("eth_sendRawTransaction", () => {
    let sendRawTransactionRequest: WalletConnectSessionRequestEvent;
    beforeEach(() => {
      sendRawTransactionRequest = cloneObject(REQUEST_EVENT_MOCK);
      sendRawTransactionRequest.params.request.method =
        "eth_sendRawTransaction";
      sendRawTransactionRequest.params.request.params = [
        "0x12345",
      ] as WalletConnectRawTransactionRequestParams;
      mocks.sendRawTransaction.mockResolvedValueOnce({
        transactionHash: "0xabcde",
      });
    });

    it("should send raw transaction", async () => {
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
          result: {
            code: 500,
            message:
              "The current account does not support sending raw transactions",
          },
        },
      });
    });

    it("should throw if no chain is provided", async () => {
      sendRawTransactionRequest.params.chainId = "eip155:?";

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
          result: {
            code: 500,
            message:
              "Invalid chainId eip155:?, should have the format 'eip155:1'",
          },
        },
      });
    });

    it("should use custom handler if provided", async () => {
      const customHandlers = {
        eth_sendRawTransaction: vi.fn().mockResolvedValue("0xRESULT"),
      };

      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: sendRawTransactionRequest,
        handlers: customHandlers,
      });

      expect(customHandlers.eth_sendRawTransaction).toHaveBeenCalledWith({
        account: TEST_ACCOUNT_A,
        chainId: 1,
        params: sendRawTransactionRequest.params.request.params,
      });
      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result: "0xRESULT",
        },
      });
    });
  });

  describe("wallet_addEthereumChain", () => {
    let addEthereumChainRequest: WalletConnectSessionRequestEvent;
    beforeEach(() => {
      addEthereumChainRequest = cloneObject(REQUEST_EVENT_MOCK);
      addEthereumChainRequest.params.request.method = "wallet_addEthereumChain";
      addEthereumChainRequest.params.request.params = [
        {
          chainId: "0x1",
          blockExplorerUrls: ["https://etherscan.io"],
          chainName: "Ethereum",
          nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: ["https://rpc.ethereum.org"],
        },
      ] as WalletConnectAddEthereumChainRequestParams;
    });

    it("is not supported", async () => {
      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: addEthereumChainRequest,
      });

      expect(signClientMock.respond).toHaveBeenCalledWith({
        topic: REQUEST_EVENT_MOCK.topic,
        response: {
          id: REQUEST_EVENT_MOCK.id,
          jsonrpc: "2.0",
          result: {
            code: 500,
            message: "Unsupported request method: wallet_addEthereumChain",
          },
        },
      });
    });
  });

  describe("wallet_switchEthereumChain", () => {
    let switchEthereumChainRequest: WalletConnectSessionRequestEvent;
    beforeEach(() => {
      switchEthereumChainRequest = cloneObject(REQUEST_EVENT_MOCK);
      switchEthereumChainRequest.params.request.method =
        "wallet_switchEthereumChain";
      switchEthereumChainRequest.params.request.params = [
        {
          chainId: "0x1",
        },
      ] as WalletConnectSwitchEthereumChainRequestParams;
    });

    it("switches the chain", async () => {
      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: switchEthereumChainRequest,
      });

      expect(walletMock.switchChain).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
        }),
      );
    });

    it("does not switch the chain if already set", async () => {
      walletMock.getChain.mockReturnValue(defineChain(1));
      await fulfillRequest({
        walletConnectClient: signClientMock,
        wallet: walletMock,
        event: switchEthereumChainRequest,
      });

      expect(walletMock.switchChain).not.toHaveBeenCalled();
    });
  });
});
