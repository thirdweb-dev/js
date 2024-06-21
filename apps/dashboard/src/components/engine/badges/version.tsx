import {
  type EngineInstance,
  useEngineLatestVersion,
  useEngineSystemHealth,
  useEngineUpdateVersion,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tooltip,
  type UseDisclosureReturn,
  useDisclosure,
} from "@chakra-ui/react";
import { useTxNotifications } from "hooks/useTxNotifications";
import { FaArrowCircleUp } from "react-icons/fa";
import { Button, Text, TrackedLink } from "tw-components";

export const EngineVersionBadge = ({
  instance,
}: {
  instance: EngineInstance;
}) => {
  const healthQuery = useEngineSystemHealth(instance.url);
  const latestVersionQuery = useEngineLatestVersion();
  const disclosure = useDisclosure();

  const current = healthQuery.data?.engineVersion ?? "...";
  const latest = latestVersionQuery.data ?? "...";
  const isStale = current !== latest;

  if (!isStale) {
    return (
      <Tag size="sm">
        <TagLabel fontSize="small">{current}</TagLabel>
      </Tag>
    );
  }

  return (
    <>
      <Tooltip label="Update to the latest version">
        <Button variant="unstyled">
          <Tag
            onClick={disclosure.onOpen}
            size="sm"
            colorScheme="blue"
            variant="outline"
          >
            <TagLeftIcon as={FaArrowCircleUp} boxSize={3} />
            <TagLabel fontSize="small">{current}</TagLabel>
          </Tag>
        </Button>
      </Tooltip>

      {disclosure.isOpen && (
        <UpdateVersionModal
          disclosure={disclosure}
          latest={latest ?? ""}
          instance={instance}
        />
      )}
    </>
  );
};

const UpdateVersionModal = ({
  disclosure,
  latest,
  instance,
}: {
  disclosure: UseDisclosureReturn;
  latest: string;
  instance: EngineInstance;
}) => {
  const { mutate } = useEngineUpdateVersion();
  const { onSuccess, onError } = useTxNotifications(
    "Submitted a request to update your Engine instance. Please allow 1-2 business days for this process.",
    "Unexpected error updating your Engine instance.",
  );

  if (!instance.cloudDeployedAt) {
    // For self-hosted, show a prompt to the Github release page.
    return (
      <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
        <ModalContent>
          <ModalCloseButton />

          <ModalHeader>Update your self-hosted Engine to {latest}</ModalHeader>
          <ModalBody>
            <Text>
              View the changelog in the{" "}
              <TrackedLink
                href="https://github.com/thirdweb-dev/engine/releases"
                category="engine"
                label="clicked-engine-releases"
                isExternal
                color="blue.500"
              >
                Engine Github repository
              </TrackedLink>
              .
            </Text>
          </ModalBody>
          <ModalFooter as={Flex} gap={3}>
            <Button type="button" onClick={disclosure.onClose} variant="ghost">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  const onClick = () => {
    try {
      mutate({ engineId: instance.id });
      onSuccess();
    } catch (e) {
      onError(e);
    }
    disclosure.onClose();
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
      <ModalContent>
        <ModalCloseButton />

        <ModalHeader>Update Engine to {latest}?</ModalHeader>
        <ModalFooter as={Flex} gap={3}>
          <Button type="button" onClick={disclosure.onClose} variant="ghost">
            Close
          </Button>
          <Button type="submit" onClick={onClick} colorScheme="blue">
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
