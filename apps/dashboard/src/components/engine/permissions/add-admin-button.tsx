import {
  type EngineAdmin,
  useEngineGrantPermissions,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  FormControl,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { Button, FormLabel } from "tw-components";

interface AddAdminButtonProps {
  instanceUrl: string;
}

export const AddAdminButton: React.FC<AddAdminButtonProps> = ({
  instanceUrl,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: grantPermissions } = useEngineGrantPermissions(instanceUrl);
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
        Add Admin
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          className="!bg-background border border-border rounded-lg"
          as="form"
          onSubmit={form.handleSubmit((data) => {
            grantPermissions(data, {
              onSuccess: () => {
                onSuccess();
                onClose();
                trackEvent({
                  category: "engine",
                  action: "add-admin",
                  label: "success",
                  instance: instanceUrl,
                });
              },
              onError: (error) => {
                onError(error);
                trackEvent({
                  category: "engine",
                  action: "add-admin",
                  label: "error",
                  instance: instanceUrl,
                  error,
                });
              },
            });
          })}
        >
          <ModalHeader>Add Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Wallet Address</FormLabel>
                <Input
                  type="text"
                  placeholder="The wallet address for this admin"
                  {...form.register("walletAddress", { required: true })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Label</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter a description for this admin"
                  {...form.register("label")}
                />
              </FormControl>
            </Stack>
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
