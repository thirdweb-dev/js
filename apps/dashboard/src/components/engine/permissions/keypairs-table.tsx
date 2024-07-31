import {
  type Keypair,
  useEngineRemoveKeypair,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  FormControl,
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
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";
import { FiTrash } from "react-icons/fi";
import { Button, CodeBlock, FormLabel, Text } from "tw-components";
import { toDateTimeLocal } from "utils/date-utils";

interface KeypairsTableProps {
  instanceUrl: string;
  keypairs: Keypair[];
  isLoading: boolean;
  isFetched: boolean;
}

const columnHelper = createColumnHelper<Keypair>();

const columns = [
  columnHelper.accessor("label", {
    header: "Label",
    cell: (cell) => {
      return <Text>{cell.getValue()}</Text>;
    },
  }),
  columnHelper.accessor("publicKey", {
    header: "Public Key",
    cell: (cell) => {
      return <CodeBlock fontSize="small" code={cell.getValue()} w={560} />;
    },
  }),
  columnHelper.accessor("algorithm", {
    header: "Type",
    cell: (cell) => {
      return <Text>{cell.getValue()}</Text>;
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Added At",
    cell: (cell) => {
      return <Text>{toDateTimeLocal(cell.getValue())}</Text>;
    },
  }),
];

export const KeypairsTable: React.FC<KeypairsTableProps> = ({
  instanceUrl,
  keypairs,
  isLoading,
  isFetched,
}) => {
  const removeDisclosure = useDisclosure();
  const [selectedKeypair, setSelectedKeypair] = useState<Keypair>();

  return (
    <>
      <TWTable
        title="public keys"
        data={keypairs}
        columns={columns}
        isLoading={isLoading}
        isFetched={isFetched}
        onMenuClick={[
          {
            icon: FiTrash,
            text: "Remove",
            onClick: (keypair) => {
              setSelectedKeypair(keypair);
              removeDisclosure.onOpen();
            },
            isDestructive: true,
          },
        ]}
      />

      {selectedKeypair && removeDisclosure.isOpen && (
        <RemoveModal
          keypair={selectedKeypair}
          disclosure={removeDisclosure}
          instanceUrl={instanceUrl}
        />
      )}
    </>
  );
};

const RemoveModal = ({
  keypair,
  disclosure,
  instanceUrl,
}: {
  keypair: Keypair;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
}) => {
  const { mutate: revokeKeypair } = useEngineRemoveKeypair(instanceUrl);
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully removed public key",
    "Failed to remove public key",
  );

  const onClick = () => {
    revokeKeypair(
      { hash: keypair.hash },
      {
        onSuccess: () => {
          onSuccess();
          disclosure.onClose();
          trackEvent({
            category: "engine",
            action: "remove-keypair",
            label: "success",
            instance: instanceUrl,
          });
        },
        onError: (error) => {
          onError(error);
          trackEvent({
            category: "engine",
            action: "remove-keypair",
            label: "error",
            instance: instanceUrl,
            error,
          });
        },
      },
    );
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Remove Keypair</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Text>Are you sure you want to remove this keypair?</Text>
            <Text>
              Access tokens signed by the private key for this keypair will no
              longer be valid.
            </Text>

            <FormControl>
              <FormLabel>Label</FormLabel>
              <Text>{keypair.label}</Text>
            </FormControl>

            <FormControl>
              <FormLabel>Type</FormLabel>
              <Text>{keypair.algorithm}</Text>
            </FormControl>

            <FormControl>
              <FormLabel>Public Key</FormLabel>
              <Flex overflowX="scroll">
                <Text fontFamily="mono" fontSize="small" whiteSpace="pre-line">
                  {keypair.publicKey}
                </Text>
              </Flex>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter as={Flex} gap={3}>
          <Button type="button" onClick={disclosure.onClose} variant="ghost">
            Cancel
          </Button>
          <Button type="submit" colorScheme="red" onClick={onClick}>
            Remove
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
