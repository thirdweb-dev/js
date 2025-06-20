import type { ThirdwebClient } from "../../../client/client.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { Wallet } from "../../interfaces/wallet.js";
import { handleSendRawTransactionRequest } from "./request-handlers/send-raw-transaction.js";
import { handleSendTransactionRequest } from "./request-handlers/send-transaction.js";
// Due to some edge cases, we can't import these handlers dynamically
import { handleSignRequest } from "./request-handlers/sign.js";
import { handleSignTransactionRequest } from "./request-handlers/sign-transaction.js";
import { handleSignTypedDataRequest } from "./request-handlers/sign-typed-data.js";
import type {
  WalletConnectAddEthereumChainRequestParams,
  WalletConnectClient,
  WalletConnectRawTransactionRequestParams,
  WalletConnectRequestError,
  WalletConnectRequestHandlers,
  WalletConnectSessionRequestEvent,
  WalletConnectSignRequestPrams,
  WalletConnectSignTypedDataRequestParams,
  WalletConnectSwitchEthereumChainRequestParams,
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
  thirdwebClient: ThirdwebClient;
  handlers?: WalletConnectRequestHandlers;
}) {
  const {
    wallet,
    walletConnectClient,
    thirdwebClient,
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
          result = await handleSendTransactionRequest({
            account,
            chainId,
            params: request.params as WalletConnectTransactionRequestParams,
            thirdwebClient,
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
            params:
              request.params as WalletConnectAddEthereumChainRequestParams,
            wallet,
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
            params:
              request.params as WalletConnectSwitchEthereumChainRequestParams,
            wallet,
          });
        } else {
          const { handleSwitchChain } = await import(
            "./request-handlers/switch-chain.js"
          );

          result = await handleSwitchChain({
            params:
              request.params as WalletConnectSwitchEthereumChainRequestParams,
            wallet,
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
    response: {
      id,
      jsonrpc: "2.0",
      result,
    },
    topic,
  });
}
