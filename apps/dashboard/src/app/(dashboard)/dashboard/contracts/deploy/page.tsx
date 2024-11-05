import { redirect } from "next/navigation";
import { getAuthTokenWalletAddress } from "../../../../api/lib/getAuthToken";
import { DeployedContractsPage } from "../../../../team/[team_slug]/[project_slug]/contracts/_components/DeployedContractsPage";

export default async function Page() {
  const accountAddress = await getAuthTokenWalletAddress();
  if (!accountAddress) {
    return redirect(
      `/login?next=${encodeURIComponent("/dashboard/contracts/deploy")}`,
    );
  }

  return (
    <DeployedContractsPage
      address={accountAddress}
      className="flex grow flex-col"
    />
  );
}
