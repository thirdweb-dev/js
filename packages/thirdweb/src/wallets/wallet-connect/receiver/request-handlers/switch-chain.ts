import { defineChain } from "../../../../chains/utils.js";
import { type Hex, hexToNumber } from "../../../../utils/encoding/hex.js";
import type { Wallet } from "../../../interfaces/wallet.js";
import type { WalletConnectSwitchEthereumChainRequestParams } from "../types.js";

/**
 * @internal
 */
export async function handleSwitchChain(options: {
  wallet: Wallet;
  params: WalletConnectSwitchEthereumChainRequestParams;
}): Promise<Hex> {
  const { wallet, params } = options;

  if (wallet.getChain()?.id === hexToNumber(params[0].chainId)) {
    return "0x1";
  } else {
    await wallet.switchChain(defineChain(hexToNumber(params[0].chainId)));
    return "0x1";
  }
}
