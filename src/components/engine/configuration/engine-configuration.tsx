import { Flex } from "@chakra-ui/react";
import { EngineWalletConfig } from "./engine-wallet-config";
import { EngineCorsConfig } from "./cors";
import { EngineSystem } from "./system";
import { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";

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
      <EngineSystem instance={instance} />
    </Flex>
  );
};
