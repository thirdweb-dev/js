import { ChakraProviderSetup } from "chakra/ChakraProviderSetup";
import { redirect } from "next/navigation";
import { getTeamBySlug } from "@/api/team";
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
    redirect("/team");
  }

  return (
    <ChakraProviderSetup>
      <SettingsGasCreditsPage account={account} team={team} />
    </ChakraProviderSetup>
  );
}
