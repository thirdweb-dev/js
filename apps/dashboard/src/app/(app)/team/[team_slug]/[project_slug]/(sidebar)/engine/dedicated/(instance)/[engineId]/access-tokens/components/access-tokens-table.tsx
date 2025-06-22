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
import { Button } from "chakra/button";
import { FormLabel } from "chakra/form";
import { Text } from "chakra/text";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { TWTable } from "@/components/blocks/TWTable";
import { WalletAddress } from "@/components/blocks/wallet-address";
import {
  type AccessToken,
  useEngineRevokeAccessToken,
  useEngineUpdateAccessToken,
} from "@/hooks/useEngine";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { toDateTimeLocal } from "@/utils/date-utils";

interface AccessTokensTableProps {
  instanceUrl: string;
  accessTokens: AccessToken[];
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
  client: ThirdwebClient;
}

const columnHelper = createColumnHelper<AccessToken>();

export const AccessTokensTable: React.FC<AccessTokensTableProps> = ({
  instanceUrl,
  accessTokens,
  isPending,
  isFetched,
  authToken,
  client,
}) => {
  const editDisclosure = useDisclosure();
  const removeDisclosure = useDisclosure();
  const [selectedAccessToken, setSelectedAccessToken] = useState<AccessToken>();

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("tokenMask", {
        cell: (cell) => {
          return (
            <p className="py-3 font-mono text-foreground">{cell.getValue()}</p>
          );
        },
        header: "Access Token",
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
      columnHelper.accessor("walletAddress", {
        cell: (cell) => {
          const address = cell.getValue();
          return <WalletAddress address={address} client={client} />;
        },
        header: "Created By",
      }),
      columnHelper.accessor("createdAt", {
        cell: (cell) => {
          const value = cell.getValue();

          if (!value) {
            return;
          }
          return <Text>{toDateTimeLocal(value)}</Text>;
        },
        header: "Created At",
      }),
    ];
  }, [client]);

  return (
    <>
      <TWTable
        columns={columns}
        data={accessTokens}
        isFetched={isFetched}
        isPending={isPending}
        onMenuClick={[
          {
            icon: <PencilIcon className="size-4" />,
            onClick: (accessToken) => {
              setSelectedAccessToken(accessToken);
              editDisclosure.onOpen();
            },
            text: "Edit",
          },
          {
            icon: <Trash2Icon className="size-4" />,
            isDestructive: true,
            onClick: (accessToken) => {
              setSelectedAccessToken(accessToken);
              removeDisclosure.onOpen();
            },
            text: "Delete",
          },
        ]}
        title="access tokens"
      />

      {selectedAccessToken && editDisclosure.isOpen && (
        <EditModal
          accessToken={selectedAccessToken}
          authToken={authToken}
          disclosure={editDisclosure}
          instanceUrl={instanceUrl}
        />
      )}
      {selectedAccessToken && removeDisclosure.isOpen && (
        <RemoveModal
          accessToken={selectedAccessToken}
          authToken={authToken}
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
  authToken,
}: {
  accessToken: AccessToken;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
}) => {
  const { mutate: updateAccessToken } = useEngineUpdateAccessToken({
    authToken,
    instanceUrl,
  });

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
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter a description for this access token"
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
    authToken,
    instanceUrl,
  });

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
          <Button onClick={disclosure.onClose} type="button" variant="ghost">
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onClick} type="submit">
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
