import type { GetCapabilitiesResult } from "../../eip5792/get-capabilities.js";
import { parseCapabilities } from "../../eip5792/utils.js";
import type { Wallet } from "../../interfaces/wallet.js";
import { getInjectedProvider } from "../index.js";

/**
 * @internal
 */
export async function getInjectedWalletCapabilities(args: {
  wallet: Wallet;
}): Promise<GetCapabilitiesResult> {
  const { wallet } = args;

  const provider = getInjectedProvider(wallet.id);

  const account = wallet.getAccount();
  if (!account) {
    return {
      message: "No account connected",
    };
  }

  const raw_capabilities = await provider.request({
    method: "wallet_getCapabilities",
    params: [account.address],
  });

  if ("code" in raw_capabilities && raw_capabilities.code === -32601) {
    const chain = wallet.getChain();
    const response: GetCapabilitiesResult = {
      message: `${wallet.id} does not support wallet_getCapabilities, reach out to them directly to request EIP-5792 support.`,
    };
    if (chain) {
      response[chain.id] = {};
    }
    return response;
  }

  return parseCapabilities(raw_capabilities);
}
