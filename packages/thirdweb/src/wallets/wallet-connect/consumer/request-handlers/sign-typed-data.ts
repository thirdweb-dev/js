import type { Hex } from "../../../../utils/encoding/hex.js";
import type { Account } from "../../../interfaces/wallet.js";
import type { WalletConnectSignTypedDataRequestParams } from "../types.js";
import { validateAccountAddress } from "../utils.js";

/**
 * @internal
 */
export async function handleSignTypedDataRequest(options: {
  account: Account;
  params: WalletConnectSignTypedDataRequestParams;
}): Promise<Hex> {
  const { account, params } = options;

  validateAccountAddress(account, params[0]);

  return account.signTypedData(
    // The data could be sent to us as a string or object, depending on the level of parsing on the client side
    typeof params[1] === "string" ? JSON.parse(params[1]) : params[1],
  );
}
