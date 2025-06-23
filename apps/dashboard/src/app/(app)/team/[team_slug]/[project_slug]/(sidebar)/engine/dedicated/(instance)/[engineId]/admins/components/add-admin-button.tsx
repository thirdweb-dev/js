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
import { Button } from "chakra/button";
import { FormLabel } from "chakra/form";
import { CirclePlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { isAddress } from "thirdweb";
import { type EngineAdmin, useEngineGrantPermissions } from "@/hooks/useEngine";
import { useTxNotifications } from "@/hooks/useTxNotifications";

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
    authToken,
    instanceUrl,
  });

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
        colorScheme="primary"
        leftIcon={<CirclePlusIcon className="size-6" />}
        onClick={onOpen}
        size="sm"
        variant="ghost"
        w="fit-content"
      >
        Add Admin
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          as="form"
          className="!bg-background rounded-lg border border-border"
          onSubmit={form.handleSubmit((data) => {
            if (!isAddress(data.walletAddress)) {
              onError(new Error("Invalid wallet address"));
            }
            grantPermissions(data, {
              onError: (error) => {
                onError(error);
                console.error(error);
              },
              onSuccess: () => {
                onSuccess();
                onClose();
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
                  placeholder="The wallet address for this admin"
                  type="text"
                  {...form.register("walletAddress", { required: true })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Label</FormLabel>
                <Input
                  placeholder="Enter a description for this admin"
                  type="text"
                  {...form.register("label")}
                />
              </FormControl>
            </div>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button onClick={onClose} type="button" variant="ghost">
              Cancel
            </Button>
            <Button colorScheme="primary" type="submit">
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
