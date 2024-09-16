import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { SettingsNotificationsPage } from "./NotificationsPage";

export default function Page() {
  return (
    <ChakraProviderSetup>
      <SettingsNotificationsPage />
    </ChakraProviderSetup>
  );
}
