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
import { Button } from "chakra/button";
import { FormLabel } from "chakra/form";
import { Text } from "chakra/text";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { TWTable } from "@/components/blocks/TWTable";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { PlainTextCodeBlock } from "@/components/ui/code/plaintext-code";
import { type Keypair, useEngineRemoveKeypair } from "@/hooks/useEngine";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { toDateTimeLocal } from "@/utils/date-utils";

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
    cell: (cell) => {
      return <Text>{cell.getValue()}</Text>;
    },
    header: "Label",
  }),
  columnHelper.accessor("hash", {
    cell: (cell) => {
      return (
        <CopyAddressButton address={cell.getValue()} copyIconPosition="right" />
      );
    },
    header: "Key ID",
  }),
  columnHelper.accessor("publicKey", {
    cell: (cell) => {
      return (
        <PlainTextCodeBlock
          className="max-w-[350px]"
          code={cell.getValue()}
          codeClassName="text-xs"
        />
      );
    },
    header: "Public Key",
  }),
  columnHelper.accessor("algorithm", {
    cell: (cell) => {
      return <Text>{cell.getValue()}</Text>;
    },
    header: "Type",
  }),
  columnHelper.accessor("createdAt", {
    cell: (cell) => {
      return <Text>{toDateTimeLocal(cell.getValue())}</Text>;
    },
    header: "Added At",
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
        columns={columns}
        data={keypairs}
        isFetched={isFetched}
        isPending={isPending}
        onMenuClick={[
          {
            icon: <Trash2Icon className="size-4" />,
            isDestructive: true,
            onClick: (keypair) => {
              setSelectedKeypair(keypair);
              removeDisclosure.onOpen();
            },
            text: "Remove",
          },
        ]}
        title="public keys"
      />

      {selectedKeypair && removeDisclosure.isOpen && (
        <RemoveModal
          authToken={authToken}
          disclosure={removeDisclosure}
          instanceUrl={instanceUrl}
          keypair={selectedKeypair}
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
    authToken,
    instanceUrl,
  });

  const { onSuccess, onError } = useTxNotifications(
    "Successfully removed public key",
    "Failed to remove public key",
  );

  const onClick = () => {
    revokeKeypair(
      { hash: keypair.hash },
      {
        onError: (error) => {
          onError(error);
          console.error(error);
        },
        onSuccess: () => {
          onSuccess();
          disclosure.onClose();
        },
      },
    );
  };

  return (
    <Modal isCentered isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
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
          <Button onClick={disclosure.onClose} type="button" variant="ghost">
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onClick} type="submit">
            Remove
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
