import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { SettingsUsagePage } from "./UsagePage";

export default function Page() {
  return (
    <ChakraProviderSetup>
      <div className="container">
        <SettingsUsagePage />
      </div>
    </ChakraProviderSetup>
  );
}
