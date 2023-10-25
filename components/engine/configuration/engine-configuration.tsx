import { Flex } from "@chakra-ui/react";
import { EngineWalletConfig } from "./engine-wallet-config";
import { EngineWebhooks } from "./engine-webhooks";

interface EngineConfigurationProps {
  instance: string;
}

export const EngineConfiguration: React.FC<EngineConfigurationProps> = ({
  instance,
}) => {
  return (
    <Flex flexDir="column" gap={12}>
      <EngineWalletConfig instance={instance} />
      <EngineWebhooks instance={instance} />
    </Flex>
  );
};
