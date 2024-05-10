import type { WalletSendCallsParameters as ViemWalletSendCallsParameters } from "viem";
import type { Chain } from "../../chains/types.js";
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
    capabilities = {},
    version = "1.0",
    chain = wallet.getChain(),
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

  if (isSmartWallet(wallet)) {
    throw new Error("Not implemented");
  }

  if (isInAppWallet(wallet)) {
    throw new Error("Not implemented");
  }

  if (isCoinbaseSDKWallet(wallet)) {
    throw new Error("Not implemented");
  }

  if (isWalletConnect(wallet)) {
    throw new Error("Not implemented");
  }

  const params: WalletSendCallsParameters = [
    {
      from: getAddress(account.address),
      calls: calls.map((call) =>
        call.to
          ? {
              to: call.to,
              data: call.data,
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
  // Default to injected wallet
  const provider = getInjectedProvider(wallet.id);
  return await provider.request({
    method: "wallet_sendCalls",
    params: params as ViemWalletSendCallsParameters, // The viem type definition is slightly different
  });
}
