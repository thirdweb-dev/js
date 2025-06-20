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
import { useTxNotifications } from "hooks/useTxNotifications";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { Button, FormLabel, Text } from "tw-components";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";

interface AdminsTableProps {
  instanceUrl: string;
  admins: EngineAdmin[];
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
  client: ThirdwebClient;
}

const columnHelper = createColumnHelper<EngineAdmin>();

export const AdminsTable: React.FC<AdminsTableProps> = ({
  instanceUrl,
  admins,
  isPending,
  isFetched,
  authToken,
  client,
}) => {
  const editDisclosure = useDisclosure();
  const removeDisclosure = useDisclosure();
  const [selectedAdmin, setSelectedAdmin] = useState<EngineAdmin>();

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("walletAddress", {
        cell: (cell) => {
          const address = cell.getValue();
          return <WalletAddress address={address} client={client} />;
        },
        header: "Address",
      }),
      columnHelper.accessor("label", {
        cell: (cell) => {
          return (
            <Text isTruncated maxW={300}>
              {cell.getValue()}
            </Text>
          );
        },
        header: "Label",
      }),
      columnHelper.accessor("permissions", {
        cell: (cell) => {
          return <Badge variant="default">{cell.getValue()}</Badge>;
        },
        header: "Role",
      }),
    ];
  }, [client]);

  return (
    <>
      <TWTable
        columns={columns}
        data={admins}
        isFetched={isFetched}
        isPending={isPending}
        onMenuClick={[
          {
            icon: <PencilIcon className="size-4" />,
            onClick: (admin) => {
              setSelectedAdmin(admin);
              editDisclosure.onOpen();
            },
            text: "Edit",
          },
          {
            icon: <Trash2Icon className="size-4" />,
            isDestructive: true,
            onClick: (admin) => {
              setSelectedAdmin(admin);
              removeDisclosure.onOpen();
            },
            text: "Remove",
          },
        ]}
        title="admins"
      />

      {selectedAdmin && editDisclosure.isOpen && (
        <EditModal
          admin={selectedAdmin}
          authToken={authToken}
          disclosure={editDisclosure}
          instanceUrl={instanceUrl}
        />
      )}
      {selectedAdmin && removeDisclosure.isOpen && (
        <RemoveModal
          admin={selectedAdmin}
          authToken={authToken}
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
  authToken,
}: {
  admin: EngineAdmin;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
}) => {
  const { mutate: updatePermissions } = useEngineGrantPermissions({
    authToken,
    instanceUrl,
  });

  const { onSuccess, onError } = useTxNotifications(
    "Successfully updated admin",
    "Failed to update admin",
  );

  const [label, setLabel] = useState(admin.label ?? "");

  const onClick = () => {
    updatePermissions(
      {
        label,
        permissions: admin.permissions,
        walletAddress: admin.walletAddress,
      },
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
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter a description for this admin"
                type="text"
                value={label}
              />
            </FormControl>
          </div>
        </ModalBody>

        <ModalFooter as={Flex} gap={3}>
          <Button onClick={disclosure.onClose} type="button" variant="ghost">
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={onClick} type="submit">
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
    authToken,
    instanceUrl,
  });

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
