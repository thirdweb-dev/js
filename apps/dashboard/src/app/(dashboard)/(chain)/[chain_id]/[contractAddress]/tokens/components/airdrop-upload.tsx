import { UnorderedList } from "@/components/ui/List/List";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Link } from "@chakra-ui/react";
import { useCsvUpload } from "hooks/useCsvUpload";
import { CircleAlertIcon, UploadIcon } from "lucide-react";
import { useMemo, useRef } from "react";
import type { Column } from "react-table";
import { ZERO_ADDRESS } from "thirdweb";
import { Button, Heading, Text } from "tw-components";
import { CsvDataTable } from "../../_components/csv-data-table";

export interface AirdropAddressInput {
  address: string;
  quantity: string;
  isValid?: boolean;
}
interface AirdropUploadProps {
  setAirdrop: (airdrop: AirdropAddressInput[]) => void;
  onClose: () => void;
}

const csvParser = (items: AirdropAddressInput[]): AirdropAddressInput[] => {
  return items
    .map(({ address, quantity }) => ({
      address: (address || "").trim(),
      quantity: (quantity || "1").trim(),
    }))
    .filter(({ address }) => address !== "");
};

export const AirdropUpload: React.FC<AirdropUploadProps> = ({
  setAirdrop,
  onClose,
}) => {
  const {
    normalizeQuery,
    getInputProps,
    getRootProps,
    isDragActive,
    rawData,
    noCsv,
    reset,
    removeInvalid,
  } = useCsvUpload<AirdropAddressInput>({ csvParser });
  const paginationPortalRef = useRef<HTMLDivElement>(null);
  const onSave = () => {
    setAirdrop(
      normalizeQuery.data.result.map((o) => ({
        address: o.resolvedAddress,
        quantity: o.quantity,
      })),
    );
    onClose();
  };

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
    ] as Column<AirdropAddressInput>[];
  }, []);

  return (
    <div className="flex w-full flex-col gap-6">
      {normalizeQuery.pending && <div>Loading... </div>}
      {normalizeQuery.data?.result.length && rawData.length > 0 ? (
        <>
          <CsvDataTable<AirdropAddressInput>
            portalRef={paginationPortalRef}
            data={normalizeQuery.data.result}
            columns={columns}
          />
          <div className="mt-4 flex flex-col justify-between md:mt-0">
            <div ref={paginationPortalRef} />
            <div className="mt-3 ml-auto flex w-full flex-row gap-2 md:w-auto">
              <Button
                borderRadius="md"
                disabled={rawData.length === 0}
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
                  disabled={rawData.length === 0}
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
                  isDisabled={rawData.length === 0}
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
