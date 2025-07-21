import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { fetchEcosystemList } from "@/api/ecosystems";
import { loginRedirect } from "@/utils/redirects";

export default async function Page(props: {
  params: Promise<{ team_slug: string }>;
}) {
  const { team_slug } = await props.params;
  const ecosystemLayoutPath = `/team/${team_slug}/~/ecosystem`;

  const authToken = await getAuthToken();

  if (!authToken) {
    loginRedirect(ecosystemLayoutPath);
  }

  const ecosystems = await fetchEcosystemList(team_slug).catch((err) => {
    console.error("failed to fetch ecosystems", err);
    return [];
  });

  if (ecosystems[0]) {
    redirect(`${ecosystemLayoutPath}/${ecosystems[0].slug}`);
  }

  redirect(`${ecosystemLayoutPath}/create`);
}
