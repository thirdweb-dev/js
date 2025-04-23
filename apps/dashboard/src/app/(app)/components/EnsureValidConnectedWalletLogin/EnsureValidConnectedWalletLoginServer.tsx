import { getAuthTokenWalletAddress } from "../../api/lib/getAuthToken";
import { EnsureValidConnectedWalletLoginClient } from "./EnsureValidConnectedWalletLoginClient";

// ensure that address in backend matches connected wallet address
// if there's a mismatch - redirect to login page

export async function EnsureValidConnectedWalletLoginServer() {
  const address = await getAuthTokenWalletAddress();

  if (address) {
    return <EnsureValidConnectedWalletLoginClient loggedInAddress={address} />;
  }

  return null;
}
