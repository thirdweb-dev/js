import {
  EngineInstance,
  useEngineCurrentVersion,
  useEngineLatestVersion,
  useEngineUpdateVersion,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tooltip,
  UseDisclosureReturn,
  useDisclosure,
} from "@chakra-ui/react";
import { useTxNotifications } from "hooks/useTxNotifications";
import { FaArrowCircleUp } from "react-icons/fa";
import { Button } from "tw-components";

export const EngineVersionBadge = ({
  instance,
}: {
  instance: EngineInstance;
}) => {
  const currentVersionQuery = useEngineCurrentVersion(instance.url);
  const latestVersionQuery = useEngineLatestVersion();
  const disclosure = useDisclosure();

  const current = currentVersionQuery.data ?? "...";
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
          engineId={instance.id}
        />
      )}
    </>
  );
};

const UpdateVersionModal = ({
  disclosure,
  latest,
  engineId,
}: {
  disclosure: UseDisclosureReturn;
  latest: string;
  engineId: string;
}) => {
  const { mutate } = useEngineUpdateVersion();
  const { onSuccess, onError } = useTxNotifications(
    `Submitted a request to update your Engine instance. Please allow 1-2 business days for this process.`,
    "Unexpected error updating your Engine instance.",
  );

  const onClick = () => {
    try {
      mutate({ engineId });
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
