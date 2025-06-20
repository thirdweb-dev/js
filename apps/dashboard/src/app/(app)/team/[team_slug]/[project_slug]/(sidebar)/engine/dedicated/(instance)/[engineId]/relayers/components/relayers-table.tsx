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
import { ChainIconClient } from "components/icons/ChainIcon";
import { TWTable } from "components/shared/TWTable";
import { useAllChainsData } from "hooks/chains/allChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import {
  Button,
  FormHelperText,
  FormLabel,
  Legacy_CopyButton,
  LinkButton,
  Text,
} from "tw-components";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { type AddModalInput, parseAddressListRaw } from "./add-relayer-button";

interface RelayersTableProps {
  instanceUrl: string;
  relayers: EngineRelayer[];
  isPending: boolean;
  isFetched: boolean;
  authToken: string;
  client: ThirdwebClient;
}

const columnHelper = createColumnHelper<EngineRelayer>();

export const RelayersTable: React.FC<RelayersTableProps> = ({
  instanceUrl,
  relayers,
  isPending,
  isFetched,
  authToken,
  client,
}) => {
  const editDisclosure = useDisclosure();
  const removeDisclosure = useDisclosure();
  const [selectedRelayer, setSelectedRelayer] = useState<EngineRelayer>();
  const { idToChain } = useAllChainsData();

  const columns = [
    columnHelper.accessor("chainId", {
      cell: (cell) => {
        const chain = idToChain.get(Number.parseInt(cell.getValue()));
        return (
          <Flex align="center" gap={2}>
            <ChainIconClient
              className="size-3"
              client={client}
              src={chain?.icon?.url}
            />
            <Text>{chain?.name ?? "N/A"}</Text>
          </Flex>
        );
      },
      header: "Chain",
    }),
    columnHelper.accessor("backendWalletAddress", {
      cell: (cell) => {
        const { chainId, backendWalletAddress } = cell.row.original;
        const chain = idToChain.get(Number.parseInt(chainId));

        const explorer = chain?.explorers?.[0];
        if (!explorer) {
          return backendWalletAddress;
        }

        return (
          <LinkButton
            fontFamily="mono"
            href={`${explorer.url}/address/${backendWalletAddress}`}
            isExternal
            key={explorer.name}
            size="xs"
            variant="ghost"
          >
            {backendWalletAddress}
          </LinkButton>
        );
      },
      header: "Backend Wallet",
    }),
    columnHelper.accessor("name", {
      cell: (cell) => {
        return <Text>{cell.getValue()}</Text>;
      },
      header: "Label",
    }),
    columnHelper.accessor("allowedContracts", {
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
      header: "Allowed Contracts",
    }),
    columnHelper.accessor("allowedForwarders", {
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
      header: "Allowed Forwarders",
    }),
    columnHelper.accessor("id", {
      cell: (cell) => {
        const id = cell.getValue();
        const url = `${instanceUrl}relayer/${id}`;
        return <Legacy_CopyButton aria-label="Copy to clipboard" value={url} />;
      },
      header: "URL",
    }),
  ];

  return (
    <>
      <TWTable
        columns={columns}
        data={relayers}
        isFetched={isFetched}
        isPending={isPending}
        onMenuClick={[
          {
            icon: <PencilIcon className="size-4" />,
            onClick: (relayer) => {
              setSelectedRelayer(relayer);
              editDisclosure.onOpen();
            },
            text: "Edit",
          },
          {
            icon: <Trash2Icon className="size-4" />,
            isDestructive: true,
            onClick: (relayer) => {
              setSelectedRelayer(relayer);
              removeDisclosure.onOpen();
            },
            text: "Remove",
          },
        ]}
        title="relayers"
      />

      {selectedRelayer && editDisclosure.isOpen && (
        <EditModal
          authToken={authToken}
          client={client}
          disclosure={editDisclosure}
          instanceUrl={instanceUrl}
          relayer={selectedRelayer}
        />
      )}
      {selectedRelayer && removeDisclosure.isOpen && (
        <RemoveModal
          authToken={authToken}
          client={client}
          disclosure={removeDisclosure}
          instanceUrl={instanceUrl}
          relayer={selectedRelayer}
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
  client,
}: {
  relayer: EngineRelayer;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) => {
  const { mutate: updateRelayer } = useEngineUpdateRelayer({
    authToken,
    instanceUrl,
  });
  const { data: backendWallets } = useEngineBackendWallets({
    authToken,
    instanceUrl,
  });
  const { idToChain } = useAllChainsData();

  const { onSuccess, onError } = useTxNotifications(
    "Successfully updated relayer",
    "Failed to update relayer",
  );

  const form = useForm<AddModalInput>({
    defaultValues: {
      ...relayer,
      allowedContractsRaw: (relayer.allowedContracts ?? []).join("\n"),
      allowedForwardersRaw: (relayer.allowedForwarders ?? []).join("\n"),
      chainId: Number.parseInt(relayer.chainId),
    },
  });

  const onSubmit = (data: AddModalInput) => {
    const updateRelayerData: UpdateRelayerInput = {
      allowedContracts: parseAddressListRaw(data.allowedContractsRaw),
      allowedForwarders: parseAddressListRaw(data.allowedForwardersRaw),
      backendWalletAddress: data.backendWalletAddress,
      chain: idToChain.get(data.chainId)?.slug ?? "unknown",
      id: relayer.id,
      name: data.name,
    };

    updateRelayer(updateRelayerData, {
      onError: (error) => {
        onError(error);
        console.error(error);
      },
      onSuccess: () => {
        onSuccess();
        disclosure.onClose();
      },
    });
  };

  return (
    <Modal isCentered isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
      <ModalOverlay />
      <ModalContent
        as="form"
        className="!bg-background rounded-lg border border-border"
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
                client={client}
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
                placeholder="Enter a description for this relayer"
                type="text"
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
          <Button onClick={disclosure.onClose} type="button" variant="ghost">
            Cancel
          </Button>
          <Button colorScheme="blue" type="submit">
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
  client,
}: {
  relayer: EngineRelayer;
  disclosure: UseDisclosureReturn;
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}) => {
  const { mutate: revokeRelayer } = useEngineRevokeRelayer({
    authToken,
    instanceUrl,
  });

  const { onSuccess, onError } = useTxNotifications(
    "Successfully removed relayer",
    "Failed to remove relayer",
  );
  const { idToChain } = useAllChainsData();

  const onClick = () => {
    revokeRelayer(
      { id: relayer.id },
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
        <ModalHeader>Remove Relayer</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Text>Are you sure you want to remove this relayer?</Text>
            <FormControl>
              <FormLabel>Chain</FormLabel>
              <Flex align="center" gap={2}>
                <ChainIconClient
                  className="size-3"
                  client={client}
                  src={
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
