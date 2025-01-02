import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import {
  type EngineAdmin,
  useEngineGrantPermissions,
  useEngineRevokePermissions,
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
  type UseDisclosureReturn,
  useDisclosure,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button, FormLabel, Text } from "tw-components";

interface AdminsTableProps {
  instanceUrl: string;
  admins: EngineAdmin[];
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
}

const columnHelper = createColumnHelper<EngineAdmin>();

const columns = [
  columnHelper.accessor("walletAddress", {
    header: "Address",
    cell: (cell) => {
      const address = cell.getValue();
      return <WalletAddress address={address} />;
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
      return <Badge variant="default">{cell.getValue()}</Badge>;
    },
  }),
];

export const AdminsTable: React.FC<AdminsTableProps> = ({
  instanceUrl,
  admins,
  isPending,
  isFetched,
  authToken,
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
        isPending={isPending}
        isFetched={isFetched}
        onMenuClick={[
          {
            icon: <PencilIcon className="size-4" />,
            text: "Edit",
            onClick: (admin) => {
              setSelectedAdmin(admin);
              editDisclosure.onOpen();
            },
          },
          {
            icon: <Trash2Icon className="size-4" />,
            text: "Remove",
            onClick: (admin) => {
              setSelectedAdmin(admin);
              removeDisclosure.onOpen();
            },
            isDestructive: true,
          },
        ]}
      />

      {selectedAdmin && editDisclosure.isOpen && (
        <EditModal
          admin={selectedAdmin}
          disclosure={editDisclosure}
          instanceUrl={instanceUrl}
          authToken={authToken}
        />
      )}
      {selectedAdmin && removeDisclosure.isOpen && (
        <RemoveModal
          admin={selectedAdmin}
          disclosure={removeDisclosure}
          instanceUrl={instanceUrl}
          authToken={authToken}
        />
      )}
    </>
  );
};

const EditModal = ({
  admin,
  disclosure,
  instanceUrl,
  authToken,
}: {
  admin: EngineAdmin;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
}) => {
  const { mutate: updatePermissions } = useEngineGrantPermissions({
    instanceUrl,
    authToken,
  });
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
      <ModalContent className="!bg-background rounded-lg border border-border">
        <ModalHeader>Update Admin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4">
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
          </div>
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
  authToken,
}: {
  admin: EngineAdmin;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
}) => {
  const { mutate: revokePermissions } = useEngineRevokePermissions({
    instanceUrl,
    authToken,
  });
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
      <ModalContent className="!bg-background rounded-lg border border-border">
        <ModalHeader>Remove Admin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Text>Are you sure you want to remove this admin?</Text>
            <FormControl>
              <FormLabel>Wallet Address</FormLabel>
              <Text>{admin.walletAddress}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Label</FormLabel>
              <Text>{admin.label ?? <em>N/A</em>}</Text>
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
