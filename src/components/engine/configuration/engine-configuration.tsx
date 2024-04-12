import { Flex } from "@chakra-ui/react";
import { EngineWalletConfig } from "./engine-wallet-config";
import { EngineCorsConfig } from "./cors";
import { EngineSystem } from "./system";

interface EngineConfigurationProps {
  instanceUrl: string;
}

export const EngineConfiguration: React.FC<EngineConfigurationProps> = ({
  instanceUrl,
}) => {
  return (
    <Flex flexDir="column" gap={12}>
      <EngineWalletConfig instanceUrl={instanceUrl} />
      <EngineCorsConfig instanceUrl={instanceUrl} />
      <EngineSystem instanceUrl={instanceUrl} />
    </Flex>
  );
};
