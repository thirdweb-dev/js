import { UnorderedList } from "@/components/ui/List/List";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { cn } from "@/lib/utils";
import {
  IconButton,
  Link,
  Portal,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQueries } from "@tanstack/react-query";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  UploadIcon,
} from "lucide-react";
import Papa from "papaparse";
import { useCallback, useMemo, useRef, useState } from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";
import { type Column, usePagination, useTable } from "react-table";
import { type ThirdwebClient, ZERO_ADDRESS } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import { isAddress } from "thirdweb/utils";
import { Button, Heading, Text } from "tw-components";
import { csvMimeTypes } from "utils/batch";

export interface ERC20AirdropAddressInput {
  address: string;
  quantity: string;
  isValid?: boolean;
}
interface AirdropUploadProps {
  setAirdrop: (airdrop: ERC20AirdropAddressInput[]) => void;
  onClose: () => void;
}
async function checkIsAddress(
  item: ERC20AirdropAddressInput,
  thirdwebClient: ThirdwebClient,
) {
  const { address, ...rest } = item;
  // Sending tokens to the zero address will result in an error
  // if user wants to burn, they should use the Burn tab
  if (address === ZERO_ADDRESS) {
    return {
      address,
      resolvedAddress: address,
      isValid: false,
      ...rest,
    };
  }
  let isValid = true;
  let resolvedAddress = address;
  try {
    resolvedAddress = isAddress(address)
      ? address
      : await resolveAddress({ name: address, client: thirdwebClient });
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
}
function processAirdropData(
  data: (
    | (ERC20AirdropAddressInput & { resolvedAddress: string })
    | undefined
  )[],
) {
  const seen = new Set();
  const filteredData = data
    .filter((o) => o !== undefined)
    .filter((el) => {
      const duplicate = seen.has(el.resolvedAddress);
      seen.add(el.resolvedAddress);
      return !duplicate;
    });
  const valid = filteredData.filter(({ isValid }) => isValid);
  const invalid = filteredData.filter(({ isValid }) => !isValid);
  // Make sure the invalid records are at the top so that users can see
  const ordered = [...invalid, ...valid];
  return ordered;
}

export const AirdropUploadERC20: React.FC<AirdropUploadProps> = ({
  setAirdrop,
  onClose,
}) => {
  const thirdwebClient = useThirdwebClient();
  const [validAirdrop, setValidAirdrop] = useState<ERC20AirdropAddressInput[]>(
    [],
  );
  const [noCsv, setNoCsv] = useState(false);
  const reset = useCallback(() => {
    setValidAirdrop([]);
    setNoCsv(false);
  }, []);
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
          const data: ERC20AirdropAddressInput[] = (
            results.data as ERC20AirdropAddressInput[]
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
  const normalizeQuery = useQueries({
    queries: validAirdrop.map((o) => ({
      queryKey: ["snapshot-check-isAddress", o.address],
      queryFn: () => checkIsAddress(o, thirdwebClient),
    })),
    combine: (results) => {
      return {
        data: {
          result: processAirdropData(results.map((result) => result.data)),
          invalidFound: !!results.find((o) => !o.data?.isValid),
        },
        pending: results.some((result) => result.isPending),
      };
    },
  });
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });
  const paginationPortalRef = useRef<HTMLDivElement>(null);
  const onSave = () => {
    setAirdrop(normalizeQuery.data.result);
    onClose();
  };
  const removeInvalid = useCallback(() => {
    const filteredData = normalizeQuery.data?.result.filter(
      ({ isValid }) => isValid,
    );
    setValidAirdrop(filteredData);
  }, [normalizeQuery.data.result]);
  return (
    <div className="flex w-full flex-col gap-6">
      {normalizeQuery.pending && <div>Loading... </div>}
      {normalizeQuery.data?.result.length && validAirdrop.length > 0 ? (
        <>
          <AirdropTable
            portalRef={paginationPortalRef}
            data={normalizeQuery.data.result}
          />
          <div className="mt-4 flex flex-col justify-between md:mt-0">
            <div ref={paginationPortalRef} />
            <div className="mt-3 ml-auto flex w-full flex-row gap-2 md:w-auto">
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
              {normalizeQuery.data.invalidFound ? (
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
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="relative aspect-[21/9] w-full">
            <div
              className={cn(
                "flex h-full cursor-pointer items-center justify-center rounded-md border border-border hover:border-primary",
                noCsv ? "bg-red-200" : "bg-card",
              )}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col p-6">
                <UploadIcon
                  className={cn("mx-auto mb-2 size-4 text-gray-500", {
                    "text-red-500": noCsv,
                  })}
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
                      ? `No valid CSV file found, make sure your CSV includes the "address" & "quantity" column.`
                      : "Drag & Drop a CSV file here"}
                  </Heading>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Heading size="subtitle.sm">Requirements</Heading>
            <UnorderedList>
              <li>
                Files <em>must</em> contain one .csv file with an address and
                quantity column, if the quantity column is not provided, that
                record will be flagged as invalid.
                <Link download color="primary.500" href="/airdrop.csv">
                  Download an example CSV
                </Link>
              </li>
              <li>
                Repeated addresses will be removed and only the first found will
                be kept.
              </li>
            </UnorderedList>
          </div>
        </div>
      )}
    </div>
  );
};

interface AirdropTableProps {
  data: ERC20AirdropAddressInput[];
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
          }
          return (
            <ToolTipLabel
              label={
                address === ZERO_ADDRESS
                  ? "Cannot send tokens to ZERO_ADDRESS"
                  : address.startsWith("0x")
                    ? "Address is not valid"
                    : "Address couldn't be resolved"
              }
            >
              <div className="flex flex-row items-center gap-2">
                <CircleAlertIcon className="size-4 text-red-500" />
                <div className="cursor-default font-bold text-red-500">
                  {address}
                </div>
              </div>
            </ToolTipLabel>
          );
        },
      },
      {
        Header: "Quantity",
        accessor: ({ quantity }: { quantity: string }) => {
          return quantity || "1";
        },
      },
    ] as Column<ERC20AirdropAddressInput>[];
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
    // old package: this will be removed
    // eslint-disable-next-line react-compiler/react-compiler
    usePagination,
  );
  // Render the UI for your table
  return (<>
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup, headerGroupIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
          (<Tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
            {headerGroup.headers.map((column, columnIndex) => (
              <Th
                {...column.getHeaderProps()}
                border="none"
                // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                key={columnIndex}
              >
                <Text as="label" size="label.sm" color="faded">
                  {column.render("Header")}
                </Text>
              </Th>
            ))}
          </Tr>)
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {page.map((row, rowIndex) => {
          prepareRow(row);
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
            (<Tr {...row.getRowProps()} key={rowIndex}>
              {row.cells.map((cell, cellIndex) => (
                <Td
                  {...cell.getCellProps()}
                  borderColor="borderColor"
                  // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                  key={cellIndex}
                >
                  {cell.render("Cell")}
                </Td>
              ))}
            </Tr>)
          );
        })}
      </Tbody>
    </Table>
    {/* Only need to show the Pagination components if we have more than 25 records */}
    {data.length > 0 && (
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
    )}
  </>);
};
