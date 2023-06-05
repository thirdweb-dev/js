import { ApiKeyInfo, useUpdateApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import {
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { Button, FormErrorMessage, FormLabel } from "tw-components";

interface EditApiKeyModalProps {
  apiKey: ApiKeyInfo | undefined;
  open: boolean;
  onClose: () => void;
}

type FormData = {
  name: string;
};

const EditApiKeyModal: React.FC<EditApiKeyModalProps> = ({
  apiKey,
  open,
  onClose,
}) => {
  const mutation = useUpdateApiKey();
  const initialName = apiKey?.name as string;

  const { onSuccess, onError } = useTxNotifications(
    "API key updated",
    "Failed to update an API key",
  );

  const form = useForm<FormData>({
    values: {
      name: initialName,
    },
  });

  const handleSubmit = form.handleSubmit(({ name }) => {
    mutation.mutate(
      { key: apiKey?.key as string, name },
      {
        onSuccess: () => {
          onClose();
          onSuccess();
        },
        onError,
      },
    );
  });

  const handleClose = () => {
    onClose();
    // let modal to fade out
    setTimeout(() => form.reset(), 300);
  };

  if (!apiKey) {
    return null;
  }

  return (
    <>
      <Modal isOpen={open} onClose={handleClose}>
        <ModalOverlay />

        <ModalContent borderRadius="xl">
          <ModalHeader>Edit &ldquo;{initialName}&rdquo; api key</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl
                isRequired
                isInvalid={!!form.getFieldState("name", form.formState).error}
              >
                <FormLabel>Key name</FormLabel>
                <Input
                  autoComplete="off"
                  placeholder="eth wallet SDK"
                  type="text"
                  {...form.register("name", { required: true, minLength: 3 })}
                />
                <FormErrorMessage>
                  {form.getFieldState("name", form.formState).error?.message}
                </FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditApiKeyModal;
