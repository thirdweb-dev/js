import { getAddress } from "../../utils/address.js";
import type { Prettify } from "../../utils/type-utils.js";
import {
  type CoinbaseWalletCreationOptions,
  isCoinbaseSDKWallet,
} from "../coinbase/coinbase-web.js";
import { isInAppWallet } from "../in-app/core/wallet/index.js";
import { getInjectedProvider } from "../injected/index.js";
import type { Ethereum } from "../interfaces/ethereum.js";
import type { Wallet } from "../interfaces/wallet.js";
import { isWalletConnect } from "../wallet-connect/controller.js";
import type { WalletId } from "../wallet-types.js";
import type { WalletCapabilities, WalletCapabilitiesRecord } from "./types.js";

export type GetCapabilitiesOptions<ID extends WalletId = WalletId> = {
  wallet: Wallet<ID>;
  chainId?: number;
};

export type GetCapabilitiesResult = Prettify<
  WalletCapabilitiesRecord<WalletCapabilities, number>
>;

/**
 * Get the capabilities of a wallet based on the [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792) specification.
 *
 *  This function is dependent on the wallet's support for EIP-5792, but will not throw.
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
  chainId,
}: GetCapabilitiesOptions<ID>): Promise<GetCapabilitiesResult> {
  const account = wallet.getAccount();
  if (!account) {
    return {
      message: `Can't get capabilities, no account connected for wallet: ${wallet.id}`,
    };
  }

  if (wallet.id === "smart") {
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

  // TODO: Add Wallet Connect support
  if (isWalletConnect(wallet)) {
    return {
      message: "getCapabilities is not yet supported with Wallet Connect",
    };
  }

  let provider: Ethereum;
  if (isCoinbaseSDKWallet(wallet)) {
    const { getCoinbaseWebProvider } = await import(
      "../coinbase/coinbase-web.js"
    );
    const config = wallet.getConfig() as CoinbaseWalletCreationOptions;
    provider = (await getCoinbaseWebProvider(config)) as Ethereum;
  } else {
    provider = getInjectedProvider(wallet.id);
  }

  try {
    const result = await provider.request({
      method: "wallet_getCapabilities",
      params: [getAddress(account.address)],
    });
    const capabilities = {} as WalletCapabilitiesRecord<
      WalletCapabilities,
      number
    >;
    for (const [chainId, capabilities_] of Object.entries(result)) {
      capabilities[Number(chainId)] = {};
      const capabilitiesCopy = {} as WalletCapabilities;
      for (const [key, value] of Object.entries(capabilities_)) {
        capabilitiesCopy[key] = value;
      }
      capabilities[Number(chainId)] = capabilitiesCopy;
    }
    return (
      typeof chainId === "number" ? capabilities[chainId] : capabilities
    ) as never;
  } catch (error: unknown) {
    if (/unsupport|not support|not available/i.test((error as Error).message)) {
      return {
        message: `${wallet.id} does not support wallet_getCapabilities, reach out to them directly to request EIP-5792 support.`,
      };
    }
    throw error;
  }
}
