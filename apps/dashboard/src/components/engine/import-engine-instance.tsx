import {
  Alert,
  AlertDescription,
  AlertIcon,
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
  type UseDisclosureReturn,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { THIRDWEB_API_HOST } from "constants/urls";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useForm } from "react-hook-form";
import { Button, FormLabel, Text, TrackedLink } from "tw-components";

interface ImportEngineInstanceButtonProps {
  refetch: () => void;
}

export const ImportEngineInstanceButton = ({
  refetch,
}: ImportEngineInstanceButtonProps) => {
  const hasImportUrl = !!useSingleQueryParam("importUrl");

  const disclosure = useDisclosure({
    defaultIsOpen: !!hasImportUrl,
  });
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
          disclosure.onOpen();
        }}
        variant="outline"
        px={6}
        width="fit-content"
      >
        Import
      </Button>

      {disclosure.isOpen && (
        <ModalImportEngine
          disclosure={disclosure}
          onSuccess={() => refetch()}
        />
      )}
    </>
  );
};

interface ImportEngineInput {
  name: string;
  url: string;
}

const ModalImportEngine = ({
  disclosure,
  onSuccess,
}: {
  disclosure: UseDisclosureReturn;
  onSuccess: () => void;
}) => {
  const toast = useToast();
  const defaultUrl = useSingleQueryParam("importUrl");

  const form = useForm<ImportEngineInput>({
    defaultValues: {
      name: "My Engine Instance",
      url: defaultUrl ? decodeURIComponent(defaultUrl) : undefined,
    },
  });

  const onSubmit = async (data: ImportEngineInput) => {
    try {
      // Instance URLs should end with a /.
      const url = data.url.endsWith("/") ? data.url : `${data.url}/`;

      const res = await fetch(`${THIRDWEB_API_HOST}/v1/engine`, {
        method: "POST",
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

      disclosure.onClose();
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
    <Modal
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      isCentered
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
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
              <Alert status="warning" borderRadius="m">
                <AlertIcon />
                <AlertDescription>
                  Do not import a URL you do not recognize.
                </AlertDescription>
              </Alert>
            </Stack>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button onClick={disclosure.onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" colorScheme="primary">
              Import
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
