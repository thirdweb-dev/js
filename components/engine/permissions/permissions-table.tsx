import {
  PermissionsItem,
  useEngineRevokePermissions,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
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
import { shortenIfAddress } from "utils/usedapp-external";

interface PermissionsTableProps {
  instance: string;
  permissionsItems: PermissionsItem[];
  isLoading: boolean;
  isFetched: boolean;
}

const columnHelper = createColumnHelper<PermissionsItem>();

const columns = [
  columnHelper.accessor("walletAddress", {
    header: "Address",
    cell: (cell) => {
      const address = cell.getValue();
      return <AddressCopyButton address={address} />;
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

export const PermissionsTable: React.FC<PermissionsTableProps> = ({
  instance,
  permissionsItems,
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

  const onDelete = (wallet: PermissionsItem) => {
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
          <ModalHeader>Revoke Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to revoke permissions from{" "}
              <Text fontFamily="mono" display="inline-flex">
                {shortenIfAddress(adminToRevoke)}
              </Text>
              ?
            </Text>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" colorScheme="red" onClick={onRevoke}>
              Revoke
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <TWTable
        title="wallets"
        data={permissionsItems}
        columns={columns}
        isLoading={isLoading}
        isFetched={isFetched}
        onDelete={(wallet) => onDelete(wallet)}
      />
    </>
  );
};
