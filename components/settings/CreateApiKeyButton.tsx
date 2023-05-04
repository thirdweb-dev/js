import { useCreateApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { Icon } from "@chakra-ui/react";
import { useTxNotifications } from "hooks/useTxNotifications";
import { FiPlus } from "react-icons/fi";
import { Button } from "tw-components";

export const CreateApiKeyButton: React.FC = () => {
  const createKeyMutation = useCreateApiKey();
  const { onSuccess, onError } = useTxNotifications(
    "API key created",
    "Failed to create API key",
  );

  return (
    <Button
      onClick={() =>
        createKeyMutation.mutate(undefined, {
          onSuccess: () => {
            onSuccess();
          },
          onError: (err) => {
            onError(err);
          },
        })
      }
      colorScheme="blue"
      leftIcon={<Icon as={FiPlus} boxSize={4} />}
      isLoading={createKeyMutation.isLoading}
      isDisabled={createKeyMutation.isLoading}
    >
      Create new key
    </Button>
  );
};
