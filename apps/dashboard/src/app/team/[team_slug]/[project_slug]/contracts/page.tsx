import { redirect } from "next/navigation";
import { DeployedContractsPage } from "../../../../account/contracts/_components/DeployedContractsPage";
import { getAuthTokenWalletAddress } from "../../../../api/lib/getAuthToken";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const accountAddress = await getAuthTokenWalletAddress();

  if (!accountAddress) {
    const { team_slug, project_slug } = await props.params;
    return redirect(
      `/login?next=${encodeURIComponent(`/team/${team_slug}/${project_slug}/contracts`)}`,
    );
  }

  return (
    <div className="container flex grow flex-col">
      <DeployedContractsPage
        address={accountAddress}
        className="flex grow flex-col pt-10 pb-10"
      />
    </div>
  );
}
