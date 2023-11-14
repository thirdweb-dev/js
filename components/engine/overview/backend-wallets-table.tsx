import {
  BackendWallet,
  useEngineBackendWalletBalance,
  useEngineUpdateBackendWallet,
} from "@3rdweb-sdk/react/hooks/useEngine";
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
  UseDisclosureReturn,
  useDisclosure,
} from "@chakra-ui/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";
import { Badge, Button, FormLabel, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

interface BackendWalletsTableProps {
  wallets: BackendWallet[];
  instanceUrl: string;
  isLoading: boolean;
  isFetched: boolean;
}

interface BackendWalletDashboard extends BackendWallet {
  balance: string;
}

const columnHelper = createColumnHelper<BackendWalletDashboard>();

const setColumns = (instanceUrl: string) => [
  columnHelper.accessor("address", {
    header: "Address",
    cell: (cell) => {
      const address = cell.getValue();
      return (
        <AddressCopyButton address={address} shortenAddress={false} size="xs" />
      );
    },
  }),
  columnHelper.accessor("label", {
    header: "Label",
    cell: (cell) => {
      return (
        <Text isTruncated maxW={300}>
          {cell.getValue()}
        </Text>
      );
    },
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (cell) => {
      return (
        <Badge
          borderRadius="full"
          size="label.sm"
          variant="subtle"
          px={3}
          py={1.5}
          colorScheme="black"
        >
          {cell.getValue()}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("address", {
    header: "Balance",
    cell: (cell) => {
      const address = cell.getValue();
      return (
        <BackendWalletBalanceCell instance={instanceUrl} address={address} />
      );
    },
    id: "balance",
  }),
];

interface BackendWalletBalanceCellProps {
  instance: string;
  address: string;
}

const BackendWalletBalanceCell: React.FC<BackendWalletBalanceCellProps> = ({
  instance,
  address,
}) => {
  const { data: backendWalletBalance } = useEngineBackendWalletBalance(
    instance,
    address,
  );

  return (
    <Text>
      {parseFloat(backendWalletBalance?.displayValue ?? "0").toFixed(6)}{" "}
      {backendWalletBalance?.symbol}
    </Text>
  );
};

export const BackendWalletsTable: React.FC<BackendWalletsTableProps> = ({
  wallets,
  instanceUrl,
  isLoading,
  isFetched,
}) => {
  const editDisclosure = useDisclosure();
  const columns = setColumns(instanceUrl);
  const [selectedBackendWallet, setSelectedBackendWallet] =
    useState<BackendWallet>();

  return (
    <>
      <TWTable
        title="backend wallets"
        data={wallets}
        columns={columns as ColumnDef<BackendWallet, string>[]}
        isLoading={isLoading}
        isFetched={isFetched}
        onEdit={(wallet) => {
          setSelectedBackendWallet(wallet);
          editDisclosure.onOpen();
        }}
      />

      {selectedBackendWallet && editDisclosure.isOpen && (
        <EditModal
          backendWallet={selectedBackendWallet}
          disclosure={editDisclosure}
          instanceUrl={instanceUrl}
        />
      )}
    </>
  );
};

const EditModal = ({
  backendWallet,
  disclosure,
  instanceUrl,
}: {
  backendWallet: BackendWallet;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
}) => {
  const { mutate: updatePermissions } =
    useEngineUpdateBackendWallet(instanceUrl);
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully updated backend wallet",
    "Failed to update backend wallet",
  );

  const [label, setLabel] = useState(backendWallet.label ?? "");

  const onClick = () => {
    updatePermissions(
      {
        walletAddress: backendWallet.address,
        label,
      },
      {
        onSuccess: () => {
          onSuccess();
          disclosure.onClose();
          trackEvent({
            category: "engine",
            action: "update-backend-wallet",
            label: "success",
            instance: instanceUrl,
          });
        },
        onError: (error) => {
          onError(error);
          trackEvent({
            category: "engine",
            action: "update-backend-wallet",
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
        <ModalHeader>Update Backend Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Wallet Address</FormLabel>
              <Text>{backendWallet.address}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Label</FormLabel>
              <Input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter a description for this backend wallet"
              />
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter as={Flex} gap={3}>
          <Button type="button" onClick={disclosure.onClose} variant="ghost">
            Cancel
          </Button>
          <Button type="submit" colorScheme="blue" onClick={onClick}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
