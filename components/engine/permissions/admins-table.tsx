import {
  EngineAdmin,
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
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";
import { Button, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";

interface AdminsTableProps {
  instance: string;
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
        <AddressCopyButton address={address} shortenAddress={false} size="xs" />
      );
    },
  }),
  columnHelper.accessor("permissions", {
    header: "Role",
    cell: (cell) => {
      return (
        <Text textTransform="capitalize">{cell.getValue().toLowerCase()}</Text>
      );
    },
  }),
];

export const AdminsTable: React.FC<AdminsTableProps> = ({
  instance,
  admins,
  isLoading,
  isFetched,
}) => {
  const [adminToRevoke, setAdminToRevoke] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: revokePermissions } = useEngineRevokePermissions(instance);
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully revoked admin",
    "Failed to revoked admin",
  );

  const onDelete = (wallet: EngineAdmin) => {
    setAdminToRevoke(wallet.walletAddress);
    onOpen();
  };

  const onRevoke = () => {
    trackEvent({
      category: "engine",
      action: "revoke-admin",
      label: "attempt",
      instance,
    });
    revokePermissions(
      {
        walletAddress: adminToRevoke,
      },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
          trackEvent({
            category: "engine",
            action: "revoke-admin",
            label: "success",
            instance,
          });
        },
        onError: (error) => {
          onError(error);
          trackEvent({
            category: "engine",
            action: "revoke-admin",
            label: "error",
            instance,
            error,
          });
        },
      },
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete admin</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to delete this admin?</Text>
            <AddressCopyButton
              address={adminToRevoke}
              shortenAddress={false}
              size="xs"
              mt={2}
            />
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" colorScheme="red" onClick={onRevoke}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <TWTable
        title="admins"
        data={admins}
        columns={columns}
        isLoading={isLoading}
        isFetched={isFetched}
        onDelete={(wallet) => onDelete(wallet)}
      />
    </>
  );
};
