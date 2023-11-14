import {
  EngineAdmin,
  useEngineGrantPermissions,
  useEngineRevokePermissions,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Flex,
  useDisclosure,
  Stack,
  FormControl,
  Input,
  ModalCloseButton,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";
import { Button, FormLabel, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

interface AdminsTableProps {
  instanceUrl: string;
  admins: EngineAdmin[];
  isLoading: boolean;
  isFetched: boolean;
}

const columnHelper = createColumnHelper<EngineAdmin>();

const columns = [
  columnHelper.accessor("walletAddress", {
    header: "Address",
    cell: (cell) => {
      const address = cell.getValue();
      return (
        <AddressCopyButton
          address={address}
          shortenAddress={false}
          size="xs"
          my={2}
        />
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
  columnHelper.accessor("permissions", {
    header: "Role",
    cell: (cell) => {
      return <Text textTransform="capitalize">{cell.getValue()}</Text>;
    },
  }),
];

export const AdminsTable: React.FC<AdminsTableProps> = ({
  instanceUrl,
  admins,
  isLoading,
  isFetched,
}) => {
  const editDisclosure = useDisclosure();
  const removeDisclosure = useDisclosure();
  const [selectedAdmin, setSelectedAdmin] = useState<EngineAdmin>();

  return (
    <>
      <TWTable
        title="admins"
        data={admins}
        columns={columns}
        isLoading={isLoading}
        isFetched={isFetched}
        onEdit={(admin) => {
          setSelectedAdmin(admin);
          editDisclosure.onOpen();
        }}
        onDelete={(admin) => {
          setSelectedAdmin(admin);
          removeDisclosure.onOpen();
        }}
      />

      {selectedAdmin && editDisclosure.isOpen && (
        <EditModal
          admin={selectedAdmin}
          disclosure={editDisclosure}
          instanceUrl={instanceUrl}
        />
      )}
      {selectedAdmin && removeDisclosure.isOpen && (
        <RemoveModal
          admin={selectedAdmin}
          disclosure={removeDisclosure}
          instanceUrl={instanceUrl}
        />
      )}
    </>
  );
};

const EditModal = ({
  admin,
  disclosure,
  instanceUrl,
}: {
  admin: EngineAdmin;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
}) => {
  const { mutate: updatePermissions } = useEngineGrantPermissions(instanceUrl);
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully updated admin",
    "Failed to update admin",
  );

  const [label, setLabel] = useState(admin.label ?? "");

  const onClick = () => {
    updatePermissions(
      {
        walletAddress: admin.walletAddress,
        permissions: admin.permissions,
        label,
      },
      {
        onSuccess: () => {
          onSuccess();
          disclosure.onClose();
          trackEvent({
            category: "engine",
            action: "update-admin",
            label: "success",
            instance: instanceUrl,
          });
        },
        onError: (error) => {
          onError(error);
          trackEvent({
            category: "engine",
            action: "update-admin",
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
        <ModalHeader>Update Admin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Wallet Address</FormLabel>
              <Text>{admin.walletAddress}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Label</FormLabel>
              <Input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter a description for this admin"
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

const RemoveModal = ({
  admin,
  disclosure,
  instanceUrl,
}: {
  admin: EngineAdmin;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
}) => {
  const { mutate: revokePermissions } = useEngineRevokePermissions(instanceUrl);
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully removed admin",
    "Failed to remove admin",
  );

  const onClick = () => {
    revokePermissions(
      {
        walletAddress: admin.walletAddress,
      },
      {
        onSuccess: () => {
          onSuccess();
          disclosure.onClose();
          trackEvent({
            category: "engine",
            action: "revoke-admin",
            label: "success",
            instance: instanceUrl,
          });
        },
        onError: (error) => {
          onError(error);
          trackEvent({
            category: "engine",
            action: "revoke-admin",
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
        <ModalHeader>Remove Admin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Text>Are you sure you want to remove this admin?</Text>
            <FormControl>
              <FormLabel>Wallet Address</FormLabel>
              <Text>{admin.walletAddress}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Label</FormLabel>
              <Text>{admin.label ?? <em>N/A</em>}</Text>
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
