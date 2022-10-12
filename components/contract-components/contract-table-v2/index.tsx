import BuiltinSolanaDeployForm from "../contract-deploy-form/solana-program";
import { ReleasedContractDetails } from "../hooks";
import {
  Flex,
  Icon,
  Image,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  UseDisclosureReturn,
  useDisclosure,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Solana } from "@thirdweb-dev/chain-icons";
import { ThirdwebSDKProvider, useSDK } from "@thirdweb-dev/react/solana";
import { ContractType } from "@thirdweb-dev/sdk/evm";
import type {
  NFTCollectionMetadataInput,
  NFTDropContractInput,
  TokenMetadataInput,
} from "@thirdweb-dev/sdk/solana";
import { ChakraNextImage } from "components/Image";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FancyEVMIcon } from "components/icons/Ethereum";
import {
  BuiltinContractDetails,
  FeatureIconMap,
  SolContractType,
} from "constants/mappings";
import { getSOLRPC } from "constants/rpc";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { replaceIpfsUrl } from "lib/sdk";
import { useRouter } from "next/router";
import React, { useId, useMemo, useState } from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { FiArrowRight } from "react-icons/fi";
import { Column, Row, useTable } from "react-table";
import invariant from "tiny-invariant";
import {
  AddressCopyButton,
  Card,
  Drawer,
  Heading,
  LinkButton,
  Text,
  TrackedIconButton,
  TrackedLink,
} from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";
import {
  DashboardSolanaNetwork,
  SupportedSolanaNetworkToUrlMap,
} from "utils/network";

interface ReleasedContractTableProps {
  contractDetails: ContractDataInput[];
  isFetching?: boolean;
  hideReleasedBy?: true;
}

type ContractDataInput = BuiltinContractDetails | ReleasedContractDetails;
type ContractDataRow = ContractDataInput["metadata"] & {
  ecosystem: "evm" | "solana";
  id: string;
  contractType: ContractType | SolContractType;
};

function convertContractDataToRowData(
  input: ContractDataInput,
): ContractDataRow {
  return {
    id: input.id,
    ...input.metadata,
    ecosystem: (input as BuiltinContractDetails)?.ecosytem || "evm",
    contractType: (input as BuiltinContractDetails)?.contractType || "custom",
  };
}

export const ReleasedContractTable: ComponentWithChildren<
  ReleasedContractTableProps
> = ({ contractDetails, isFetching, children, hideReleasedBy }) => {
  const rows = useMemo(
    () => contractDetails.map(convertContractDataToRowData),
    [contractDetails],
  );

  const trackEvent = useTrack();

  const tableColumns: Column<ContractDataRow>[] = useMemo(() => {
    const cols: Column<ContractDataRow>[] = [
      {
        Header: "Logo",
        accessor: (row) => row.logo,
        Cell: (cell: any) =>
          cell.value ? (
            typeof cell.value === "string" ? (
              <Image alt="" src={cell.value} boxSize={8} />
            ) : (
              <ChakraNextImage alt="" src={cell.value} boxSize={8} />
            )
          ) : (
            <ChakraNextImage
              alt=""
              src={FeatureIconMap["custom"]}
              boxSize={8}
            />
          ),
      },
      {
        Header: "Name",
        accessor: (row) => row.name,
        Cell: (cell: any) => (
          <Heading size="label.md" whiteSpace="nowrap">
            {cell.value}
          </Heading>
        ),
      },
      {
        Header: "Description",
        accessor: (row) => row.description,
        Cell: (cell: any) => (
          <Text noOfLines={2} size="body.md">
            {cell.value}
          </Text>
        ),
      },
      {
        Header: "Version",
        accessor: (row) => row.version,
        Cell: (cell: any) => <Text>{cell.value}</Text>,
      },
      {
        Header: "Released By",
        accessor: (row) => row.publisher,
        Cell: (cell: any) => <AddressCopyButton address={cell.value} />,
      },
      {
        id: "audit-badge",
        accessor: (row) => ({ audit: row.audit, ecosystem: row.ecosystem }),
        Cell: (cell: any) => (
          <Flex align="center" as="span" gap="2">
            {cell.value.ecosystem === "evm" ? (
              <Tooltip
                p={0}
                bg="transparent"
                boxShadow="none"
                label={
                  <Card py={2} px={4}>
                    <Text size="label.sm">EVM</Text>
                  </Card>
                }
                borderRadius="lg"
                placement="top"
                shouldWrapChildren
              >
                <Icon as={FancyEVMIcon} opacity={0.85} boxSize={4} />
              </Tooltip>
            ) : (
              <Tooltip
                p={0}
                bg="transparent"
                boxShadow="none"
                label={
                  <Card py={2} px={4}>
                    <Text size="label.sm">Solana</Text>
                  </Card>
                }
                borderRadius="lg"
                placement="top"
                shouldWrapChildren
              >
                <Icon as={Solana} boxSize={4} />
              </Tooltip>
            )}

            {cell.value.audit ? (
              <Tooltip
                p={0}
                bg="transparent"
                boxShadow="none"
                label={
                  <Card py={2} px={4}>
                    <Text size="label.sm">Audited Contract</Text>
                  </Card>
                }
                borderRadius="lg"
                placement="top"
              >
                <TrackedIconButton
                  size="sm"
                  as={LinkButton}
                  noIcon
                  isExternal
                  href={replaceIpfsUrl(cell.value.audit)}
                  category="deploy"
                  label="audited"
                  aria-label="Audited contract"
                  colorScheme="green"
                  variant="ghost"
                  icon={<Icon as={BsShieldFillCheck} boxSize={4} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    trackEvent({
                      category: "visit-audit",
                      action: "click",
                      label: cell.value.audit,
                    });
                  }}
                />
              </Tooltip>
            ) : null}
          </Flex>
        ),
      },
    ];

    return cols.filter(
      (col) => !hideReleasedBy || col.Header !== "Released By",
    );
    // this is to avoid re-rendering of the table when the contractIds array changes (it will always be a string array, so we can just join it and compare the string output)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.map((row) => row.name).join(), hideReleasedBy]);

  const tableInstance = useTable({
    columns: tableColumns,
    data: rows,
  });
  return (
    <Card p={0} overflowX="auto" position="relative">
      {isFetching && (
        <Spinner
          color="primary"
          size="xs"
          position="absolute"
          top={2}
          right={4}
        />
      )}
      <Table {...tableInstance.getTableProps()}>
        <Thead bg="blackAlpha.50" _dark={{ bg: "whiteAlpha.50" }}>
          {tableInstance.headerGroups.map((headerGroup) => (
            <Tr
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.getHeaderGroupProps().key}
            >
              {headerGroup.headers.map((column) => (
                <Th
                  {...column.getHeaderProps()}
                  key={column.getHeaderProps().key}
                  py={5}
                  borderBottomColor="borderColor"
                >
                  <Text as="label" size="label.md">
                    {column.render("Header")}
                  </Text>
                </Th>
              ))}
              {/* // Need to add an empty header for the icon button */}
              <Th borderBottomColor="borderColor" />
            </Tr>
          ))}
        </Thead>
        <Tbody {...tableInstance.getTableBodyProps()} position="relative">
          {tableInstance.rows.map((row) => {
            tableInstance.prepareRow(row);
            return <ContractTableRow row={row} key={row.getRowProps().key} />;
          })}
        </Tbody>
      </Table>
      {children}
    </Card>
  );
};

interface ContractTableRowProps {
  row: Row<ContractDataRow>;
}

const ContractTableRow: React.FC<ContractTableRowProps> = ({ row }) => {
  const router = useRouter();
  const modalState = useDisclosure();

  return (
    <>
      {row.original.ecosystem === "solana" && (
        <SolanaDeployDrawer
          contractDetails={row.original}
          disclosure={modalState}
        />
      )}
      <Tr
        borderBottomWidth={1}
        cursor="pointer"
        _last={{ borderBottomWidth: 0 }}
        _hover={{ bg: "blackAlpha.50", "--rowIconColor": "#a855f7" }}
        _dark={{
          _hover: {
            bg: "whiteAlpha.50",
          },
        }}
        onClick={() => {
          if (row.original.ecosystem === "evm") {
            router.push(
              `/${row.original.publisher}/${row.original.id}`,
              undefined,
              {
                scroll: true,
                shallow: true,
              },
            );
            return;
          }
          modalState.onOpen();
        }}
        {...row.getRowProps()}
      >
        {row.cells.map((cell) => (
          <Td
            {...cell.getCellProps()}
            key={cell.getCellProps().key}
            borderBottomWidth="inherit"
            borderBottomColor="borderColor"
            _last={{ textAlign: "end" }}
          >
            {cell.render("Cell")}
          </Td>
        ))}
        <Td borderBottomColor="borderColor" borderBottomWidth="inherit">
          <Icon color="var(--rowIconColor)" as={FiArrowRight} />
        </Td>
      </Tr>
    </>
  );
};
type UseDpeloySolanaParams<TContractType extends SolContractType> =
  TContractType extends "token"
    ? TokenMetadataInput
    : TContractType extends "nft-collection"
    ? NFTCollectionMetadataInput
    : TContractType extends "nft-drop"
    ? NFTDropContractInput
    : never;

function useDeploySolana<TContractType extends SolContractType>(
  contractType: TContractType,
) {
  const sdk = useSDK();
  return useMutation(async (data: UseDpeloySolanaParams<TContractType>) => {
    invariant(sdk, "SDK not initialized");

    if (contractType === "token") {
      return await sdk.deployer.createToken(data as TokenMetadataInput);
    } else if (contractType === "nft-collection") {
      return await sdk.deployer.createNftCollection(
        data as NFTCollectionMetadataInput,
      );
    } else if (contractType === "nft-drop") {
      return await sdk.deployer.createNftDrop(data as NFTDropContractInput);
    }
    throw new Error("invalid contract type");
  }, {});
}

interface SolanaDeployDrawerProps {
  contractDetails: ContractDataRow;
  disclosure: UseDisclosureReturn;
}

const SolanaDeployDrawer: React.FC<SolanaDeployDrawerProps> = (props) => {
  const [network, setNetwork] =
    useState<DashboardSolanaNetwork>("mainnet-beta");
  const wallet = useWallet();
  const queryClient = useQueryClient();

  const endpoint = useMemo(() => network && getSOLRPC(network), [network]);

  return (
    <ThirdwebSDKProvider
      wallet={wallet}
      queryClient={queryClient}
      network={endpoint}
    >
      <WrappedSolanaDeployDrawer
        {...props}
        network={network}
        setNetwork={setNetwork}
      />
    </ThirdwebSDKProvider>
  );
};

const WrappedSolanaDeployDrawer: React.FC<
  SolanaDeployDrawerProps & {
    network: DashboardSolanaNetwork;
    setNetwork: React.Dispatch<React.SetStateAction<"mainnet-beta" | "devnet">>;
  }
> = ({ contractDetails, disclosure, network, setNetwork }) => {
  const formId = useId();
  const deployMutation = useDeploySolana(
    contractDetails.contractType as SolContractType,
  );

  const trackEvent = useTrack();

  const router = useRouter();

  const { onSuccess, onError } = useTxNotifications(
    "Successfully deployed program",
    "Failed to deploy program",
  );

  return (
    <Drawer
      size="lg"
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      hideCloseButton
      header={{
        children: (
          <Flex gap={4} align="center">
            <ChakraNextImage
              boxSize={12}
              src={contractDetails.logo || ""}
              alt=""
            />
            <Flex direction="column">
              <Flex gap={2}>
                <Heading minW="60px" size="title.sm">
                  {contractDetails.name}
                </Heading>
              </Flex>
              <Text maxW="xs" fontStyle="italic" noOfLines={2}>
                {contractDetails.description}
              </Text>
            </Flex>
          </Flex>
        ),
      }}
      footer={{
        children: (
          <Flex direction="column" gap={4}>
            <Flex direction="column">
              <Heading size="subtitle.md">Network</Heading>
              <Text size="body.md" fontStyle="italic">
                Select a network to deploy this program on. We recommend
                starting with Devnet.{" "}
                <TrackedLink
                  href="https://blog.thirdweb.com/guides/which-network-should-you-use"
                  color="primary.600"
                  category="deploy"
                  label="learn-networks"
                  isExternal
                >
                  Learn more about the different networks.
                </TrackedLink>{" "}
              </Text>
              <Text fontWeight="600" mt={2}>
                ⚠️ To deploy on Devnet, you&apos;ll need to manually switch
                networks on the Developer Settings of your Phantom wallet.
              </Text>
            </Flex>
            <Flex w="100%" gap={4} direction={{ base: "column", md: "row" }}>
              <Select
                isDisabled={deployMutation.isLoading}
                onChange={(e) => {
                  setNetwork(e.target.value as DashboardSolanaNetwork);
                }}
              >
                <option value="mainnet-beta">Mainnet Beta</option>
                <option value="devnet">Devnet</option>
              </Select>
              <TransactionButton
                flexShrink={0}
                type="submit"
                form={formId}
                ecosystem="solana"
                isLoading={deployMutation.isLoading}
                colorScheme="primary"
                transactionCount={1}
              >
                Deploy Now
              </TransactionButton>
            </Flex>
          </Flex>
        ),
      }}
    >
      <BuiltinSolanaDeployForm
        formId={formId}
        contractType={contractDetails.contractType as SolContractType}
        onSubmitForm={(d) => {
          trackEvent({
            category: "program",
            action: "deploy",
            label: "attempt",
            programId: contractDetails.contractType,
            deployData: d,
          });
          deployMutation.mutate(d, {
            onSuccess: (contractAddress, variables) => {
              trackEvent({
                category: "program",
                action: "deploy",
                label: "success",
                programId: contractDetails.contractType,
                deployData: variables,
                contractAddress,
              });
              onSuccess();
              router.push(
                `/${
                  SupportedSolanaNetworkToUrlMap[
                    network as DashboardSolanaNetwork
                  ]
                }/${contractAddress}`,
                undefined,
                { shallow: true },
              );
            },
            onError: (error, variables) => {
              trackEvent({
                category: "program",
                action: "deploy",
                label: "error",
                programId: contractDetails.contractType,
                deployData: variables,
                error,
              });
              onError(error);
            },
          });
        }}
      />
    </Drawer>
  );
};
