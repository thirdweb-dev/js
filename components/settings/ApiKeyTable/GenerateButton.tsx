import { ApiKeysCreateModal } from "./CreateKeyModal";
import { ApiKey, useGenerateApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useTxNotifications } from "hooks/useTxNotifications";
import { Dispatch, SetStateAction, useRef } from "react";
import { Button } from "tw-components";

interface GenerateApiKeyButtonProps {
  id: string;
  name: string;
  generatedKey: ApiKey;
  setGeneratedKey: Dispatch<SetStateAction<ApiKey>>;
}

export const GenerateApiKeyButton: React.FC<GenerateApiKeyButtonProps> = ({
  id,
  name,
  generatedKey,
  setGeneratedKey,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const mutation = useGenerateApiKey();

  const { onSuccess, onError } = useTxNotifications(
    `API Key Secret ${generatedKey.secretMasked ? "regenerated" : "generated"}`,
    `Failed to ${
      generatedKey.secretMasked ? "regenerate" : "generate"
    } an API Key Secret`,
  );

  const {
    isOpen: keyModalOpen,
    onOpen: keyModalOnOpen,
    onClose: keyModalOnClose,
  } = useDisclosure();

  const {
    isOpen: alertOpen,
    onOpen: alertOnOpen,
    onClose: alertOnClose,
  } = useDisclosure();

  const handleGenerate = () => {
    mutation.mutate(id, {
      onSuccess: (data) => {
        alertOnClose();
        onSuccess();
        setGeneratedKey(data);
        keyModalOnOpen();
      },
      onError,
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        position="absolute"
        right={2}
        top={2}
        onClick={generatedKey.secretMasked ? alertOnOpen : handleGenerate}
      >
        {generatedKey.secretMasked ? "Regenerate" : "Generate"}
      </Button>

      {generatedKey && (
        <ApiKeysCreateModal
          open={keyModalOpen}
          apiKey={generatedKey}
          onClose={keyModalOnClose}
        />
      )}
      <AlertDialog
        isOpen={alertOpen}
        leastDestructiveRef={cancelRef}
        onClose={alertOnClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Re-generate &quot;{name}&quot; Secret Key?
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to re-generate this Secret Key? Any
              integrations using this Secret Key will no longer be able to
              access thirdweb services.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={alertOnClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleGenerate}
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
