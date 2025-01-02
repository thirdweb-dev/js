import { DeployedContractsPage } from "../../../../account/contracts/_components/DeployedContractsPage";
import { getAuthTokenWalletAddress } from "../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../login/loginRedirect";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const accountAddress = await getAuthTokenWalletAddress();

  if (!accountAddress) {
    const { team_slug, project_slug } = await props.params;
    loginRedirect(`/team/${team_slug}/${project_slug}/contracts`);
  }

  return <DeployedContractsPage address={accountAddress} />;
}
