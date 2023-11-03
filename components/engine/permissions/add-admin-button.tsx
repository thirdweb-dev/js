import {
  EngineAdmin,
  useEngineGrantPermissions,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Icon,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { Button, FormLabel } from "tw-components";
import { AiOutlinePlusCircle } from "react-icons/ai";

interface AddAdminButtonProps {
  instance: string;
}

export const AddAdminButton: React.FC<AddAdminButtonProps> = ({ instance }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: grantPermissions } = useEngineGrantPermissions(instance);
  const trackEvent = useTrack();
  const form = useForm<EngineAdmin>({
    defaultValues: {
      permissions: "ADMIN",
    },
  });

  const { onSuccess, onError } = useTxNotifications(
    "Successfully added admin.",
    "Failed to add admin.",
  );

  return (
    <>
      <Button
        onClick={onOpen}
        variant="ghost"
        size="sm"
        leftIcon={<Icon as={AiOutlinePlusCircle} boxSize={6} />}
        colorScheme="primary"
        w="fit-content"
      >
        Add admin
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={form.handleSubmit((data) => {
            trackEvent({
              category: "engine",
              action: "add-admin",
              label: "attempt",
              instance,
            });
            grantPermissions(data, {
              onSuccess: () => {
                onSuccess();
                onClose();
                trackEvent({
                  category: "engine",
                  action: "add-admin",
                  label: "success",
                  instance,
                });
              },
              onError: (error) => {
                onError(error);
                trackEvent({
                  category: "engine",
                  action: "add-admin",
                  label: "error",
                  instance,
                  error,
                });
              },
            });
          })}
        >
          <ModalHeader>Add New Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Wallet Address</FormLabel>
              <Input
                type="text"
                placeholder="eg: 0x..."
                {...form.register("walletAddress", { required: true })}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" colorScheme="primary">
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
