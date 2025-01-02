import type { Hex } from "../../../../utils/encoding/hex.js";
import type { Account } from "../../../interfaces/wallet.js";
import type { WalletConnectSignRequestPrams } from "../types.js";
import { validateAccountAddress } from "../utils.js";

/**
 * @internal
 */
export async function handleSignRequest(options: {
  account: Account;
  params: WalletConnectSignRequestPrams;
}): Promise<Hex> {
  const { account, params } = options;

  validateAccountAddress(account, params[1]);
  return account.signMessage({ message: { raw: params[0] as Hex } });
}
