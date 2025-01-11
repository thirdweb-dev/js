import { UnorderedList } from "@/components/ui/List/List";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { InlineCode } from "@/components/ui/inline-code";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useCsvUpload } from "hooks/useCsvUpload";
import { CircleAlertIcon, DownloadIcon, UploadIcon } from "lucide-react";
import { useRef } from "react";
import type { Column } from "react-table";
import { ZERO_ADDRESS } from "thirdweb";
import { CsvDataTable } from "../csv-data-table";

interface SnapshotAddressInput {
  address: string;
  maxClaimable?: string;
  price?: string;
  currencyAddress?: string;
  isValid?: boolean;
}
interface SnapshotUploadProps {
  setSnapshot: (snapshot: SnapshotAddressInput[]) => void;
  dropType: "specific" | "any" | "overrides";
  isDisabled: boolean;
  value?: SnapshotAddressInput[] | undefined;
  onClose: () => void;
}

const csvParser = (items: SnapshotAddressInput[]): SnapshotAddressInput[] => {
  return items
    .map(({ address, maxClaimable, price, currencyAddress }) => ({
      address: (address || "").trim(),
      maxClaimable: (maxClaimable || "0").trim().toLowerCase(),
      price: (price || "").trim() || undefined,
      currencyAddress: (currencyAddress || "").trim() || undefined,
    }))
    .filter(({ address }) => address !== "");
};

const SnapshotViewerSheetContent: React.FC<SnapshotUploadProps> = ({
  setSnapshot,
  dropType,
  isDisabled,
  value,
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
  } = useCsvUpload<SnapshotAddressInput>({ csvParser, defaultRawData: value });

  const paginationPortalRef = useRef<HTMLDivElement>(null);
  const normalizeData = normalizeQuery.data;

  if (!normalizeData) {
    return (
      <div className="flex min-h-[400px] w-full grow items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  const onSave = () => {
    // Make sure we are not passing ENS values to the claim-condition extension
    // we should use the `resolvedAddress` value instead
    setSnapshot(
      normalizeData.result.map((o) => ({
        address: o.resolvedAddress,
        maxClaimable: o.maxClaimable,
        price: o.price,
        currencyAddress: o.currencyAddress,
      })),
    );
    onClose();
  };

  const columns = [
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
        return currencyAddress ===
          "0x0000000000000000000000000000000000000000" || !currencyAddress
          ? "Default"
          : currencyAddress;
      },
    },
  ] as Column<SnapshotAddressInput>[];

  return (
    <div className="flex flex-col gap-6">
      {rawData.length > 0 ? (
        <div>
          <CsvDataTable<SnapshotAddressInput>
            portalRef={paginationPortalRef}
            data={normalizeQuery.data.result}
            columns={columns}
          />
        </div>
      ) : (
        <div className="flex grow flex-col items-center gap-8 overflow-auto">
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
                  <p>Drop the files here</p>
                ) : (
                  <p className={noCsv ? "text-red-500" : "text-gray-600"}>
                    {noCsv
                      ? `No valid CSV file found, make sure your CSV includes the "address" column.`
                      : "Drag & Drop a CSV file here"}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-lg">Requirements</p>
            <UnorderedList>
              {dropType === "specific" ? (
                <>
                  <li>
                    Files <em>must</em> contain one .csv file with a list of
                    addresses and their <InlineCode code="maxClaimable" />.
                    (amount each wallet is allowed to claim)
                    <br />
                    <a
                      className="text-link-foreground hover:text-foreground"
                      download
                      href="/snapshot-with-maxclaimable.csv"
                    >
                      <DownloadIcon className="inline size-3" /> Example
                      snapshot
                    </a>
                  </li>
                  <li>
                    You may optionally add <InlineCode code="price" /> and
                    <InlineCode code="currencyAddress" /> overrides as well.
                    This lets you override the currency and price you would like
                    to charge per wallet you specified
                    <br />
                    <a
                      download
                      className="text-link-foreground hover:text-foreground"
                      href="/snapshot-with-overrides.csv"
                    >
                      <DownloadIcon className="inline size-3" /> Example
                      snapshot
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    Files <em>must</em> contain one .csv file with a list of
                    addresses.
                    <br />
                    <a
                      download
                      className="text-link-foreground hover:text-foreground"
                      href="/snapshot.csv"
                    >
                      <DownloadIcon className="inline size-3" /> Example
                      snapshot
                    </a>
                  </li>
                  <li>
                    You may optionally add a <InlineCode code="maxClaimable" />
                    column override. (amount each wallet is allowed to claim) If
                    not specified, the default value is the one you have set on
                    your claim phase.
                    <br />
                    <a
                      download
                      className="text-link-foreground hover:text-foreground"
                      href="/snapshot-with-maxclaimable.csv"
                    >
                      <DownloadIcon className="inline size-3" /> Example
                      snapshot
                    </a>
                  </li>
                  <li>
                    You may optionally add <InlineCode code="price" /> and
                    <InlineCode code="currencyAddress" /> overrides. This lets
                    you override the currency and price you would like to charge
                    per wallet you specified.{" "}
                    <strong>
                      When defining a custom currency address, you must also
                      define a price override.
                    </strong>
                    <br />
                    <a
                      download
                      className="text-link-foreground hover:text-foreground"
                      href="/snapshot-with-overrides.csv"
                    >
                      <DownloadIcon className="inline size-3" /> Example
                      snapshot
                    </a>
                  </li>
                </>
              )}
              <li>
                Repeated addresses will be removed and only the first found will
                be kept.
              </li>
              <li>
                The limit you set is for the maximum amount of NFTs a wallet can
                claim, not how many they can receive in total.
              </li>
            </UnorderedList>
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-col items-center justify-between border-t p-0 md:mt-0 md:flex-row md:p-4">
        <div ref={paginationPortalRef} />
        {!isDisabled && (
          <div className="mt-4 flex w-full flex-row items-center gap-2 md:mt-0 md:w-auto">
            <Button
              className="w-full rounded-md md:w-auto"
              disabled={isDisabled || rawData.length === 0}
              onClick={() => {
                reset();
              }}
            >
              Reset
            </Button>
            {normalizeQuery.data?.invalidFound ? (
              <Button
                className="w-full rounded-md md:w-auto"
                variant="primary"
                disabled={isDisabled || rawData.length === 0}
                onClick={() => {
                  removeInvalid();
                }}
              >
                Remove invalid
              </Button>
            ) : (
              <Button
                className="w-full rounded-md md:w-auto"
                variant="primary"
                onClick={onSave}
                disabled={isDisabled || rawData.length === 0}
              >
                Next
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export function SnapshotViewerSheet(
  props: SnapshotUploadProps & {
    isOpen: boolean;
  },
) {
  return (
    <Sheet
      open={props.isOpen}
      onOpenChange={(open) => {
        if (!open) {
          props.onClose();
        }
      }}
    >
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:min-w-[540px] lg:min-w-[900px]">
        <SheetHeader>
          <SheetTitle className="text-left">Snapshot</SheetTitle>
        </SheetHeader>
        <SnapshotViewerSheetContent {...props} />
      </SheetContent>
    </Sheet>
  );
}
