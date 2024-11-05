import { redirect } from "next/navigation";
import { getAuthTokenWalletAddress } from "../../../../api/lib/getAuthToken";
import { DeployedContractsPage } from "./_components/DeployedContractsPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const { team_slug, project_slug } = await props.params;
  const accountAddress = await getAuthTokenWalletAddress();

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
