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
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { THIRDWEB_API_HOST } from "constants/urls";
import { useTrack } from "hooks/analytics/useTrack";
import { useForm } from "react-hook-form";
import { Button, FormLabel, Text, TrackedLink } from "tw-components";

interface ImportEngineInstanceButtonProps {
  refetch: () => void;
}

export const ImportEngineInstanceButton = ({
  refetch,
}: ImportEngineInstanceButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const trackEvent = useTrack();

  return (
    <>
      <Button
        onClick={() => {
          trackEvent({
            category: "engine",
            action: "import",
            label: "open-modal",
          });
          onOpen();
        }}
        variant="outline"
      >
        Import
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalImportEngine
            onClose={onClose}
            onSuccess={() => {
              onClose();
              refetch();
            }}
          />
        </ModalContent>
      </Modal>
    </>
  );
};

interface ImportEngineInput {
  name: string;
  url: string;
}

const ModalImportEngine = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const toast = useToast();

  const form = useForm<ImportEngineInput>({
    defaultValues: {
      name: "My Engine Instance",
    },
  });

  const onSubmit = async (data: ImportEngineInput) => {
    try {
      // Instance URLs should end with a /.
      const url = data.url.endsWith("/") ? data.url : `${data.url}/`;

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/engine`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          url,
        }),
      });
      if (!res.ok) {
        throw new Error(`Unexpected status ${res.status}`);
      }

      onSuccess();
    } catch (e) {
      toast({
        status: "error",
        description:
          "Error importing Engine. Please check if the details are correct.",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <ModalHeader>Import Engine Instance</ModalHeader>

      <ModalBody>
        <Stack spacing={4}>
          <Text>
            Import an Engine instance hosted on your infrastructure.
            <br />
            <TrackedLink
              href="https://portal.thirdweb.com/infrastructure/engine/get-started"
              isExternal
              category="engine"
              label="clicked-self-host-instructions"
              color="blue.500"
            >
              Get help setting up Engine for free.
            </TrackedLink>
          </Text>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter a descriptive label"
              autoFocus
              {...form.register("name")}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>URL</FormLabel>
            <Input
              type="url"
              placeholder="Enter your Engine URL"
              {...form.register("url")}
            />
          </FormControl>
        </Stack>
      </ModalBody>

      <ModalFooter as={Flex} gap={3}>
        <Button onClick={onClose} variant="ghost">
          Cancel
        </Button>
        <Button type="submit" colorScheme="primary">
          Import
        </Button>
      </ModalFooter>
    </form>
  );
};
