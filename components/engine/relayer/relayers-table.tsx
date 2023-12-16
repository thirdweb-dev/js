import {
  EngineRelayer,
  UpdateRelayerInput,
  useEngineBackendWallets,
  useEngineRevokeRelayer,
  useEngineUpdateRelayer,
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
  Stack,
  FormControl,
  UseDisclosureReturn,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { NetworkDropdown } from "components/contract-components/contract-publish-form/NetworkDropdown";
import { ChainIcon } from "components/icons/ChainIcon";
import { TWTable } from "components/shared/TWTable";
import { useTrack } from "hooks/analytics/useTrack";
import { useAllChainsData } from "hooks/chains/allChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  FormHelperText,
  FormLabel,
  LinkButton,
  Text,
} from "tw-components";
import { AddressCopyButton } from "tw-components/AddressCopyButton";
import { AddModalInput, parseAddressListRaw } from "./add-relayer-button";
import { shortenString } from "@thirdweb-dev/react";
import { BiPencil } from "react-icons/bi";
import { FiTrash } from "react-icons/fi";

interface RelayersTableProps {
  instanceUrl: string;
  relayers: EngineRelayer[];
  isLoading: boolean;
  isFetched: boolean;
}

const columnHelper = createColumnHelper<EngineRelayer>();

export const RelayersTable: React.FC<RelayersTableProps> = ({
  instanceUrl,
  relayers,
  isLoading,
  isFetched,
}) => {
  const editDisclosure = useDisclosure();
  const removeDisclosure = useDisclosure();
  const [selectedRelayer, setSelectedRelayer] = useState<EngineRelayer>();
  const { chainIdToChainRecord } = useAllChainsData();

  const columns = [
    columnHelper.accessor("chainId", {
      header: "Chain",
      cell: (cell) => {
        const { chainId, backendWalletAddress } = cell.row.original;
        const chain = chainIdToChainRecord[parseInt(chainId)];
        if (chain) {
          const chainNameDisplay = (
            <Flex align="center" gap={2}>
              <ChainIcon size={12} ipfsSrc={chain?.icon?.url} />
              <Text>{chain.name}</Text>
            </Flex>
          );

          const explorer = chain.explorers?.[0];
          if (!explorer) {
            return chainNameDisplay;
          }

          return (
            <LinkButton
              key={explorer.name}
              variant="ghost"
              isExternal
              size="xs"
              href={`${explorer.url}/address/${backendWalletAddress}`}
            >
              {chainNameDisplay}
            </LinkButton>
          );
        }
      },
    }),
    columnHelper.accessor("backendWalletAddress", {
      header: "Backend Wallet",
      cell: (cell) => {
        return <AddressCopyButton size="xs" address={cell.getValue() ?? ""} />;
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
  ];

  return (
    <>
      <TWTable
        title="relayers"
        data={relayers}
        columns={columns}
        isLoading={isLoading}
        isFetched={isFetched}
        onMenuClick={[
          {
            icon: BiPencil,
            text: "Edit",
            onClick: (relayer) => {
              setSelectedRelayer(relayer);
              editDisclosure.onOpen();
            },
          },
          {
            icon: FiTrash,
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
        />
      )}
      {selectedRelayer && removeDisclosure.isOpen && (
        <RemoveModal
          relayer={selectedRelayer}
          disclosure={removeDisclosure}
          instanceUrl={instanceUrl}
        />
      )}
    </>
  );
};

const EditModal = ({
  relayer,
  disclosure,
  instanceUrl,
}: {
  relayer: EngineRelayer;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
}) => {
  const { mutate: updateRelayer } = useEngineUpdateRelayer(instanceUrl);
  const { data: backendWallets } = useEngineBackendWallets(instanceUrl);
  const { chainIdToChainRecord } = useAllChainsData();
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully updated relayer",
    "Failed to update relayer",
  );

  const form = useForm<AddModalInput>({
    defaultValues: {
      ...relayer,
      chainId: parseInt(relayer.chainId),
      allowedContractsRaw: (relayer.allowedContracts ?? []).join("\n"),
      allowedForwardersRaw: (relayer.allowedForwarders ?? []).join("\n"),
    },
  });

  const onSubmit = (data: AddModalInput) => {
    const updateRelayerData: UpdateRelayerInput = {
      id: relayer.id,
      chain: chainIdToChainRecord[data.chainId].slug,
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
      <ModalContent as="form" onSubmit={form.handleSubmit(onSubmit)}>
        <ModalHeader>Update Relayer</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Chain</FormLabel>
              <NetworkDropdown
                value={form.watch("chainId")}
                onSingleChange={(val) => form.setValue("chainId", val)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Backend Wallet</FormLabel>
              <Select
                {...form.register("backendWalletAddress", { required: true })}
              >
                {backendWallets?.map((wallet) => (
                  <option key={wallet.address} value={wallet.address}>
                    {shortenString(wallet.address, false)}
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
          </Stack>
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
}: {
  relayer: EngineRelayer;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
}) => {
  const { mutate: revokeRelayer } = useEngineRevokeRelayer(instanceUrl);
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully removed relayer",
    "Failed to remove relayer",
  );
  const { chainIdToChainRecord } = useAllChainsData();

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
      <ModalContent>
        <ModalHeader>Remove Relayer</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Text>Are you sure you want to remove this relayer?</Text>
            <FormControl>
              <FormLabel>Chain</FormLabel>
              <Flex align="center" gap={2}>
                <ChainIcon
                  size={12}
                  ipfsSrc={
                    chainIdToChainRecord[parseInt(relayer.chainId)].icon?.url
                  }
                />
                <Text>
                  {chainIdToChainRecord[parseInt(relayer.chainId)].name}
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
