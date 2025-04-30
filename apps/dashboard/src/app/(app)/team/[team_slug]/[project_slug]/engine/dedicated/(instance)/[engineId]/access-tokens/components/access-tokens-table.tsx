import { WalletAddress } from "@/components/blocks/wallet-address";
import {
  type AccessToken,
  useEngineRevokeAccessToken,
  useEngineUpdateAccessToken,
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
import { toDateTimeLocal } from "utils/date-utils";

interface AccessTokensTableProps {
  instanceUrl: string;
  accessTokens: AccessToken[];
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
}

const columnHelper = createColumnHelper<AccessToken>();

const columns = [
  columnHelper.accessor("tokenMask", {
    header: "Access Token",
    cell: (cell) => {
      return (
        <p className="py-3 font-mono text-foreground">{cell.getValue()}</p>
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
      return <WalletAddress address={address} />;
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
  isPending,
  isFetched,
  authToken,
}) => {
  const editDisclosure = useDisclosure();
  const removeDisclosure = useDisclosure();
  const [selectedAccessToken, setSelectedAccessToken] = useState<AccessToken>();

  return (
    <>
      <TWTable
        title="access tokens"
        data={accessTokens}
        columns={columns}
        isPending={isPending}
        isFetched={isFetched}
        onMenuClick={[
          {
            icon: <PencilIcon className="size-4" />,
            text: "Edit",
            onClick: (accessToken) => {
              setSelectedAccessToken(accessToken);
              editDisclosure.onOpen();
            },
          },
          {
            icon: <Trash2Icon className="size-4" />,
            text: "Delete",
            onClick: (accessToken) => {
              setSelectedAccessToken(accessToken);
              removeDisclosure.onOpen();
            },
            isDestructive: true,
          },
        ]}
      />

      {selectedAccessToken && editDisclosure.isOpen && (
        <EditModal
          accessToken={selectedAccessToken}
          disclosure={editDisclosure}
          instanceUrl={instanceUrl}
          authToken={authToken}
        />
      )}
      {selectedAccessToken && removeDisclosure.isOpen && (
        <RemoveModal
          accessToken={selectedAccessToken}
          disclosure={removeDisclosure}
          instanceUrl={instanceUrl}
          authToken={authToken}
        />
      )}
    </>
  );
};

const EditModal = ({
  accessToken,
  disclosure,
  instanceUrl,
  authToken,
}: {
  accessToken: AccessToken;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
}) => {
  const { mutate: updateAccessToken } = useEngineUpdateAccessToken({
    instanceUrl,
    authToken,
  });
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
      <ModalContent className="!bg-background rounded-lg border border-border">
        <ModalHeader>Update Access Token</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4">
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
  accessToken,
  disclosure,
  instanceUrl,
  authToken,
}: {
  accessToken: AccessToken;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
}) => {
  const { mutate: deleteAccessToken } = useEngineRevokeAccessToken({
    instanceUrl,
    authToken,
  });
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
      <ModalContent className="!bg-background rounded-lg border border-border">
        <ModalHeader>Delete Access Token</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Text>Are you sure you want to delete this access token?</Text>
            <FormControl>
              <FormLabel>Access Token</FormLabel>
              <Text>{accessToken.tokenMask}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Label</FormLabel>
              <Text>{accessToken.label ?? <em>N/A</em>}</Text>
            </FormControl>
          </div>
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
