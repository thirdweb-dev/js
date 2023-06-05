import { useRevokeApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { Icon, Spinner } from "@chakra-ui/react";
import { useTxNotifications } from "hooks/useTxNotifications";
import { FiX } from "react-icons/fi";
import { MenuItem } from "tw-components";

interface RevokeApiKeyButtonProps {
  apiKey: string;
}

const RevokeApiKeyButton: React.FC<RevokeApiKeyButtonProps> = ({ apiKey }) => {
  const mutation = useRevokeApiKey();
  const { onSuccess, onError } = useTxNotifications(
    "API key revoked",
    "Failed to revoke an API key",
  );

  const handleRevoke = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    mutation.mutate(apiKey, {
      onSuccess,
      onError,
    });
  };

  return (
    <MenuItem
      onClick={handleRevoke}
      isDisabled={mutation.isLoading}
      closeOnSelect={false}
      icon={
        mutation.isLoading ? (
          <Spinner size="xs" />
        ) : (
          <Icon as={FiX} color="red.500" />
        )
      }
    >
      Revoke
    </MenuItem>
  );
};

export default RevokeApiKeyButton;
