import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { PlainTextCodeBlock } from "@/components/ui/code/plaintext-code";
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
  type UseDisclosureReturn,
  useDisclosure,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button, FormLabel, Text } from "tw-components";
import { toDateTimeLocal } from "utils/date-utils";

interface KeypairsTableProps {
  instanceUrl: string;
  keypairs: Keypair[];
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
}

const columnHelper = createColumnHelper<Keypair>();

const columns = [
  columnHelper.accessor("label", {
    header: "Label",
    cell: (cell) => {
      return <Text>{cell.getValue()}</Text>;
    },
  }),
  columnHelper.accessor("hash", {
    header: "Key ID",
    cell: (cell) => {
      return (
        <CopyAddressButton address={cell.getValue()} copyIconPosition="right" />
      );
    },
  }),
  columnHelper.accessor("publicKey", {
    header: "Public Key",
    cell: (cell) => {
      return (
        <PlainTextCodeBlock
          code={cell.getValue()}
          className="max-w-[350px]"
          codeClassName="text-xs"
        />
      );
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
  isPending,
  isFetched,
  authToken,
}) => {
  const removeDisclosure = useDisclosure();
  const [selectedKeypair, setSelectedKeypair] = useState<Keypair>();

  return (
    <>
      <TWTable
        title="public keys"
        data={keypairs}
        columns={columns}
        isPending={isPending}
        isFetched={isFetched}
        onMenuClick={[
          {
            icon: <Trash2Icon className="size-4" />,
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
          authToken={authToken}
        />
      )}
    </>
  );
};

const RemoveModal = ({
  keypair,
  disclosure,
  instanceUrl,
  authToken,
}: {
  keypair: Keypair;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
}) => {
  const { mutate: revokeKeypair } = useEngineRemoveKeypair({
    instanceUrl,
    authToken,
  });
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
      <ModalContent className="!bg-background rounded-lg border border-border">
        <ModalHeader>Remove Keypair</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4">
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
          </div>
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
