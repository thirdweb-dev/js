import { getAuthTokenWalletAddress } from "../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../login/loginRedirect";
import { PublishedContractsPage } from "./PublishedContractsPage";

export default async function Page() {
  const accountAddress = await getAuthTokenWalletAddress();

  if (!accountAddress) {
    loginRedirect("/account/contracts");
  }

  return <PublishedContractsPage publisherAddress={accountAddress} />;
}
