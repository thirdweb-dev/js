import {
  type EngineAdmin,
  useEngineGrantPermissions,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { CirclePlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { isAddress } from "thirdweb";
import { Button, FormLabel } from "tw-components";

interface AddAdminButtonProps {
  instanceUrl: string;
  authToken: string;
}

export const AddAdminButton: React.FC<AddAdminButtonProps> = ({
  instanceUrl,
  authToken,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: grantPermissions } = useEngineGrantPermissions({
    instanceUrl,
    authToken,
  });
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
        leftIcon={<CirclePlusIcon className="size-6" />}
        colorScheme="primary"
        w="fit-content"
      >
        Add Admin
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          className="!bg-background rounded-lg border border-border"
          as="form"
          onSubmit={form.handleSubmit((data) => {
            if (!isAddress(data.walletAddress)) {
              onError(new Error("Invalid wallet address"));
            }
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
            <div className="flex flex-col gap-4">
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
            </div>
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
