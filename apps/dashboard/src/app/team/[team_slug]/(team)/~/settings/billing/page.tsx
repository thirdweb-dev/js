import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { SettingsBillingPage } from "./BillingSettingsPage";

export default function Page() {
  return (
    <ChakraProviderSetup>
      <SettingsBillingPage />
    </ChakraProviderSetup>
  );
}
