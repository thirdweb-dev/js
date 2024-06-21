import type { Hex } from "../../../utils/encoding/hex.js";
import type { Wallet } from "../../interfaces/wallet.js";
import type {
  WalletConnectAddEthereumChainRequestParams,
  WalletConnectClient,
  WalletConnectSwitchEthereumChainRequestParams,
} from "./types.js";
import type {
  WalletConnectRawTransactionRequestParams,
  WalletConnectRequestError,
  WalletConnectRequestHandlers,
  WalletConnectSessionRequestEvent,
  WalletConnectSignRequestPrams,
  WalletConnectSignTypedDataRequestParams,
  WalletConnectTransactionRequestParams,
} from "./types.js";
import { parseEip155ChainId } from "./utils.js";

/**
 * @internal
 */
export async function fulfillRequest(options: {
  wallet: Wallet;
  walletConnectClient: WalletConnectClient;
  event: WalletConnectSessionRequestEvent;
  handlers?: WalletConnectRequestHandlers;
}) {
  const {
    wallet,
    walletConnectClient,
    event: {
      topic,
      id,
      params: { chainId: rawChainId, request },
    },
    handlers,
  } = options;

  const account = wallet.getAccount();
  if (!account) {
    throw new Error("No account connected to provided wallet");
  }

  let result: WalletConnectRequestError | Hex;
  try {
    switch (request.method) {
      case "personal_sign": {
        if (handlers?.personal_sign) {
          result = await handlers.personal_sign({
            account,
            params: request.params as WalletConnectSignRequestPrams,
          });
        } else {
          const { handleSignRequest } = await import(
            "./request-handlers/sign.js"
          );
          result = await handleSignRequest({
            account,
            params: request.params as WalletConnectSignRequestPrams,
          });
        }
        break;
      }
      case "eth_sign": {
        if (handlers?.eth_sign) {
          result = await handlers.eth_sign({
            account,
            params: request.params as WalletConnectSignRequestPrams,
          });
        } else {
          const { handleSignRequest } = await import(
            "./request-handlers/sign.js"
          );
          result = await handleSignRequest({
            account,
            params: request.params as WalletConnectSignRequestPrams,
          });
        }
        break;
      }
      case "eth_signTypedData": {
        if (handlers?.eth_signTypedData) {
          result = await handlers.eth_signTypedData({
            account,
            params: request.params as WalletConnectSignTypedDataRequestParams,
          });
        } else {
          const { handleSignTypedDataRequest } = await import(
            "./request-handlers/sign-typed-data.js"
          );
          result = await handleSignTypedDataRequest({
            account,
            params: request.params as WalletConnectSignTypedDataRequestParams,
          });
        }
        break;
      }
      case "eth_signTypedData_v4": {
        if (handlers?.eth_signTypedData_v4) {
          result = await handlers.eth_signTypedData_v4({
            account,
            params: request.params as WalletConnectSignTypedDataRequestParams,
          });
        } else {
          const { handleSignTypedDataRequest } = await import(
            "./request-handlers/sign-typed-data.js"
          );
          result = await handleSignTypedDataRequest({
            account,
            params: request.params as WalletConnectSignTypedDataRequestParams,
          });
        }
        break;
      }
      case "eth_signTransaction": {
        if (handlers?.eth_signTransaction) {
          result = await handlers.eth_signTransaction({
            account,
            params: request.params as WalletConnectTransactionRequestParams,
          });
        } else {
          const { handleSignTransactionRequest } = await import(
            "./request-handlers/sign-transaction.js"
          );
          result = await handleSignTransactionRequest({
            account,
            params: request.params as WalletConnectTransactionRequestParams,
          });
        }
        break;
      }
      case "eth_sendTransaction": {
        const chainId = parseEip155ChainId(rawChainId);
        if (handlers?.eth_sendTransaction) {
          result = await handlers.eth_sendTransaction({
            account,
            chainId,
            params: request.params as WalletConnectTransactionRequestParams,
          });
        } else {
          const { handleSendTransactionRequest } = await import(
            "./request-handlers/send-transaction.js"
          );

          result = await handleSendTransactionRequest({
            account,
            chainId,
            params: request.params as WalletConnectTransactionRequestParams,
          });
        }
        break;
      }
      case "eth_sendRawTransaction": {
        const chainId = parseEip155ChainId(rawChainId);
        if (handlers?.eth_sendRawTransaction) {
          result = await handlers.eth_sendRawTransaction({
            account,
            chainId,
            params: request.params as WalletConnectRawTransactionRequestParams,
          });
        } else {
          const { handleSendRawTransactionRequest } = await import(
            "./request-handlers/send-raw-transaction.js"
          );

          result = await handleSendRawTransactionRequest({
            account,
            chainId,
            params: request.params as WalletConnectRawTransactionRequestParams,
          });
        }
        break;
      }
      case "wallet_addEthereumChain": {
        if (handlers?.wallet_addEthereumChain) {
          result = await handlers.wallet_addEthereumChain({
            wallet,
            params:
              request.params as WalletConnectAddEthereumChainRequestParams,
          });
        } else {
          throw new Error(
            "Unsupported request method: wallet_addEthereumChain",
          );
        }
        break;
      }
      case "wallet_switchEthereumChain": {
        if (handlers?.wallet_switchEthereumChain) {
          result = await handlers.wallet_switchEthereumChain({
            wallet,
            params:
              request.params as WalletConnectSwitchEthereumChainRequestParams,
          });
        } else {
          const { handleSwitchChain } = await import(
            "./request-handlers/switch-chain.js"
          );

          result = await handleSwitchChain({
            wallet,
            params:
              request.params as WalletConnectSwitchEthereumChainRequestParams,
          });
        }
        break;
      }
      default: {
        const potentialHandler = handlers?.[request.method];
        if (potentialHandler) {
          result = await potentialHandler({
            account,
            chainId: parseEip155ChainId(rawChainId),
            params: request.params,
          });
        } else {
          throw new Error(`Unsupported request method: ${request.method}`);
        }
      }
    }
  } catch (error: unknown) {
    result = {
      code:
        typeof error === "object" && error !== null && "code" in error
          ? (error as { code: number }).code
          : 500,
      message:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Unknown error",
    };
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
