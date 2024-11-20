import { redirect } from "next/navigation";
import { getAuthTokenWalletAddress } from "../../../../api/lib/getAuthToken";
import { BlueprintsPage } from "./components/BlueprintsPage";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const accountAddress = await getAuthTokenWalletAddress();

  if (!accountAddress) {
    const { team_slug, project_slug } = await props.params;
    return redirect(
      `/login?next=${encodeURIComponent(`/team/${team_slug}/${project_slug}/insight`)}`,
    );
  }

  return <BlueprintsPage />;
}
