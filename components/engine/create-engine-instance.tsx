import { useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Flex,
  Icon,
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
import { Dispatch, SetStateAction, useState } from "react";
import { BsCloudCheck, BsGear } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { Text, Heading, Button, Badge } from "tw-components";

interface CreateEngineInstanceButtonProps {
  refetch: () => void;
}

type ModalState = "selectHostingOption";

export const CreateEngineInstanceButton = ({
  refetch,
}: CreateEngineInstanceButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const trackEvent = useTrack();

  const [modalState, setModalState] = useState<ModalState>(
    "selectHostingOption",
  );

  const content =
    modalState === "selectHostingOption" ? (
      <ModalSelectHostingOption setModalState={setModalState} />
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
      >
        Create Instance
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
    window.open(
      "https://portal.thirdweb.com/infrastructure/engine/get-started",
    );
  };

  return (
    <>
      <ModalHeader>Create Engine Instance</ModalHeader>
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
        </Stack>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </>
  );
};
