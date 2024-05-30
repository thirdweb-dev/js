import { SignClient } from "@walletconnect/sign-client";
import { hexToNumber } from "viem";
import { hexToBigInt } from "../../../utils/encoding/hex.js";
import type { Prettify } from "../../../utils/type-utils.js";
import type { Account, Wallet } from "../../../wallets/interfaces/wallet.js";
import { getDefaultAppMetadata } from "../../utils/defaultDappMetadata.js";
import { DEFAULT_PROJECT_ID } from "../constants.js";
import type {
  WalletConnectConfig,
  WalletConnectRawTransactionRequestParams,
  WalletConnectSession,
  WalletConnectSessionEvent,
  WalletConnectSessionProposalEvent,
  WalletConnectSessionRequestEvent,
  WalletConnectSignRequestPrams,
  WalletConnectSignTypedDataRequestParams,
  WalletConnectTransactionRequestParams,
} from "../types.js";
import { onSessionProposal } from "./session-proposal.js";

export type WalletConnectClient = Awaited<ReturnType<typeof SignClient.init>>;

export type CreateWalletConnectSessionOptions = Prettify<
  WalletConnectConfig & {
    /**
     * The thirdweb wallet that will be connected to the WalletConnect session.
     */
    wallet: Wallet;

    /**
     * The WalletConnect client returned from `createWalletConnectClient`
     */
    walletConnectClient: WalletConnectClient;

    /**
     * The WalletConnect session URI retrieved from the dApp to connect with.
     */
    uri: string;
  }
>;

export const walletConnectSessions: WeakMap<Wallet, WalletConnectSession> =
  new WeakMap();

export async function createWalletConnectClient(
  options?: WalletConnectConfig,
): Promise<WalletConnectClient> {
  const defaults = getDefaultAppMetadata();
  return await SignClient.init({
    projectId: options?.projectId ?? DEFAULT_PROJECT_ID,
    metadata: {
      name: options?.appMetadata?.name ?? defaults.name,
      url: options?.appMetadata?.url ?? defaults.url,
      description: options?.appMetadata?.description ?? defaults.description,
      icons: [options?.appMetadata?.logoUrl ?? defaults.logoUrl],
    },
  });
}

export function createWalletConnectSession(
  options: CreateWalletConnectSessionOptions,
) {
  const { uri, walletConnectClient, wallet } = options;

  walletConnectClient.on(
    "session_proposal",
    async (event: WalletConnectSessionProposalEvent) => {
      onSessionProposal({ wallet, walletConnectClient, event });
    },
  );

  walletConnectClient.on(
    "session_request",
    async (event: WalletConnectSessionRequestEvent) => {
      console.log("Received session request", event);
      fulfillRequest({ wallet, walletConnectClient, event });
    },
  );

  walletConnectClient.on(
    "session_event",
    async (event: WalletConnectSessionEvent) => {
      console.log("Received session event", event);
    },
  );

  walletConnectClient.core.pairing.pair({ uri });
}

export function hasActiveWalletConnectSession(wallet: Wallet): boolean {
  return walletConnectSessions.has(wallet);
}

export function getActiveWalletConnectSession(
  wallet: Wallet,
): WalletConnectSession | undefined {
  return walletConnectSessions.get(wallet);
}

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
      const signParams = request.params as WalletConnectSignRequestPrams; // WalletConnect only gives us an any back so we have to assume this
      if (account.address !== signParams[1]) {
        throw new Error(
          `[WalletConnect] Active account address (${account.address}) differs from requested address (${signParams[1]})`,
        );
      }
      result = await account.signMessage({ message: signParams[0] });
      break;
    }
    case "eth_signTypedData":
    case "eth_signTypedData_v4": {
      const signTypedDataParams =
        request.params as WalletConnectSignTypedDataRequestParams;
      if (account.address !== signTypedDataParams[0]) {
        throw new Error(
          `[WalletConnect] Active account address (${account.address}) differs from requested address (${signTypedDataParams[0]})`,
        );
      }

      result = await account.signTypedData(
        typeof signTypedDataParams[1] === "string"
          ? JSON.parse(signTypedDataParams[1])
          : signTypedDataParams[1],
      );
      break;
    }
    case "eth_signTransaction": {
      if (!account.signTransaction) {
        throw new Error(
          "[WalletConnect] The current account does not support signing transactions",
        );
      }
      const transaction = (
        request.params as WalletConnectTransactionRequestParams
      )[0];
      if (
        transaction.from !== undefined &&
        transaction.from !== account.address
      ) {
        throw new Error(
          `[WalletConnect] Active account address (${account.address}) differs from transaction \`from\` address (${transaction.from})`,
        );
      }
      result = await account.signTransaction({
        gas: transaction.gas ? hexToBigInt(transaction.gas) : undefined,
        gasPrice: transaction.gasPrice
          ? hexToBigInt(transaction.gasPrice)
          : undefined,
        value: transaction.value ? hexToBigInt(transaction.value) : undefined,
        nonce: transaction.nonce ? hexToNumber(transaction.nonce) : undefined,
        to: transaction.to,
        data: transaction.data,
      });
      break;
    }
    case "eth_sendTransaction": {
      const chainId = Number.parseInt(rawChainId?.split(":")[1] ?? "0"); // chainId is of the form "eip155:1234"
      if (!chainId) {
        throw new Error(
          `[WalletConnect] Invalid chainId ${rawChainId}, request chainId should have the format 'eip155:1'`,
        );
      }

      const transaction = (
        request.params as WalletConnectTransactionRequestParams
      )[0];

      if (
        transaction.from !== undefined &&
        transaction.from !== account.address
      ) {
        throw new Error(
          `[WalletConnect] Active account address (${account.address}) differs from transaction \`from\` address (${transaction.from})`,
        );
      }
      const txHash = await account.sendTransaction({
        gas: transaction.gas ? hexToBigInt(transaction.gas) : undefined,
        gasPrice: transaction.gasPrice
          ? hexToBigInt(transaction.gasPrice)
          : undefined,
        value: transaction.value ? hexToBigInt(transaction.value) : undefined,
        nonce: transaction.nonce ? hexToNumber(transaction.nonce) : undefined,
        to: transaction.to,
        data: transaction.data,
        chainId,
      });
      result = txHash;
      break;
    }
    case "eth_sendRawTransaction": {
      if (!account.sendRawTransaction) {
        throw new Error(
          "[WalletConnect] The current account does not support sending raw transactions",
        );
      }

      const chainId = Number.parseInt(rawChainId?.split(":")[1] ?? "0"); // chainId is of the form "eip155:1234"
      if (!chainId) {
        throw new Error(
          `[WalletConnect] Invalid chainId ${rawChainId}, request chainId should have the format 'eip155:1'`,
        );
      }

      const rawTransaction = (
        request.params as WalletConnectRawTransactionRequestParams
      )[0];
      const txHash = await account.sendRawTransaction({
        rawTransaction,
        chainId,
      });
      result = txHash;
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
