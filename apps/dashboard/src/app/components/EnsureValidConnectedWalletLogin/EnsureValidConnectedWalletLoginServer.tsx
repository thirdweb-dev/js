import { getRawAccount } from "../../account/settings/getAccount";
import { getAuthToken } from "../../api/lib/getAuthToken";
import { EnsureValidConnectedWalletLoginClient } from "./EnsureValidConnectedWalletLoginClient";

// when the user is connected with a wallet and logged in
// ensure that the wallet is a valid wallet for the active account
// if not, redirect to login page

export async function EnsureValidConnectedWalletLoginServer() {
  const [account, accountAuthToken] = await Promise.all([
    getRawAccount(),
    getAuthToken(),
  ]);

  if (account && accountAuthToken) {
    return (
      <EnsureValidConnectedWalletLoginClient
        account={account}
        authToken={accountAuthToken}
      />
    );
  }

  return null;
}
