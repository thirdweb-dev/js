import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { SettingsGasCreditsPage } from "./SettingsCreditsPage";

export default function Page() {
  return (
    <ChakraProviderSetup>
      <SettingsGasCreditsPage />
    </ChakraProviderSetup>
  );
}
