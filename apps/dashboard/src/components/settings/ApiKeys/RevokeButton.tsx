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
import { useRouter } from "next/router";
import { useRef } from "react";
import { Button } from "tw-components";

interface RevokeApiKeyButtonProps {
  id: string;
  name: string;
}

export const RevokeApiKeyButton: React.FC<RevokeApiKeyButtonProps> = ({
  id,
  name,
}) => {
  const trackEvent = useTrack();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const mutation = useRevokeApiKey();
  const router = useRouter();
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
        router.push("/dashboard/settings/api-keys");

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
      <Button colorScheme="red" onClick={onOpen} variant="outline">
        Delete key
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete {name}?
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete <strong>{name}</strong>? Any
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
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
