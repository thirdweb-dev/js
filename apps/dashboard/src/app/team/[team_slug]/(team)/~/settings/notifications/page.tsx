import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { getValidAccount } from "../../../../../../account/settings/getAccount";
import { SettingsNotificationsPage } from "./NotificationsPage";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const account = await getValidAccount(
    `/team/${params.team_slug}/~/settings/notifications`,
  );

  return (
    <ChakraProviderSetup>
      <SettingsNotificationsPage account={account} />
    </ChakraProviderSetup>
  );
}
