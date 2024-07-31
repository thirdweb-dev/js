import {
  useEngineSetWalletConfig,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { Button, Card, Text } from "tw-components";

interface LocalConfigProps {
  instanceUrl: string;
}

export const LocalConfig: React.FC<LocalConfigProps> = ({ instanceUrl }) => {
  const { data: walletConfig } = useEngineWalletConfig(instanceUrl);
  const { mutate: setLocalConfig, isLoading } =
    useEngineSetWalletConfig(instanceUrl);

  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Configuration set successfully.",
    "Failed to set configuration.",
  );

  return (
    <Flex as="form" flexDir="column" gap={4}>
      <Card>
        <Text>
          Engine supports local wallets for signing & sending transactions over
          any EVM chain.
        </Text>
      </Card>
      <Flex justifyContent="end" gap={4} alignItems="center">
        {walletConfig?.type && walletConfig?.type !== "local" && (
          <Text color="red.500">
            This will reset your other backend wallet configurations
          </Text>
        )}
        <Button
          isDisabled={walletConfig?.type && walletConfig.type === "local"}
          w={{ base: "full", md: "inherit" }}
          colorScheme="primary"
          px={12}
          onClick={() => {
            setLocalConfig(
              { type: "local" },
              {
                onSuccess: () => {
                  onSuccess();
                  trackEvent({
                    category: "engine",
                    action: "set-wallet-config",
                    type: "local",
                    label: "success",
                  });
                },
                onError: (error) => {
                  onError(error);
                  trackEvent({
                    category: "engine",
                    action: "set-wallet-config",
                    type: "local",
                    label: "error",
                    error,
                  });
                },
              },
            );
          }}
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </Flex>
    </Flex>
  );
};
