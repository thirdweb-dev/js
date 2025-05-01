import { getTeamBySlug } from "@/api/team";
import { redirect } from "next/navigation";
import { getValidAccount } from "../../../../../account/settings/getAccount";
import { SettingsLayout } from "./SettingsLayout";

export default async function Layout(props: {
  params: Promise<{
    team_slug: string;
  }>;
  children: React.ReactNode;
}) {
  const params = await props.params;

  const [account, team] = await Promise.all([
    getValidAccount(`/team/${params.team_slug}/~/settings`),
    getTeamBySlug(params.team_slug),
  ]);

  if (!team) {
    redirect("/team");
  }

  return (
    <SettingsLayout team={team} account={account}>
      {props.children}
    </SettingsLayout>
  );
}
