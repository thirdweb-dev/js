import { getTeamBySlug } from "@/api/team";
import { notFound } from "next/navigation";
import { SettingsLayout } from "./SettingsLayout";

export default async function Layout(props: {
  params: {
    team_slug: string;
  };
  children: React.ReactNode;
}) {
  const team = await getTeamBySlug(props.params.team_slug);

  if (!team) {
    notFound();
  }

  return <SettingsLayout team={team}>{props.children}</SettingsLayout>;
}
