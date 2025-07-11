import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
import { getTeamBySlug } from "@/api/team";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getValidAccount } from "../../../../../account/settings/getAccount";
import { loginRedirect } from "../../../../../login/loginRedirect";
import { SupportLayout } from "./SupportLayout";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ team_slug: string }>;
  children: React.ReactNode;
}) {
  const resolvedParams = await params;
  const [_account, team, authToken] = await Promise.all([
    getValidAccount(`/team/${resolvedParams.team_slug}/~/support`),
    getTeamBySlug(resolvedParams.team_slug),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${resolvedParams.team_slug}/~/support`);
  }

  if (!team) {
    redirect("/team");
  }

  const _client = getClientThirdwebClient({
    jwt: authToken,
    teamId: team.id,
  });

  return <SupportLayout>{children}</SupportLayout>;
}
