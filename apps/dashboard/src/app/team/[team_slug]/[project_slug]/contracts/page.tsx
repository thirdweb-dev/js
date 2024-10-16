import { redirect } from "next/navigation";
import { getAuthTokenWalletAddress } from "../../../../api/lib/getAuthToken";
import { DeployedContractsPage } from "./_components/DeployedContractsPage";

export default function Page(props: {
  params: { team_slug: string; project_slug: string };
}) {
  const { team_slug, project_slug } = props.params;
  const accountAddress = getAuthTokenWalletAddress();

  if (!accountAddress) {
    return redirect(
      `/login?next=${encodeURIComponent(`/team/${team_slug}/${project_slug}/contracts`)}`,
    );
  }

  return (
    <DeployedContractsPage
      address={accountAddress}
      className="flex grow flex-col pt-10 pb-10"
    />
  );
}
