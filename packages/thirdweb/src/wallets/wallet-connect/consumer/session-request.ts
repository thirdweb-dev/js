import type { Wallet } from "../../interfaces/wallet.js";
import type { WalletConnectClient } from "./index.js";
import type {
  WalletConnectRawTransactionRequestParams,
  WalletConnectSessionRequestEvent,
  WalletConnectSignRequestPrams,
  WalletConnectSignTypedDataRequestParams,
  WalletConnectTransactionRequestParams,
} from "./types.js";

/**
 * @internal
 */
export async function fulfillRequest(options: {
  wallet: Wallet;
  walletConnectClient: WalletConnectClient;
  event: WalletConnectSessionRequestEvent;
}) {
  const {
    wallet,
    walletConnectClient,
    event: {
      topic,
      id,
      params: { chainId: rawChainId, request },
    },
  } = options;

  const account = wallet.getAccount();
  if (!account) {
    throw new Error("[WalletConnect] No account connected to provided wallet");
  }

  let result: unknown;
  switch (request.method) {
    case "personal_sign":
    case "eth_sign": {
      const { handleSignRequest } = await import("./request-handlers/sign.js");
      result = await handleSignRequest({
        account,
        params: request.params as WalletConnectSignRequestPrams,
      });
      break;
    }
    case "eth_signTypedData":
    case "eth_signTypedData_v4": {
      const { handleSignTypedDataRequest } = await import(
        "./request-handlers/sign-typed-data.js"
      );
      result = await handleSignTypedDataRequest({
        account,
        params: request.params as WalletConnectSignTypedDataRequestParams,
      });
      break;
    }
    case "eth_signTransaction": {
      const { handleSignTransactionRequest } = await import(
        "./request-handlers/sign-transaction.js"
      );
      result = await handleSignTransactionRequest({
        account,
        params: request.params as WalletConnectTransactionRequestParams,
      });
      break;
    }
    case "eth_sendTransaction": {
      const { parseEip155ChainId } = await import("./utils.js");
      const { handleSendTransactionRequest } = await import(
        "./request-handlers/send-transaction.js"
      );
      const chainId = parseEip155ChainId(rawChainId);

      result = await handleSendTransactionRequest({
        account,
        chainId,
        params: request.params as WalletConnectTransactionRequestParams,
      });
      break;
    }
    case "eth_sendRawTransaction": {
      const { parseEip155ChainId } = await import("./utils.js");
      const { handleSendRawTransactionRequest } = await import(
        "./request-handlers/send-raw-transaction.js"
      );
      const chainId = parseEip155ChainId(rawChainId);

      result = await handleSendRawTransactionRequest({
        account,
        chainId,
        params: request.params as WalletConnectRawTransactionRequestParams,
      });
      break;
    }
    default:
      throw new Error(
        `[WalletConnect] Unsupported request method: ${request.method}`,
      );
  }

  walletConnectClient.respond({
    topic,
    response: {
      id,
      jsonrpc: "2.0",
      result,
    },
  });
}
