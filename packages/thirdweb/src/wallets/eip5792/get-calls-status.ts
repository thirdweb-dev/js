import type { ThirdwebClient } from "../../client/client.js";
import { hexToBigInt, hexToNumber } from "../../utils/encoding/hex.js";
import { isCoinbaseSDKWallet } from "../coinbase/coinbase-web.js";
import { isInAppWallet } from "../in-app/core/wallet/index.js";
import { getInjectedProvider } from "../injected/index.js";
import type { Ethereum } from "../interfaces/ethereum.js";
import type { Wallet } from "../interfaces/wallet.js";
import { isSmartWallet } from "../smart/index.js";
import { isWalletConnect } from "../wallet-connect/controller.js";
import type {
  GetCallsStatusRawResponse,
  GetCallsStatusResponse,
  WalletSendCallsId,
} from "./types.js";

export type GetCallsStatusOptions = {
  wallet: Wallet;
  client: ThirdwebClient;
  id: WalletSendCallsId;
};

/**
 * Get the status of an [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) bundle.
 *
 *  This function is dependent on the wallet's support for EIP-5792 and could fail.
 *
 * @param {GetCallsStatusOptions} options
 * @param {Wallet} options.wallet - The wallet that send the original calls.
 * @param {ThirdwebClient} options.client - A {@link ThirdwebClient} instance.
 * @param {WalletSendCallsId} options.bundleId - The ID of the bundle to get the status of.
 * @throws an error if the wallet does not support EIP-5792.
 * @returns {Promise<GetCallsStatusResponse>} - A promise that resolves to the bundle's status and receipts (if available). {@link GetCallsStatusResponse}
 * @beta
 * @example
 * ```ts
 *  import { createThirdwebClient } from "thirdweb";
 *  import { sendCalls, getCallsStatus } from "thirdweb/wallets/eip5792";
 *
 *  const client = createThirdwebClient({ clientId: ... });
 *
 *  const result = await sendCalls({ wallet, client, calls });
 *
 *  let result;
 *  while (result.status !== "success") {
 *    result = await getCallsStatus(result);
 *  }
 * ```
 * @extension EIP5792
 */
export async function getCallsStatus({
  wallet,
  client,
  id,
}: GetCallsStatusOptions): Promise<GetCallsStatusResponse> {
  const account = wallet.getAccount();
  if (!account) {
    throw new Error(
      `Failed to get call status, no account found for wallet ${wallet.id}`,
    );
  }

  // These conveniently operate the same
  if (isSmartWallet(wallet) || isInAppWallet(wallet)) {
    const { inAppWalletGetCallsStatus } = await import(
      "../in-app/core/eip5972/in-app-wallet-calls.js"
    );
    return inAppWalletGetCallsStatus({ client, id, wallet });
  }

  if (isWalletConnect(wallet)) {
    throw new Error("getCallsStatus is not yet supported for Wallet Connect");
  }

  let provider: Ethereum;
  if (isCoinbaseSDKWallet(wallet)) {
    const { getCoinbaseWebProvider } = await import(
      "../coinbase/coinbase-web.js"
    );
    const config = wallet.getConfig();
    provider = (await getCoinbaseWebProvider(config)) as Ethereum;
  } else {
    provider = getInjectedProvider(wallet.id);
  }

  try {
    const {
      atomic = false,
      chainId,
      receipts,
      version = "2.0.0",
      ...response
    } = (await provider.request({
      method: "wallet_getCallsStatus",
      params: [id],
    })) as GetCallsStatusRawResponse;
    const [status, statusCode] = (() => {
      const statusCode = response.status;
      if (statusCode >= 100 && statusCode < 200)
        return ["pending", statusCode] as const;
      if (statusCode >= 200 && statusCode < 300)
        return ["success", statusCode] as const;
      if (statusCode >= 300 && statusCode < 700)
        return ["failure", statusCode] as const;
      // @ts-expect-error: for backwards compatibility
      if (statusCode === "CONFIRMED") return ["success", 200] as const;
      // @ts-expect-error: for backwards compatibility
      if (statusCode === "PENDING") return ["pending", 100] as const;
      return [undefined, statusCode];
    })();
    return {
      ...response,
      atomic,
      // @ts-expect-error: for backwards compatibility
      chainId: chainId ? hexToNumber(chainId) : undefined,
      receipts:
        receipts?.map((receipt) => ({
          ...receipt,
          blockNumber: hexToBigInt(receipt.blockNumber),
          gasUsed: hexToBigInt(receipt.gasUsed),
          status: receiptStatuses[receipt.status as "0x0" | "0x1"],
        })) ?? [],
      status,
      statusCode,
      version,
    };
  } catch (error) {
    if (/unsupport|not support/i.test((error as Error).message)) {
      throw new Error(
        `${wallet.id} does not support wallet_getCallsStatus, reach out to them directly to request EIP-5792 support.`,
      );
    }
    throw error;
  }
}

const receiptStatuses = {
  "0x0": "reverted",
  "0x1": "success",
} as const;
