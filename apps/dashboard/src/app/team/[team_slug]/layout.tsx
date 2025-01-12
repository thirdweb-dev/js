import { getTeamBySlug } from "@/api/team";
import { AppFooter } from "@/components/blocks/app-footer";
import { redirect } from "next/navigation";
import { TWAutoConnect } from "../../components/autoconnect";

export default async function RootTeamLayout(props: {
  children: React.ReactNode;
  params: Promise<{ team_slug: string }>;
}) {
  const { team_slug } = await props.params;
  const team = await getTeamBySlug(team_slug).catch(() => null);

  if (!team) {
    redirect("/team");
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex grow flex-col">{props.children}</div>
      <TWAutoConnect />
      <AppFooter />
    </div>
  );
}
