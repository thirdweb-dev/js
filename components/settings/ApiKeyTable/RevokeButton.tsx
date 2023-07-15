import { useRevokeApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useRef } from "react";
import { Button } from "tw-components";

interface RevokeApiKeyButtonProps {
  id: string;
  name: string;
  onRevoke: () => void;
}

export const RevokeApiKeyButton: React.FC<RevokeApiKeyButtonProps> = ({
  id,
  name,
  onRevoke,
}) => {
  const trackEvent = useTrack();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const mutation = useRevokeApiKey();
  const { onSuccess, onError } = useTxNotifications(
    "API Key revoked",
    "Failed to revoke an API Key",
  );

  const handleRevoke = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    trackEvent({
      category: "api-keys",
      action: "revoke",
      label: "attempt",
    });

    mutation.mutate(id, {
      onSuccess: () => {
        onSuccess();
        onRevoke();
        trackEvent({
          category: "api-keys",
          action: "revoke",
          label: "success",
        });
      },
      onError: (err) => {
        onError(err);
        trackEvent({
          category: "api-keys",
          action: "revoke",
          label: "error",
          error: err,
        });
      },
    });
  };

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        Revoke
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Revoke {name}?
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to revoke <strong>{name}</strong>? Any
              integrations using this key will no longer be able to access
              thirdweb services.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleRevoke}
                ml={3}
                isLoading={mutation.isLoading}
              >
                I am sure
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
