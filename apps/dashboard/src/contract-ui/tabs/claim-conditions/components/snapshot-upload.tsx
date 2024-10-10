import { InlineCode } from "@/components/ui/inline-code";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { cn } from "@/lib/utils";
import {
  Box,
  Container,
  Flex,
  IconButton,
  Link,
  ListItem,
  Portal,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  UnorderedList,
} from "@chakra-ui/react";
import { Logo } from "components/logo";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  DownloadIcon,
  UploadIcon,
} from "lucide-react";
import Papa from "papaparse";
import { useCallback, useEffect, useRef, useState } from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";
import { type Column, usePagination, useTable } from "react-table";
import { isAddress } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import { Button, Drawer, Heading, Text } from "tw-components";
import { csvMimeTypes } from "utils/batch";

interface SnapshotAddressInput {
  address: string;
  maxClaimable?: string;
  price?: string;
  currencyAddress?: string;
  isValid?: boolean;
}
interface SnapshotUploadProps {
  setSnapshot: (snapshot: SnapshotAddressInput[]) => void;
  isOpen: boolean;
  onClose: () => void;
  value?:
    | {
        address: string;
        maxClaimable: string;
        price?: string | undefined;
        currencyAddress?: string | undefined;
      }[]
    | null;
  dropType: "specific" | "any" | "overrides";
  isDisabled: boolean;
}

export const SnapshotUpload: React.FC<SnapshotUploadProps> = ({
  setSnapshot,
  isOpen,
  onClose,
  value,
  dropType,
  isDisabled,
}) => {
  const client = useThirdwebClient();
  const [validSnapshot, setValidSnapshot] = useState<SnapshotAddressInput[]>(
    value || [],
  );
  const [snapshotData, setSnapshotData] = useState<SnapshotAddressInput[]>([]);
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
        (f) => csvMimeTypes.includes(f.type) || f.name?.endsWith(".csv"),
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
              maxClaimable: (maxClaimable || "0").trim().toLowerCase(),
              price: (price || "").trim() || undefined,
              currencyAddress: (currencyAddress || "").trim() || undefined,
            }))
            .filter(({ address }) => address !== "");

          if (!data[0]?.address) {
            setNoCsv(true);
            return;
          }

          setValidSnapshot(data);
        },
      });
    },
    [],
  );

  // FIXME: this can be a mutation or query instead!
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (validSnapshot.length === 0) {
      return setSnapshotData([]);
    }

    const normalizeAddresses = async (snapshot: SnapshotAddressInput[]) => {
      const normalized = await Promise.all(
        snapshot.map(async ({ address, ...rest }) => {
          let isValid = true;
          let resolvedAddress = address;

          try {
            resolvedAddress = isAddress(address)
              ? address
              : await resolveAddress({ client, name: address });
            isValid = !!resolvedAddress;
          } catch {
            isValid = false;
          }

          return {
            address,
            resolvedAddress,
            isValid,
            ...rest,
          };
        }),
      );

      const seen = new Set();
      const filteredData = normalized.filter((el) => {
        const duplicate = seen.has(el.resolvedAddress);
        seen.add(el.resolvedAddress);
        return !duplicate;
      });

      const valid = filteredData.filter(({ isValid }) => isValid);
      const invalid = filteredData.filter(({ isValid }) => !isValid);

      if (invalid?.length > 0) {
        setInvalidFound(true);
      }
      const ordered = [...invalid, ...valid];
      setSnapshotData(ordered);
    };
    normalizeAddresses(validSnapshot);
  }, [validSnapshot, client]);

  const removeInvalid = useCallback(() => {
    const filteredData = snapshotData.filter(({ isValid }) => isValid);
    setValidSnapshot(filteredData);
    setInvalidFound(false);
  }, [snapshotData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const paginationPortalRef = useRef<HTMLDivElement>(null);

  const onSave = () => {
    setSnapshot(snapshotData);
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
              <div className="flex flex-row gap-2">
                <Logo hideWordmark />
                <Heading size="title.md">
                  {validSnapshot.length ? "Edit" : "Upload"} Snapshot
                </Heading>
              </div>
            </Flex>
          </Container>
        </Flex>

        {validSnapshot.length > 0 ? (
          <SnapshotTable portalRef={paginationPortalRef} data={snapshotData} />
        ) : (
          <Flex flexGrow={1} align="center" overflow="auto">
            <Container maxW="container.page">
              <Flex gap={8} flexDir="column">
                <div className="relative aspect-[21/9] w-full">
                  <div
                    className={cn(
                      "flex h-full cursor-pointer rounded-md border border-border hover:border-primary",
                      noCsv ? "bg-red-200" : "bg-card",
                    )}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <div className="!m-auto flex flex-col">
                      <UploadIcon
                        className={cn(
                          "mx-auto mb-2 size-8",
                          noCsv ? "text-red-500" : "text-gray-600",
                        )}
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
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Heading size="label.md">Requirements</Heading>
                  <UnorderedList spacing={1}>
                    {dropType === "specific" ? (
                      <>
                        <Text as={ListItem}>
                          Files <em>must</em> contain one .csv file with a list
                          of addresses and their{" "}
                          <InlineCode code="maxClaimable" />. (amount each
                          wallet is allowed to claim)
                          <br />
                          <Link
                            download
                            color="blue.500"
                            href="/snapshot-with-maxclaimable.csv"
                          >
                            <DownloadIcon className="inline size-3" /> Example
                            snapshot
                          </Link>
                        </Text>
                        <Text as={ListItem}>
                          You may optionally add <InlineCode code="price" /> and
                          <InlineCode code="currencyAddress" /> overrides as
                          well. This lets you override the currency and price
                          you would like to charge per wallet you specified
                          <br />
                          <Link
                            download
                            color="blue.500"
                            href="/snapshot-with-overrides.csv"
                          >
                            <DownloadIcon className="inline size-3" /> Example
                            snapshot
                          </Link>
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text as={ListItem}>
                          Files <em>must</em> contain one .csv file with a list
                          of addresses.
                          <br />
                          <Link download color="blue.500" href="/snapshot.csv">
                            <DownloadIcon className="inline size-3" /> Example
                            snapshot
                          </Link>
                        </Text>
                        <Text as={ListItem}>
                          You may optionally add a{" "}
                          <InlineCode code="maxClaimable" />
                          column override. (amount each wallet is allowed to
                          claim) If not specified, the default value is the one
                          you have set on your claim phase.
                          <br />
                          <Link
                            download
                            color="blue.500"
                            href="/snapshot-with-maxclaimable.csv"
                          >
                            <DownloadIcon className="inline size-3" /> Example
                            snapshot
                          </Link>
                        </Text>
                        <Text as={ListItem}>
                          You may optionally add <InlineCode code="price" /> and
                          <InlineCode code="currencyAddress" /> overrides. This
                          lets you override the currency and price you would
                          like to charge per wallet you specified.{" "}
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
                            <DownloadIcon className="inline size-3" /> Example
                            snapshot
                          </Link>
                        </Text>
                      </>
                    )}
                    <Text as={ListItem}>
                      Repeated addresses will be removed and only the first
                      found will be kept.
                    </Text>
                    <Text as={ListItem}>
                      The limit you set is for the maximum amount of NFTs a
                      wallet can claim, not how many they can receive in total.
                    </Text>
                  </UnorderedList>
                </div>
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
                  disabled={isDisabled || validSnapshot.length === 0}
                  onClick={() => {
                    reset();
                  }}
                  w={{ base: "100%", md: "auto" }}
                >
                  Reset
                </Button>
                {invalidFound ? (
                  <Button
                    borderRadius="md"
                    colorScheme="primary"
                    disabled={isDisabled || validSnapshot.length === 0}
                    onClick={() => {
                      removeInvalid();
                    }}
                    w={{ base: "100%", md: "auto" }}
                  >
                    Remove invalid
                  </Button>
                ) : (
                  <Button
                    borderRadius="md"
                    colorScheme="primary"
                    onClick={onSave}
                    w={{ base: "100%", md: "auto" }}
                    isDisabled={isDisabled || validSnapshot.length === 0}
                  >
                    Next
                  </Button>
                )}
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
}

const SnapshotTableColumns = [
  {
    Header: "Address",
    accessor: ({ address, isValid }) => {
      if (isValid) {
        return address;
      }
      return (
        <div className="flex flex-row items-center gap-2">
          <Tooltip
            label={
              address.startsWith("0x")
                ? "Address is not valid"
                : "Address couldn't be resolved"
            }
          >
            <div className="flex flex-row items-center gap-2">
              <CircleAlertIcon className="size-4 text-red-500" />
              <Text fontWeight="bold" color="red.500" cursor="default">
                {address}
              </Text>
            </div>
          </Tooltip>
        </div>
      );
    },
  },
  {
    Header: "Max claimable",
    accessor: ({ maxClaimable }) => {
      return maxClaimable === "0" || !maxClaimable
        ? "Default"
        : maxClaimable === "unlimited"
          ? "Unlimited"
          : maxClaimable;
    },
  },
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
      return currencyAddress === "0x0000000000000000000000000000000000000000" ||
        !currencyAddress
        ? "Default"
        : currencyAddress;
    },
  },
] as Column<SnapshotAddressInput>[];

const SnapshotTable: React.FC<SnapshotTableProps> = ({ data, portalRef }) => {
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
      columns: SnapshotTableColumns,
      data,
      initialState: {
        pageSize: 50,
        pageIndex: 0,
      },
    },
    // old package, this will be removed
    // eslint-disable-next-line react-compiler/react-compiler
    usePagination,
  );

  // Render the UI for your table
  return (
    <Flex flexGrow={1}>
      <TableContainer>
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup, headerGroupIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
              <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                {headerGroup.headers.map((column, columnIndex) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                  <Th {...column.getHeaderProps()} key={columnIndex}>
                    <Text as="label" size="label.sm" color="faded">
                      {column.render("Header")}
                    </Text>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                <Tr {...row.getRowProps()} key={rowIndex}>
                  {row.cells.map((cell, cellIndex) => {
                    return (
                      <Td
                        {...cell.getCellProps()}
                        borderColor="borderColor"
                        // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                        key={cellIndex}
                      >
                        {cell.render("Cell")}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Portal containerRef={portalRef}>
        <div className="flex w-full items-center justify-center">
          <div className="flex flex-row gap-1">
            <IconButton
              isDisabled={!canPreviousPage}
              aria-label="first page"
              icon={<ChevronFirstIcon className="size-4" />}
              onClick={() => gotoPage(0)}
            />
            <IconButton
              isDisabled={!canPreviousPage}
              aria-label="previous page"
              icon={<ChevronLeftIcon className="size-4" />}
              onClick={() => previousPage()}
            />
            <p className="my-auto whitespace-nowrap">
              Page <strong>{pageIndex + 1}</strong> of{" "}
              <strong>{pageOptions.length}</strong>
            </p>
            <IconButton
              isDisabled={!canNextPage}
              aria-label="next page"
              icon={<ChevronRightIcon className="size-4" />}
              onClick={() => nextPage()}
            />
            <IconButton
              isDisabled={!canNextPage}
              aria-label="last page"
              icon={<ChevronLastIcon className="size-4" />}
              onClick={() => gotoPage(pageCount - 1)}
            />

            <Select
              onChange={(e) => {
                setPageSize(Number.parseInt(e.target.value as string, 10));
              }}
              value={pageSize}
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="250">250</option>
              <option value="500">500</option>
            </Select>
          </div>
        </div>
      </Portal>
    </Flex>
  );
};
