import type { Prettify } from "../../utils/type-utils.js";
import { isCoinbaseSDKWallet } from "../coinbase/coinbaseWebSDK.js";
import { isInAppWallet } from "../in-app/core/wallet/index.js";
import { getInjectedProvider } from "../injected/index.js";
import type { Wallet } from "../interfaces/wallet.js";
import { isSmartWallet } from "../smart/index.js";
import { isWalletConnect } from "../wallet-connect/controller.js";
import type { WalletId } from "../wallet-types.js";
import type { WalletCapabilities, WalletCapabilitiesRecord } from "./types.js";

export type GetCapabilitiesOptions<ID extends WalletId = WalletId> = {
  wallet: Wallet<ID>;
};

export type GetCapabilitiesResult = Prettify<
  WalletCapabilitiesRecord<WalletCapabilities, number>
>;

/**
 * Get the capabilities of a wallet based on the [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) specification.
 *
 * @note This function is dependent on the wallet's support for EIP-5792, but will not throw.
 * **The returned object contains a `message` field detailing any issues with the wallet's support for EIP-5792.**
 *
 * @param {GetCapabilitiesOptions} options
 * @param {Wallet} options.wallet - The wallet to get the capabilities of.
 * @returns {Promise<GetCapabilitiesResult>} - A promise that resolves to the capabilities of the wallet based on the [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) spec.
 * @beta
 * @example
 * ```ts
 * import { getCapabilities } from "thirdweb/wallets/eip5792";
 *
 * const wallet = createWallet("com.coinbase.wallet");
 * const capabilities = await getCapabilities({ wallet });
 * ```
 *
 * @extension EIP5792
 */
export async function getCapabilities<const ID extends WalletId = WalletId>({
  wallet,
}: GetCapabilitiesOptions<ID>): Promise<GetCapabilitiesResult> {
  const account = wallet.getAccount();
  if (!account) {
    return {
      message: `Can't get capabilities, no account connected for wallet: ${wallet.id}`,
    };
  }

  if (isSmartWallet(wallet)) {
    const { smartWalletGetCapabilities } = await import(
      "../smart/lib/smart-wallet-capabilities.js"
    );
    return smartWalletGetCapabilities({ wallet });
  }

  if (isInAppWallet(wallet)) {
    const { inAppWalletGetCapabilities } = await import(
      "../in-app/core/eip5972/in-app-wallet-capabilities.js"
    );
    return inAppWalletGetCapabilities({ wallet });
  }

  if (isCoinbaseSDKWallet(wallet)) {
    const { coinbaseSDKWalletGetCapabilities } = await import(
      "../coinbase/coinbaseWebSDK.js"
    );
    return coinbaseSDKWalletGetCapabilities({ wallet });
  }

  // TODO: Add Wallet Connect support
  if (isWalletConnect(wallet)) {
    return {
      message: "getCapabilities is not yet supported with Wallet Connect",
    };
  }

  // Default to injected wallet
  const provider = getInjectedProvider(wallet.id);

  try {
    return await provider.request({
      method: "wallet_getCapabilities",
      params: [account.address],
    });
  } catch (error: unknown) {
    if (/unsupport|not support|not available/i.test((error as Error).message)) {
      return {
        message: `${wallet.id} does not support wallet_getCapabilities, reach out to them directly to request EIP-5792 support.`,
      };
    }
    throw error;
  }
}
