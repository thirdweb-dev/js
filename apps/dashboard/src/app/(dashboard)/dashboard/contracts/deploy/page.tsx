import { redirect } from "next/navigation";
import { getAuthTokenWalletAddress } from "../../../../api/lib/getAuthToken";
import { DeployedContractsPage } from "../../../../team/[team_slug]/[project_slug]/contracts/_components/DeployedContractsPage";

export default function Page() {
  const accountAddress = getAuthTokenWalletAddress();
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
