import {
  AccessToken,
  useEngineRevokeAccessToken,
  useEngineUpdateAccessToken,
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
  UseDisclosureReturn,
  Stack,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";
import { Button, FormLabel, Text } from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { toDateTimeLocal } from "utils/date-utils";

interface AccessTokensTableProps {
  instanceUrl: string;
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
  instanceUrl,
  accessTokens,
  isLoading,
  isFetched,
}) => {
  const editDisclosure = useDisclosure();
  const removeDisclosure = useDisclosure();
  const [selectedAccessToken, setSelectedAccessToken] = useState<AccessToken>();

  return (
    <>
      <TWTable
        title="Access Tokens"
        data={accessTokens}
        columns={columns}
        isLoading={isLoading}
        isFetched={isFetched}
        onEdit={(accessToken) => {
          setSelectedAccessToken(accessToken);
          editDisclosure.onOpen();
        }}
        onDelete={(accessToken) => {
          setSelectedAccessToken(accessToken);
          removeDisclosure.onOpen();
        }}
      />

      {selectedAccessToken && editDisclosure.isOpen && (
        <EditModal
          accessToken={selectedAccessToken}
          disclosure={editDisclosure}
          instanceUrl={instanceUrl}
        />
      )}
      {selectedAccessToken && removeDisclosure.isOpen && (
        <RemoveModal
          accessToken={selectedAccessToken}
          disclosure={removeDisclosure}
          instanceUrl={instanceUrl}
        />
      )}
    </>
  );
};

const EditModal = ({
  accessToken,
  disclosure,
  instanceUrl,
}: {
  accessToken: AccessToken;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
}) => {
  const { mutate: updateAccessToken } = useEngineUpdateAccessToken(instanceUrl);
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully updated access token",
    "Failed to update access token",
  );

  const [label, setLabel] = useState(accessToken.label ?? "");

  const onClick = () => {
    updateAccessToken(
      {
        id: accessToken.id,
        label,
      },
      {
        onSuccess: () => {
          onSuccess();
          disclosure.onClose();
          trackEvent({
            category: "engine",
            action: "update-access-token",
            label: "success",
            instance: instanceUrl,
          });
        },
        onError: (error) => {
          onError(error);
          trackEvent({
            category: "engine",
            action: "update-access-token",
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
        <ModalHeader>Update Access Token</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Access Token</FormLabel>
              <Text>{accessToken.tokenMask}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Label</FormLabel>
              <Input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter a description for this access token"
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
  accessToken,
  disclosure,
  instanceUrl,
}: {
  accessToken: AccessToken;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
}) => {
  const { mutate: deleteAccessToken } = useEngineRevokeAccessToken(instanceUrl);
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully deleted access token",
    "Failed to delete access token",
  );

  const onClick = () => {
    deleteAccessToken(
      {
        id: accessToken.id,
      },
      {
        onSuccess: () => {
          onSuccess();
          disclosure.onClose();
          trackEvent({
            category: "engine",
            action: "revoke-access-token",
            label: "success",
            instance: instanceUrl,
          });
        },
        onError: (error) => {
          onError(error);
          trackEvent({
            category: "engine",
            action: "revoke-access-token",
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
        <ModalHeader>Delete Access Token</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Text>Are you sure you want to delete this access token?</Text>
            <FormControl>
              <FormLabel>Access Token</FormLabel>
              <Text>{accessToken.tokenMask}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Label</FormLabel>
              <Text>{accessToken.label ?? <em>N/A</em>}</Text>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter as={Flex} gap={3}>
          <Button type="button" onClick={disclosure.onClose} variant="ghost">
            Cancel
          </Button>
          <Button type="submit" colorScheme="red" onClick={onClick}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
