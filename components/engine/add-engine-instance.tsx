import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
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
  useToast,
} from "@chakra-ui/react";
import { THIRDWEB_API_HOST } from "constants/urls";
import { useTrack } from "hooks/analytics/useTrack";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { BsCloudCheck, BsGear } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { Text, Heading, Button, Badge, FormLabel } from "tw-components";

interface AddEngineInstanceButtonProps {
  refetch: () => void;
}

type ModalState = "selectHostingOption" | "importEngine";

export const AddEngineInstanceButton = ({
  refetch,
}: AddEngineInstanceButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const trackEvent = useTrack();

  const [modalState, setModalState] = useState<ModalState>(
    "selectHostingOption",
  );

  const content =
    modalState === "selectHostingOption" ? (
      <ModalSelectHostingOption setModalState={setModalState} />
    ) : modalState === "importEngine" ? (
      <ModalImportEngine
        setModalState={setModalState}
        onSuccess={() => {
          onClose();
          refetch();
        }}
      />
    ) : null;

  return (
    <>
      <Button
        onClick={() => {
          trackEvent({
            category: "engine",
            action: "click",
            label: "add-engine-instance",
          });
          onOpen();
        }}
        colorScheme="blue"
        leftIcon={<Icon as={FiPlus} boxSize={4} />}
        w="fit-content"
      >
        Add Engine Instance
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          {content}
        </ModalContent>
      </Modal>
    </>
  );
};

const ModalSelectHostingOption = ({
  setModalState,
}: {
  setModalState: Dispatch<SetStateAction<ModalState>>;
}) => {
  const trackEvent = useTrack();
  const meQuery = useAccount();

  const onClickCloudHosted = () => {
    trackEvent({
      category: "engine",
      action: "click",
      label: "clicked-request-early-access",
    });

    const url = `https://share.hsforms.com/1k5tu00ueS5OYMaxHK6De-gea58c?email=${
      meQuery.data?.email || ""
    }&thirdweb_account_id=${meQuery.data?.id || ""}`;
    window.open(url);
  };

  const onClickSelfHosted = () => {
    trackEvent({
      category: "engine",
      action: "click",
      label: "clicked-self-host-instructions",
    });
    window.open("https://portal.thirdweb.com/engine/getting-started");
  };

  const onClickImport = () => {
    trackEvent({
      category: "engine",
      action: "import",
      label: "open-modal",
    });
    setModalState("importEngine");
  };

  return (
    <>
      <ModalHeader>Add Engine Instance</ModalHeader>
      <ModalBody>
        <Stack spacing={4}>
          {/* Cloud-hosted */}
          <Button
            onClick={onClickCloudHosted}
            variant="outline"
            px={8}
            py={16}
            rounded="xl"
            _hover={{
              borderColor: "blue.500",
            }}
            transitionDuration="200ms"
            justifyContent="flex-start"
          >
            <Stack spacing={4}>
              <Flex gap={2} align="center">
                <Icon as={BsCloudCheck} />
                <Heading size="title.xs">Cloud-host</Heading>
                <Badge
                  variant="outline"
                  w="fit-content"
                  colorScheme="gray"
                  rounded="md"
                  size="label.sm"
                >
                  $99 / month
                </Badge>
              </Flex>
              <Text textAlign="left">
                Host Engine on thirdweb with no setup.
              </Text>
            </Stack>
          </Button>

          {/* Self-hosted */}
          <Button
            onClick={onClickSelfHosted}
            variant="outline"
            px={8}
            py={16}
            rounded="xl"
            _hover={{
              borderColor: "blue.500",
            }}
            transitionDuration="200ms"
            justifyContent="flex-start"
          >
            <Stack spacing={4}>
              <Flex gap={2} align="center">
                <Icon as={BsGear} />
                <Heading size="title.xs">Self-host</Heading>
                <Badge
                  variant="outline"
                  w="fit-content"
                  colorScheme="gray"
                  rounded="md"
                  size="label.sm"
                >
                  Free
                </Badge>
              </Flex>
              <Text textAlign="left">
                Host Engine on your infrastructure with minimal setup.
              </Text>
            </Stack>
          </Button>

          <Text>
            Or{" "}
            <Button
              variant="link"
              onClick={onClickImport}
              color="blue.500"
              size="sm"
            >
              import your existing Engine instance
            </Button>
            .
          </Text>
        </Stack>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </>
  );
};

interface ImportEngineInput {
  name: string;
  url: string;
}

const ModalImportEngine = ({
  setModalState,
  onSuccess,
}: {
  setModalState: Dispatch<SetStateAction<ModalState>>;
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
        <Button
          onClick={() => setModalState("selectHostingOption")}
          variant="ghost"
        >
          Back
        </Button>
        <Button type="submit" colorScheme="primary">
          Import
        </Button>
      </ModalFooter>
    </form>
  );
};
