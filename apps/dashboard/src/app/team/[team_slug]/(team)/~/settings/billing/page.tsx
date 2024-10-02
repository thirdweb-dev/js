import { getTeamBySlug } from "@/api/team";
import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { notFound } from "next/navigation";
import { SettingsBillingPage } from "./BillingSettingsPage";

export default async function Page(props: {
  params: {
    team_slug: string;
  };
}) {
  const team = await getTeamBySlug(props.params.team_slug);

  if (!team) {
    notFound();
  }

  return (
    <ChakraProviderSetup>
      <SettingsBillingPage teamId={team.id} />
    </ChakraProviderSetup>
  );
}
