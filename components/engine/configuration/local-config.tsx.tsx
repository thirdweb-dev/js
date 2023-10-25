import { useEngineSetWalletConfig } from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex } from "@chakra-ui/react";
import { Button, Text } from "tw-components";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useTrack } from "hooks/analytics/useTrack";

interface LocalConfigProps {
  instance: string;
}

export const LocalConfig: React.FC<LocalConfigProps> = ({ instance }) => {
  const { mutate: setLocalConfig, isLoading } =
    useEngineSetWalletConfig(instance);

  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Configuration set successfully.",
    "Failed to set configuration.",
  );

  return (
    <Flex as="form" flexDir="column" gap={4}>
      <Text>
        Engine supports local wallets for signing & sending transactions over
        any EVM chain.
      </Text>
      <Flex justifyContent="end" gap={4} alignItems="center">
        <Text fontStyle="italic">
          Setting this config will make it the default and remove any other
          configurations.
        </Text>
        <Button
          w={{ base: "full", md: "inherit" }}
          colorScheme="primary"
          px={12}
          onClick={() => {
            trackEvent({
              category: "engine",
              action: "set-wallet-config",
              type: "local",
              label: "attempt",
            });
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
          {isLoading ? "Setting..." : "Set Local Config"}
        </Button>
      </Flex>
    </Flex>
  );
};
