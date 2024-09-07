import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { SettingsUsagePage } from "./UsagePage";

export default function Page() {
  return (
    <ChakraProviderSetup>
      <div className="container pt-8 pb-10">
        <SettingsUsagePage />
      </div>
    </ChakraProviderSetup>
  );
}
