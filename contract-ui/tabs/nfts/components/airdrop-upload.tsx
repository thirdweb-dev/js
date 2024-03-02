import {
  AspectRatio,
  Box,
  Center,
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
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { resolveAddress } from "@thirdweb-dev/sdk";
import { Logo } from "components/logo";
import { utils } from "ethers";
import Papa from "papaparse";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { BsFillCloudUploadFill } from "react-icons/bs";
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

export interface AirdropAddressInput {
  address: string;
  quantity?: string;
  isValid?: boolean;
}
interface AirdropUploadProps {
  setAirdrop: (airdrop: AirdropAddressInput[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AirdropUpload: React.FC<AirdropUploadProps> = ({
  setAirdrop,
  isOpen,
  onClose,
}) => {
  const [validAirdrop, setValidAirdrop] = useState<AirdropAddressInput[]>([]);
  const [airdropData, setAirdropData] = useState<AirdropAddressInput[]>([]);
  const [noCsv, setNoCsv] = useState(false);
  const [invalidFound, setInvalidFound] = useState(false);

  const reset = useCallback(() => {
    setValidAirdrop([]);
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
          const data: AirdropAddressInput[] = (
            results.data as AirdropAddressInput[]
          )
            .map(({ address, quantity }) => ({
              address: (address || "").trim(),
              quantity: (quantity || "1").trim(),
            }))
            .filter(({ address }) => address !== "");

          if (!data[0]?.address) {
            setNoCsv(true);
            return;
          }

          setValidAirdrop(data);
        },
      });
    },
    [],
  );

  useEffect(() => {
    if (validAirdrop.length === 0) {
      return setAirdropData([]);
    }

    const normalizeAddresses = async (snapshot: AirdropAddressInput[]) => {
      const normalized = await Promise.all(
        snapshot.map(async ({ address, ...rest }) => {
          let isValid = true;
          let resolvedAddress = address;

          try {
            resolvedAddress = utils.isAddress(address)
              ? address
              : await resolveAddress(address);
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
      setAirdropData(ordered);
    };
    normalizeAddresses(validAirdrop);
  }, [validAirdrop]);

  const removeInvalid = useCallback(() => {
    const filteredData = airdropData.filter(({ isValid }) => isValid);
    setValidAirdrop(filteredData);
    setInvalidFound(false);
  }, [airdropData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const paginationPortalRef = useRef<HTMLDivElement>(null);

  const onSave = () => {
    setAirdrop(airdropData);
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
                  {validAirdrop.length ? "Edit" : "Upload"} Airdrop
                </Heading>
              </Flex>
            </Flex>
          </Container>
        </Flex>

        {validAirdrop.length > 0 ? (
          <AirdropTable portalRef={paginationPortalRef} data={airdropData} />
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
                      borderColor: "primary.500",
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
                  <Heading size="subtitle.sm">Requirements</Heading>
                  <UnorderedList>
                    <ListItem>
                      Files <em>must</em> contain one .csv file with an address
                      and quantity column, if the quantity column is not
                      provided, it will default to 1 NFT per wallet. -{" "}
                      <Link download color="primary.500" href="/airdrop.csv">
                        Download an example CSV
                      </Link>
                    </ListItem>
                    <ListItem>
                      Repeated addresses will be removed and only the first
                      found will be kept.
                    </ListItem>
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
                  disabled={validAirdrop.length === 0}
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
                    disabled={validAirdrop.length === 0}
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
                    isDisabled={validAirdrop.length === 0}
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

interface AirdropTableProps {
  data: AirdropAddressInput[];
  portalRef: React.RefObject<HTMLDivElement>;
}

const AirdropTable: React.FC<AirdropTableProps> = ({ data, portalRef }) => {
  const columns = useMemo(() => {
    return [
      {
        Header: "Address",
        accessor: ({ address, isValid }) => {
          if (isValid) {
            return address;
          } else {
            return (
              <Flex>
                <Tooltip
                  label={
                    address.startsWith("0x")
                      ? "Address is not valid"
                      : "Address couldn't be resolved"
                  }
                >
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
        Header: "Quantity",
        accessor: ({ quantity }: { quantity: string }) => {
          return quantity || "1";
        },
      },
    ] as Column<AirdropAddressInput>[];
  }, []);

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
    <Flex flexGrow={1}>
      <TableContainer>
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup, headerGroupIndex) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <Th {...column.getHeaderProps()} border="none" key={columnIndex}>
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
                <Tr {...row.getRowProps()} key={rowIndex}>
                  {row.cells.map((cell, cellIndex) => (
                    <Td {...cell.getCellProps()} borderColor="borderColor" key={cellIndex}>
                      {cell.render("Cell")}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

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
