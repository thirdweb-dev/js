import { getTeamBySlug } from "@/api/team";
import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { redirect } from "next/navigation";
import { getValidAccount } from "../../../../../../account/settings/getAccount";
import { SettingsGasCreditsPage } from "./SettingsCreditsPage";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const account = await getValidAccount(
    `/team/${params.team_slug}/~/settings/credits`,
  );
  const team = await getTeamBySlug(params.team_slug);

  if (!team) {
    return redirect("/team");
  }

  return (
    <ChakraProviderSetup>
      <SettingsGasCreditsPage team={team} account={account} />
    </ChakraProviderSetup>
  );
}
