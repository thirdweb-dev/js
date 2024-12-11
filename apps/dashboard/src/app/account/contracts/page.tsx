import { redirect } from "next/navigation";
import { getAuthTokenWalletAddress } from "../../api/lib/getAuthToken";
import { DeployedContractsPage } from "./_components/DeployedContractsPage";

export default async function Page() {
  const accountAddress = await getAuthTokenWalletAddress();

  if (!accountAddress) {
    return redirect(`/login?next=${encodeURIComponent("/account/contracts")}`);
  }

  return <DeployedContractsPage address={accountAddress} />;
}
