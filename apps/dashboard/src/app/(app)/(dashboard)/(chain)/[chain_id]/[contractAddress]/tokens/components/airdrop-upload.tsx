import { Link } from "@chakra-ui/react";
import { useCsvUpload } from "hooks/useCsvUpload";
import { CircleAlertIcon, UploadIcon } from "lucide-react";
import { useMemo, useRef } from "react";
import { useDropzone } from "react-dropzone";
import type { Column } from "react-table";
import { type ThirdwebClient, ZERO_ADDRESS } from "thirdweb";
import { Button, Heading, Text } from "tw-components";
import { UnorderedList } from "@/components/ui/List/List";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CsvDataTable } from "../../_components/csv-data-table";

export interface AirdropAddressInput {
  address: string;
  quantity: string;
  isValid?: boolean;
}
interface AirdropUploadProps {
  setAirdrop: (airdrop: AirdropAddressInput[]) => void;
  onClose: () => void;
  client: ThirdwebClient;
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
  client,
}) => {
  const csvUpload = useCsvUpload<AirdropAddressInput>({ client, csvParser });
  const dropzone = useDropzone({
    onDrop: csvUpload.setFiles,
  });

  const paginationPortalRef = useRef<HTMLDivElement>(null);

  const normalizeData = csvUpload.normalizeQuery.data;

  const columns = useMemo(() => {
    return [
      {
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
        Header: "Address",
      },
      {
        accessor: ({ quantity }: { quantity: string }) => {
          return quantity || "1";
        },
        Header: "Quantity",
      },
    ] as Column<AirdropAddressInput>[];
  }, []);

  if (!normalizeData) {
    return (
      <div className="flex min-h-[400px] w-full grow items-center justify-center rounded-lg border border-border">
        <Spinner className="size-10" />
      </div>
    );
  }

  const onSave = () => {
    setAirdrop(
      normalizeData.result.map((o) => ({
        address: o.resolvedAddress,
        quantity: o.quantity,
      })),
    );
    onClose();
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {normalizeData.result.length && csvUpload.rawData.length > 0 ? (
        <>
          <CsvDataTable<AirdropAddressInput>
            columns={columns}
            data={csvUpload.normalizeQuery.data.result}
            portalRef={paginationPortalRef}
          />
          <div className="mt-4 flex flex-col justify-between md:mt-0">
            <div ref={paginationPortalRef} />
            <div className="mt-3 ml-auto flex w-full flex-row gap-2 md:w-auto">
              <Button
                borderRadius="md"
                disabled={csvUpload.rawData.length === 0}
                onClick={() => {
                  csvUpload.reset();
                }}
                w={{ base: "100%", md: "auto" }}
              >
                Reset
              </Button>
              {csvUpload.normalizeQuery.data.invalidFound ? (
                <Button
                  borderRadius="md"
                  colorScheme="primary"
                  disabled={csvUpload.rawData.length === 0}
                  onClick={() => {
                    csvUpload.removeInvalid();
                  }}
                  w={{ base: "100%", md: "auto" }}
                >
                  Remove invalid
                </Button>
              ) : (
                <Button
                  borderRadius="md"
                  colorScheme="primary"
                  isDisabled={csvUpload.rawData.length === 0}
                  onClick={onSave}
                  w={{ base: "100%", md: "auto" }}
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
                csvUpload.noCsv ? "bg-red-200" : "bg-background",
              )}
              {...dropzone.getRootProps()}
            >
              <input {...dropzone.getInputProps()} />
              <div className="flex flex-col p-6">
                <UploadIcon
                  className={cn("mx-auto mb-2 size-4 text-gray-500", {
                    "text-red-500": csvUpload.noCsv,
                  })}
                />
                {dropzone.isDragActive ? (
                  <Heading as={Text} size="label.md">
                    Drop the files here
                  </Heading>
                ) : (
                  <Heading
                    as={Text}
                    color={csvUpload.noCsv ? "red.500" : "gray.600"}
                    size="label.md"
                  >
                    {csvUpload.noCsv
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
                <Link
                  color="primary.500"
                  download
                  href="/assets/examples/airdrop.csv"
                >
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
