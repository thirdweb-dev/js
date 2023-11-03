import {
  AccessToken,
  useEngineRevokeAccessToken,
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
import { toDateTimeLocal } from "utils/date-utils";

interface AccessTokensTableProps {
  instance: string;
  accessTokens: AccessToken[];
  isLoading: boolean;
  isFetched: boolean;
}

const columnHelper = createColumnHelper<AccessToken>();

const columns = [
  columnHelper.accessor("tokenMask", {
    header: "Access Token",
    cell: (cell) => {
      return (
        <Text fontFamily="mono" fontSize="small">
          {cell.getValue()}
        </Text>
      );
    },
  }),
  columnHelper.accessor("walletAddress", {
    header: "Created By",
    cell: (cell) => {
      const address = cell.getValue();
      return <AddressCopyButton address={address} size="xs" />;
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (cell) => {
      const value = cell.getValue();

      if (!value) {
        return;
      }
      return <Text>{toDateTimeLocal(value)}</Text>;
    },
  }),
];

export const AccessTokensTable: React.FC<AccessTokensTableProps> = ({
  instance,
  accessTokens,
  isLoading,
  isFetched,
}) => {
  const [accessTokenToRevoke, setAccessTokenToRevoke] = useState<AccessToken>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: revokePermissions } = useEngineRevokeAccessToken(instance);
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully revoked access token",
    "Failed to revoked access token",
  );

  const onDelete = (accessToken: AccessToken) => {
    setAccessTokenToRevoke(accessToken);
    onOpen();
  };

  const onRevoke = () => {
    trackEvent({
      category: "engine",
      action: "revoke-access-token",
      label: "attempt",
      instance,
    });
    revokePermissions(
      {
        id: accessTokenToRevoke?.id || "",
      },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
          trackEvent({
            category: "engine",
            action: "revoke-access-token",
            label: "success",
            instance,
          });
        },
        onError: (error) => {
          onError(error);
          trackEvent({
            category: "engine",
            action: "revoke-access-token",
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
          <ModalHeader>Revoke Access Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to revoke the access token{" "}
              <Text fontFamily="mono" display="inline-flex">
                {accessTokenToRevoke?.tokenMask}
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
        title="access tokens"
        data={accessTokens}
        columns={columns}
        isLoading={isLoading}
        isFetched={isFetched}
        onDelete={(accessToken) => onDelete(accessToken)}
      />
    </>
  );
};
