import {
  AspectRatio,
  Box,
  Center,
  Code,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  ListItem,
  Portal,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { ClaimCondition } from "@thirdweb-dev/sdk/evm";
import { Logo } from "components/logo";
import { utils } from "ethers";
import Papa from "papaparse";
import { useCallback, useMemo, useRef, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { FiDownload } from "react-icons/fi";
import { IoAlertCircleOutline } from "react-icons/io5";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { Column, usePagination, useTable } from "react-table";
import { Button, Drawer, Heading, Text } from "tw-components";
import { csvMimeTypes } from "utils/batch";

export interface SnapshotAddressInput {
  address: string;
  maxClaimable?: string;
  price?: string;
  currencyAddress?: string;
}
interface SnapshotUploadProps {
  setSnapshot: (snapshot: SnapshotAddressInput[]) => void;
  isOpen: boolean;
  onClose: () => void;
  value?: ClaimCondition["snapshot"];
  dropType: "specific" | "any" | "overrides";
  isV1ClaimCondition: boolean;
}

export const SnapshotUpload: React.FC<SnapshotUploadProps> = ({
  setSnapshot,
  isOpen,
  onClose,
  value,
  dropType,
  isV1ClaimCondition,
}) => {
  const [validSnapshot, setValidSnapshot] = useState<SnapshotAddressInput[]>(
    value || [],
  );
  const [noCsv, setNoCsv] = useState(false);
  const [invalidFound, setInvalidFound] = useState(false);

  const reset = useCallback(() => {
    setValidSnapshot([]);
    setNoCsv(false);
  }, []);

  const _onClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const onDrop = useCallback<Required<DropzoneOptions>["onDrop"]>(
    (acceptedFiles) => {
      setNoCsv(false);

      const csv = acceptedFiles.find(
        (f) => csvMimeTypes.includes(f.type) || f.name.endsWith(".csv"),
      );
      if (!csv) {
        console.error(
          "No valid CSV file found, make sure you have an address column.",
        );
        setNoCsv(true);
        return;
      }

      Papa.parse(csv, {
        header: true,
        complete: (results) => {
          const data: SnapshotAddressInput[] = (
            results.data as SnapshotAddressInput[]
          )
            .map(({ address, maxClaimable, price, currencyAddress }) => ({
              address: (address || "").trim(),
              maxClaimable: (maxClaimable || "0").trim(),
              price: (price || "").trim() || "unlimited",
              currencyAddress: (currencyAddress || "").trim() || undefined,
            }))
            .filter(({ address }) => address !== "");

          // Filter out address duplicates
          const seen = new Set();
          const filteredData = data.filter((el) => {
            const duplicate = seen.has(el.address);
            seen.add(el.address);
            return !duplicate;
          });

          if (!data[0]?.address) {
            setNoCsv(true);
            return;
          }

          setValidSnapshot(filteredData);
        },
      });
    },
    [],
  );

  const data = useMemo(() => {
    const valid = validSnapshot.filter(({ address }) =>
      utils.isAddress(address),
    );
    const invalid = validSnapshot.filter(
      ({ address }) => !utils.isAddress(address),
    );
    if (invalid?.length > 0) {
      setInvalidFound(true);
    }
    const ordered = [...invalid, ...valid];
    return ordered;
  }, [validSnapshot]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const paginationPortalRef = useRef<HTMLDivElement>(null);

  const onSave = () => {
    setSnapshot(validSnapshot);
    onClose();
  };

  return (
    <Drawer
      allowPinchZoom
      preserveScrollBarGap
      size="xl"
      onClose={_onClose}
      isOpen={isOpen}
    >
      <Flex direction="column" gap={6} h="100%">
        <Flex shadow="sm">
          <Container maxW="container.page">
            <Flex align="center" justify="space-between" p={4}>
              <Flex gap={2}>
                <Logo hideWordmark />
                <Heading size="title.md">
                  {validSnapshot.length ? "Edit" : "Upload"} Snapshot
                </Heading>
              </Flex>
            </Flex>
          </Container>
        </Flex>

        {validSnapshot.length > 0 ? (
          <SnapshotTable
            portalRef={paginationPortalRef}
            data={data}
            isV1ClaimCondition={isV1ClaimCondition}
          />
        ) : (
          <Flex flexGrow={1} align="center" overflow="auto">
            <Container maxW="container.page">
              <Flex gap={8} flexDir="column">
                <AspectRatio ratio={21 / 9} w="100%">
                  <Center
                    borderRadius="md"
                    {...getRootProps()}
                    cursor="pointer"
                    bg={noCsv ? "red.200" : "inputBg"}
                    _hover={{
                      bg: "inputBgHover",
                      borderColor: "blue.500",
                    }}
                    borderColor="inputBorder"
                    borderWidth="1px"
                  >
                    <input {...getInputProps()} />
                    <VStack p={6}>
                      <Icon
                        as={BsFillCloudUploadFill}
                        boxSize={8}
                        mb={2}
                        color={noCsv ? "red.500" : "gray.600"}
                      />
                      {isDragActive ? (
                        <Heading as={Text} size="label.md">
                          Drop the files here
                        </Heading>
                      ) : (
                        <Heading
                          as={Text}
                          size="label.md"
                          color={noCsv ? "red.500" : "gray.600"}
                        >
                          {noCsv
                            ? `No valid CSV file found, make sure your CSV includes the "address" column.`
                            : "Drag & Drop a CSV file here"}
                        </Heading>
                      )}
                    </VStack>
                  </Center>
                </AspectRatio>
                <Flex gap={2} flexDir="column">
                  <Heading size="label.md">Requirements</Heading>
                  <UnorderedList spacing={1}>
                    {isV1ClaimCondition ? (
                      <>
                        <Text as={ListItem}>
                          Files <em>must</em> contain one .csv file with a list
                          of addresses.
                          <br />
                          <Link download color="blue.500" href="/snapshot.csv">
                            <Icon as={FiDownload} /> Example snapshot
                          </Link>
                        </Text>
                        <Text as={ListItem}>
                          You may optionally add a <Code>maxClaimable</Code>{" "}
                          column to specify how many NFTs can be claimed by that
                          specific address per transaction, if not specified,
                          the default value is the one you have set on your
                          claim phase.
                          <br />
                          <Link
                            download
                            color="blue.500"
                            href="/snapshot-with-maxclaimable.csv"
                          >
                            <Icon as={FiDownload} /> Example snapshot
                          </Link>
                        </Text>
                        <Text as={ListItem}>
                          Repeated addresses will be removed and only the first
                          found will be kept.
                        </Text>
                      </>
                    ) : dropType === "specific" ? (
                      <>
                        <Text as={ListItem}>
                          Files <em>must</em> contain one .csv file with a list
                          of addresses and their <Code>maxClaimable</Code>.{" "}
                          (amount each wallet is allowed to claim)
                          <br />
                          <Link
                            download
                            color="blue.500"
                            href="/snapshot-with-maxclaimable.csv"
                          >
                            <Icon boxSize="1em" as={FiDownload} /> Example
                            snapshot
                          </Link>
                        </Text>
                        <Text as={ListItem}>
                          You may optionally add <Code>price</Code> and{" "}
                          <Code>currencyAddress</Code> overrides as well. This
                          lets you override the currency and price you would
                          like to charge per wallet you specified
                          <br />
                          <Link
                            download
                            color="blue.500"
                            href="/snapshot-with-overrides.csv"
                          >
                            <Icon boxSize="1em" as={FiDownload} /> Example
                            snapshot
                          </Link>
                        </Text>
                        <Text as={ListItem}>
                          Repeated addresses will be removed and only the first
                          found will be kept.
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text as={ListItem}>
                          Files <em>must</em> contain one .csv file with a list
                          of addresses.
                          <br />
                          <Link download color="blue.500" href="/snapshot.csv">
                            <Icon boxSize="1em" as={FiDownload} /> Example
                            snapshot
                          </Link>
                        </Text>
                        <Text as={ListItem}>
                          You may optionally add a <Code>maxClaimable</Code>{" "}
                          column override. (amount each wallet is allowed to
                          claim) If not specified, the default value is the one
                          you have set on your claim phase.
                          <br />
                          <Link download color="blue.500" href="/snapshot.csv">
                            <Icon boxSize="1em" as={FiDownload} /> Example
                            snapshot
                          </Link>
                        </Text>
                        <Text as={ListItem}>
                          You may optionally add <Code>price</Code> and{" "}
                          <Code>currencyAddress</Code> overrides. This lets you
                          override the currency and price you would like to
                          charge per wallet you specified.{" "}
                          <strong>
                            When defining a custom currency address, you must
                            also define a price override.
                          </strong>
                          <br />
                          <Link
                            download
                            color="blue.500"
                            href="/snapshot-with-overrides.csv"
                          >
                            <Icon boxSize="1em" as={FiDownload} /> Example
                            snapshot
                          </Link>
                        </Text>
                        <Text as={ListItem}>
                          Repeated addresses will be removed and only the first
                          found will be kept.
                        </Text>
                      </>
                    )}
                  </UnorderedList>
                </Flex>
              </Flex>
            </Container>
          </Flex>
        )}

        <Flex borderTop="1px solid" borderTopColor="borderColor">
          <Container maxW="container.page">
            <Flex
              align="center"
              justify="space-between"
              p={{ base: 0, md: 4 }}
              flexDir={{ base: "column", md: "row" }}
              mt={{ base: 4, md: 0 }}
            >
              <Box ref={paginationPortalRef} />
              <Flex
                gap={2}
                align="center"
                mt={{ base: 4, md: 0 }}
                w={{ base: "100%", md: "auto" }}
              >
                <Button
                  borderRadius="md"
                  disabled={validSnapshot.length === 0}
                  onClick={() => {
                    reset();
                  }}
                  w={{ base: "100%", md: "auto" }}
                >
                  Reset
                </Button>
                <Button
                  borderRadius="md"
                  colorScheme="primary"
                  onClick={onSave}
                  w={{ base: "100%", md: "auto" }}
                  disabled={invalidFound || validSnapshot.length === 0}
                >
                  Next
                </Button>
              </Flex>
            </Flex>
          </Container>
        </Flex>
      </Flex>
    </Drawer>
  );
};

interface SnapshotTableProps {
  data: SnapshotAddressInput[];
  portalRef: React.RefObject<HTMLDivElement>;
  isV1ClaimCondition: boolean;
}

const SnapshotTable: React.FC<SnapshotTableProps> = ({
  data,
  portalRef,
  isV1ClaimCondition,
}) => {
  const columns = useMemo(() => {
    let cols = [
      {
        Header: "Address",
        accessor: ({ address }) => {
          if (utils.isAddress(address)) {
            return address;
          } else {
            return (
              <Flex>
                <Tooltip label="Address is not valid">
                  <Stack direction="row" align="center">
                    <Icon
                      as={IoAlertCircleOutline}
                      color="red.500"
                      boxSize={5}
                    />
                    <Text fontWeight="bold" color="red.500" cursor="default">
                      {address}
                    </Text>
                  </Stack>
                </Tooltip>
              </Flex>
            );
          }
        },
      },
      {
        Header: "Max claimable",
        accessor: ({ maxClaimable }) => {
          return maxClaimable === "0" || !maxClaimable
            ? "Default"
            : maxClaimable;
        },
      },
    ] as Column<SnapshotAddressInput>[];

    if (!isV1ClaimCondition) {
      cols = cols.concat([
        {
          Header: "Price",
          accessor: ({ price }) => {
            return price === "0"
              ? "Free"
              : !price || price === "unlimited"
              ? "Default"
              : price;
          },
        },
        {
          Header: "Currency Address",
          accessor: ({ currencyAddress }) => {
            return currencyAddress ===
              "0x0000000000000000000000000000000000000000" || !currencyAddress
              ? "Default"
              : currencyAddress;
          },
        },
      ]);
    }

    return cols;
  }, [isV1ClaimCondition]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // Instead of using 'rows', we'll use page,
    page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 50,
        pageIndex: 0,
      },
    },
    usePagination,
  );

  // Render the UI for your table
  return (
    <Flex flexGrow={1} overflow="auto">
      <Box w="100%">
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              // eslint-disable-next-line react/jsx-key
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // eslint-disable-next-line react/jsx-key
                  <Th {...column.getHeaderProps()}>
                    <Text as="label" size="label.md">
                      {column.render("Header")}
                    </Text>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                // eslint-disable-next-line react/jsx-key
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>

      <Portal containerRef={portalRef}>
        <Center w="100%">
          <HStack>
            <IconButton
              isDisabled={!canPreviousPage}
              aria-label="first page"
              icon={<Icon as={MdFirstPage} />}
              onClick={() => gotoPage(0)}
            />
            <IconButton
              isDisabled={!canPreviousPage}
              aria-label="previous page"
              icon={<Icon as={MdNavigateBefore} />}
              onClick={() => previousPage()}
            />
            <Text whiteSpace="nowrap">
              Page <strong>{pageIndex + 1}</strong> of{" "}
              <strong>{pageOptions.length}</strong>
            </Text>
            <IconButton
              isDisabled={!canNextPage}
              aria-label="next page"
              icon={<Icon as={MdNavigateNext} />}
              onClick={() => nextPage()}
            />
            <IconButton
              isDisabled={!canNextPage}
              aria-label="last page"
              icon={<Icon as={MdLastPage} />}
              onClick={() => gotoPage(pageCount - 1)}
            />

            <Select
              onChange={(e) => {
                setPageSize(parseInt(e.target.value as string, 10));
              }}
              value={pageSize}
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="250">250</option>
              <option value="500">500</option>
            </Select>
          </HStack>
        </Center>
      </Portal>
    </Flex>
  );
};
