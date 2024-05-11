import type { WalletSendCallsParameters as ViemWalletSendCallsParameters } from "viem";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getAddress } from "../../utils/address.js";
import { type Hex, numberToHex } from "../../utils/encoding/hex.js";
import type { OneOf } from "../../utils/type-utils.js";
import { isCoinbaseSDKWallet } from "../coinbase/coinbaseSDKWallet.js";
import { isInAppWallet } from "../in-app/core/wallet/index.js";
import { getInjectedProvider } from "../injected/index.js";
import type { Wallet } from "../interfaces/wallet.js";
import { isSmartWallet } from "../smart/index.js";
import { isWalletConnect } from "../wallet-connect/index.js";
import type { WalletId } from "../wallet-types.js";
import type { WalletSendCallsId, WalletSendCallsParameters } from "./types.js";

export type SendCallsOptions<ID extends WalletId = WalletId> = {
  wallet: Wallet<ID>;
  client: ThirdwebClient;
  calls: OneOf<
    | {
        to: Hex;
        data?: Hex | undefined;
        value?: bigint | undefined;
      }
    | {
        data: Hex; // Contract creation case
      }
  >[];
  capabilities?: WalletSendCallsParameters[number]["capabilities"];
  version?: WalletSendCallsParameters[number]["version"];
  chain?: Chain;
};

export type SendCallsResult = WalletSendCallsId;

export async function sendCalls<const ID extends WalletId>(
  options: SendCallsOptions<ID>,
): Promise<SendCallsResult> {
  const {
    wallet,
    calls,
    capabilities,
    version = "1.0",
    chain = wallet.getChain(),
    client,
  } = options;

  if (!chain) {
    throw new Error(
      `Cannot send calls, no active chain found for wallet: ${wallet.id}`,
    );
  }

  const account = wallet.getAccount();
  if (!account) {
    throw new Error(
      `Cannot send calls, no account connected for wallet: ${wallet.id}`,
    );
  }

  // These conveniently operate the same
  if (isSmartWallet(wallet) || isInAppWallet(wallet)) {
    const { inAppWalletSendCalls } = await import(
      "../in-app/core/lib/in-app-wallet-calls.js"
    );
    return inAppWalletSendCalls({ wallet, chain, client, calls });
  }

  const injectedWalletCallParams: WalletSendCallsParameters = [
    {
      from: getAddress(account.address),
      calls: calls.map((call) =>
        call.to
          ? {
              ...call,
              value: call.value ? numberToHex(call.value) : undefined,
            }
          : {
              data: call.data,
            },
      ),
      capabilities,
      version,
      chainId: numberToHex(chain.id),
    },
  ];

  if (isCoinbaseSDKWallet(wallet)) {
    const { coinbaseSDKWalletSendCalls } = await import(
      "../coinbase/coinbaseSDKWallet.js"
    );
    return coinbaseSDKWalletSendCalls({
      wallet,
      params: injectedWalletCallParams,
    });
  }

  if (isWalletConnect(wallet)) {
    throw new Error("sendCalls is not yet supported for Wallet Connect");
  }

  // Default to injected wallet
  const provider = getInjectedProvider(wallet.id);
  try {
    return await provider.request({
      method: "wallet_sendCalls",
      params: injectedWalletCallParams as ViemWalletSendCallsParameters, // The viem type definition is slightly different
    });
  } catch (error) {
    if (/unsupport|not support/i.test((error as Error).message)) {
      throw new Error(
        `${wallet.id} does not support wallet_sendCalls, reach out to them directly to request EIP-5792 support.`,
      );
    }
    throw error;
  }
}
