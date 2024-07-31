import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex } from "@chakra-ui/react";
import { EngineCorsConfig } from "./cors";
import { EngineWalletConfig } from "./engine-wallet-config";
import { EngineIpAllowlistConfig } from "./ip-allowlist";
import { EngineSystem } from "./system";

interface EngineConfigurationProps {
  instance: EngineInstance;
}

export const EngineConfiguration: React.FC<EngineConfigurationProps> = ({
  instance,
}) => {
  return (
    <Flex flexDir="column" gap={12}>
      <EngineWalletConfig instanceUrl={instance.url} />
      <EngineCorsConfig instanceUrl={instance.url} />
      <EngineIpAllowlistConfig instanceUrl={instance.url} />
      <EngineSystem instance={instance} />
    </Flex>
  );
};
