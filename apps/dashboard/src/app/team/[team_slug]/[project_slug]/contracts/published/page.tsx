import { PublishedContractsPage } from "../../../../../account/contracts/published/PublishedContractsPage";
import { getAuthTokenWalletAddress } from "../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../login/loginRedirect";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const accountAddress = await getAuthTokenWalletAddress();
  const params = await props.params;

  if (!accountAddress) {
    loginRedirect(`/team/${params.team_slug}/${params.project_slug}/contracts`);
  }

  return <PublishedContractsPage publisherAddress={accountAddress} />;
}
