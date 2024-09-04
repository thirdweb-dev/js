import { getTeamBySlug } from "@/api/team";
import { notFound } from "next/navigation";
import { GeneralSettingsPage } from "./general/GeneralSettingsPage";

export default async function Page(props: {
  params: {
    team_slug: string;
  };
}) {
  const team = await getTeamBySlug(props.params.team_slug);

  if (!team) {
    notFound();
  }

  return <GeneralSettingsPage team={team} />;
}
