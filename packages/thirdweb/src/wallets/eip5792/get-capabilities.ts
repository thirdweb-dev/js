import type { Prettify } from "../../utils/type-utils.js";
import type { Wallet } from "../interfaces/wallet.js";
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

  if (account.getCapabilities) {
    return account.getCapabilities({ chainId });
  }

  throw new Error(
    `Failed to get capabilities, wallet ${wallet.id} does not support EIP-5792`,
  );
}

export function toGetCapabilitiesResult(
  result: Record<string, WalletCapabilities>,
  chainId?: number,
): GetCapabilitiesResult {
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
}
