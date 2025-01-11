import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import {
  type EngineRelayer,
  type UpdateRelayerInput,
  useEngineBackendWallets,
  useEngineRevokeRelayer,
  useEngineUpdateRelayer,
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
  Select,
  Textarea,
  type UseDisclosureReturn,
  useDisclosure,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { ChainIcon } from "components/icons/ChainIcon";
import { TWTable } from "components/shared/TWTable";
import { useTrack } from "hooks/analytics/useTrack";
import { useAllChainsData } from "hooks/chains/allChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { shortenAddress } from "thirdweb/utils";
import {
  Button,
  FormHelperText,
  FormLabel,
  LinkButton,
  Text,
  TrackedCopyButton,
} from "tw-components";
import { type AddModalInput, parseAddressListRaw } from "./add-relayer-button";

interface RelayersTableProps {
  instanceUrl: string;
  relayers: EngineRelayer[];
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
}

const columnHelper = createColumnHelper<EngineRelayer>();

export const RelayersTable: React.FC<RelayersTableProps> = ({
  instanceUrl,
  relayers,
  isPending,
  isFetched,
  authToken,
}) => {
  const editDisclosure = useDisclosure();
  const removeDisclosure = useDisclosure();
  const [selectedRelayer, setSelectedRelayer] = useState<EngineRelayer>();
  const { idToChain } = useAllChainsData();

  const columns = [
    columnHelper.accessor("chainId", {
      header: "Chain",
      cell: (cell) => {
        const chain = idToChain.get(Number.parseInt(cell.getValue()));
        return (
          <Flex align="center" gap={2}>
            <ChainIcon className="size-3" ipfsSrc={chain?.icon?.url} />
            <Text>{chain?.name ?? "N/A"}</Text>
          </Flex>
        );
      },
    }),
    columnHelper.accessor("backendWalletAddress", {
      header: "Backend Wallet",
      cell: (cell) => {
        const { chainId, backendWalletAddress } = cell.row.original;
        const chain = idToChain.get(Number.parseInt(chainId));

        const explorer = chain?.explorers?.[0];
        if (!explorer) {
          return backendWalletAddress;
        }

        return (
          <LinkButton
            key={explorer.name}
            variant="ghost"
            isExternal
            size="xs"
            href={`${explorer.url}/address/${backendWalletAddress}`}
            fontFamily="mono"
          >
            {backendWalletAddress}
          </LinkButton>
        );
      },
    }),
    columnHelper.accessor("name", {
      header: "Label",
      cell: (cell) => {
        return <Text>{cell.getValue()}</Text>;
      },
    }),
    columnHelper.accessor("allowedContracts", {
      header: "Allowed Contracts",
      cell: (cell) => {
        const allowedContracts = cell.getValue() ?? [];
        const value =
          allowedContracts.length === 0
            ? "*"
            : allowedContracts.length === 1
              ? `${allowedContracts.length} address`
              : `${allowedContracts.length} addresses`;
        return <Text>{value}</Text>;
      },
    }),
    columnHelper.accessor("allowedForwarders", {
      header: "Allowed Forwarders",
      cell: (cell) => {
        const allowedForwarders = cell.getValue() ?? [];
        const value =
          allowedForwarders.length === 0
            ? "*"
            : allowedForwarders.length === 1
              ? `${allowedForwarders.length} address`
              : `${allowedForwarders.length} addresses`;
        return <Text>{value}</Text>;
      },
    }),
    columnHelper.accessor("id", {
      header: "URL",
      cell: (cell) => {
        const id = cell.getValue();
        const url = `${instanceUrl}relayer/${id}`;
        return (
          <TrackedCopyButton
            value={url}
            category="engine"
            aria-label="Copy to clipboard"
          />
        );
      },
    }),
  ];

  return (
    <>
      <TWTable
        title="relayers"
        data={relayers}
        columns={columns}
        isPending={isPending}
        isFetched={isFetched}
        onMenuClick={[
          {
            icon: <PencilIcon className="size-4" />,
            text: "Edit",
            onClick: (relayer) => {
              setSelectedRelayer(relayer);
              editDisclosure.onOpen();
            },
          },
          {
            icon: <Trash2Icon className="size-4" />,
            text: "Remove",
            onClick: (relayer) => {
              setSelectedRelayer(relayer);
              removeDisclosure.onOpen();
            },
            isDestructive: true,
          },
        ]}
      />

      {selectedRelayer && editDisclosure.isOpen && (
        <EditModal
          relayer={selectedRelayer}
          disclosure={editDisclosure}
          instanceUrl={instanceUrl}
          authToken={authToken}
        />
      )}
      {selectedRelayer && removeDisclosure.isOpen && (
        <RemoveModal
          relayer={selectedRelayer}
          disclosure={removeDisclosure}
          instanceUrl={instanceUrl}
          authToken={authToken}
        />
      )}
    </>
  );
};

const EditModal = ({
  relayer,
  disclosure,
  instanceUrl,
  authToken,
}: {
  relayer: EngineRelayer;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
}) => {
  const { mutate: updateRelayer } = useEngineUpdateRelayer({
    instanceUrl,
    authToken,
  });
  const { data: backendWallets } = useEngineBackendWallets({
    instanceUrl,
    authToken,
  });
  const { idToChain } = useAllChainsData();
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully updated relayer",
    "Failed to update relayer",
  );

  const form = useForm<AddModalInput>({
    defaultValues: {
      ...relayer,
      chainId: Number.parseInt(relayer.chainId),
      allowedContractsRaw: (relayer.allowedContracts ?? []).join("\n"),
      allowedForwardersRaw: (relayer.allowedForwarders ?? []).join("\n"),
    },
  });

  const onSubmit = (data: AddModalInput) => {
    const updateRelayerData: UpdateRelayerInput = {
      id: relayer.id,
      chain: idToChain.get(data.chainId)?.slug ?? "unknown",
      backendWalletAddress: data.backendWalletAddress,
      name: data.name,
      allowedContracts: parseAddressListRaw(data.allowedContractsRaw),
      allowedForwarders: parseAddressListRaw(data.allowedForwardersRaw),
    };

    updateRelayer(updateRelayerData, {
      onSuccess: () => {
        onSuccess();
        disclosure.onClose();
        trackEvent({
          category: "engine",
          action: "update-relayer",
          label: "success",
          instance: instanceUrl,
        });
      },
      onError: (error) => {
        onError(error);
        trackEvent({
          category: "engine",
          action: "update-relayer",
          label: "error",
          instance: instanceUrl,
          error,
        });
      },
    });
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        className="!bg-background rounded-lg border border-border"
        as="form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <ModalHeader>Update Relayer</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4">
            <FormControl>
              <FormLabel>Chain</FormLabel>
              <SingleNetworkSelector
                chainId={form.watch("chainId")}
                onChange={(val) => form.setValue("chainId", val)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Backend Wallet</FormLabel>
              <Select
                {...form.register("backendWalletAddress", { required: true })}
              >
                {backendWallets?.map((wallet) => (
                  <option key={wallet.address} value={wallet.address}>
                    {shortenAddress(wallet.address)}
                    {wallet.label && ` (${wallet.label})`}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Label</FormLabel>
              <Input
                type="text"
                placeholder="Enter a description for this relayer"
                {...form.register("name")}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Allowed Contracts</FormLabel>
              <Textarea
                {...form.register("allowedContractsRaw")}
                placeholder="Enter a comma or newline-separated list of contract addresses"
                rows={4}
              />
              <FormHelperText>Allow all contracts if omitted.</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Allowed Forwarders</FormLabel>
              <Textarea
                {...form.register("allowedForwardersRaw")}
                placeholder="Enter a comma or newline-separated list of forwarder addresses"
                rows={4}
              />
              <FormHelperText>Allow all forwarders if omitted.</FormHelperText>
            </FormControl>
          </div>
        </ModalBody>

        <ModalFooter as={Flex} gap={3}>
          <Button type="button" onClick={disclosure.onClose} variant="ghost">
            Cancel
          </Button>
          <Button type="submit" colorScheme="blue">
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const RemoveModal = ({
  relayer,
  disclosure,
  instanceUrl,
  authToken,
}: {
  relayer: EngineRelayer;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
}) => {
  const { mutate: revokeRelayer } = useEngineRevokeRelayer({
    instanceUrl,
    authToken,
  });
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully removed relayer",
    "Failed to remove relayer",
  );
  const { idToChain } = useAllChainsData();

  const onClick = () => {
    revokeRelayer(
      { id: relayer.id },
      {
        onSuccess: () => {
          onSuccess();
          disclosure.onClose();
          trackEvent({
            category: "engine",
            action: "revoke-relayer",
            label: "success",
            instance: instanceUrl,
          });
        },
        onError: (error) => {
          onError(error);
          trackEvent({
            category: "engine",
            action: "revoke-relayer",
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
        <ModalHeader>Remove Relayer</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Text>Are you sure you want to remove this relayer?</Text>
            <FormControl>
              <FormLabel>Chain</FormLabel>
              <Flex align="center" gap={2}>
                <ChainIcon
                  className="size-3"
                  ipfsSrc={
                    idToChain.get(Number.parseInt(relayer.chainId))?.icon?.url
                  }
                />
                <Text>
                  {idToChain.get(Number.parseInt(relayer.chainId))?.name}
                </Text>
              </Flex>
            </FormControl>
            <FormControl>
              <FormLabel>Backend Wallet</FormLabel>
              <Text>{relayer.backendWalletAddress}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Label</FormLabel>
              <Text>{relayer.name ?? <em>N/A</em>}</Text>
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
