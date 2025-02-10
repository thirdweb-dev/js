import { getTeamBySlug } from "@/api/team";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { notFound } from "next/navigation";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";
import { TeamGeneralSettingsPage } from "./general/TeamGeneralSettingsPage";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const team = await getTeamBySlug((await props.params).team_slug);
  const token = await getAuthToken();
  if (!team || !token) {
    notFound();
  }

  return (
    <TeamGeneralSettingsPage team={team} client={getThirdwebClient(token)} />
  );
}
