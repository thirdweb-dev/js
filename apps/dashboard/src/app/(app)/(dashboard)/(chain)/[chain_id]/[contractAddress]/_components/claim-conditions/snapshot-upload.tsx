import {
  ArrowRightIcon,
  CircleAlertIcon,
  CircleSlashIcon,
  RotateCcwIcon,
} from "lucide-react";
import { type ThirdwebClient, ZERO_ADDRESS } from "thirdweb";
import { DownloadableCode } from "@/components/blocks/code/downloadable-code";
import { DropZone } from "@/components/blocks/drop-zone/drop-zone";
import { Button } from "@/components/ui/button";
import { InlineCode } from "@/components/ui/inline-code";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useCsvUpload } from "@/hooks/useCsvUpload";

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
  client: ThirdwebClient;
}

const csvParser = (items: SnapshotAddressInput[]): SnapshotAddressInput[] => {
  return items
    .map(({ address, maxClaimable, price, currencyAddress }) => ({
      address: (address || "").trim(),
      currencyAddress: (currencyAddress || "").trim() || undefined,
      maxClaimable: (maxClaimable || "0").trim().toLowerCase(),
      price: (price || "").trim() || undefined,
    }))
    .filter(({ address }) => address !== "");
};

function SnapshotDataTable({ data }: { data: SnapshotAddressInput[] }) {
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Max claimable</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Currency Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.address}>
              <TableCell>
                {item.isValid ? (
                  item.address
                ) : (
                  <ToolTipLabel
                    label={
                      item.address === ZERO_ADDRESS
                        ? "Cannot send tokens to ZERO_ADDRESS"
                        : item.address.startsWith("0x")
                          ? "Address is not valid"
                          : "Address couldn't be resolved"
                    }
                  >
                    <div className="flex flex-row items-center gap-2">
                      <CircleAlertIcon className="size-4 text-red-500" />
                      <div className="cursor-default font-bold text-red-500">
                        {item.address}
                      </div>
                    </div>
                  </ToolTipLabel>
                )}
              </TableCell>
              <TableCell>
                {item.maxClaimable === "0" || !item.maxClaimable
                  ? "Default"
                  : item.maxClaimable === "unlimited"
                    ? "Unlimited"
                    : item.maxClaimable}
              </TableCell>
              <TableCell>
                {item.price === "0"
                  ? "Free"
                  : !item.price || item.price === "unlimited"
                    ? "Default"
                    : item.price}
              </TableCell>
              <TableCell>
                {item.currencyAddress ===
                  "0x0000000000000000000000000000000000000000" ||
                !item.currencyAddress
                  ? "Default"
                  : item.currencyAddress}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const SnapshotViewerSheetContent: React.FC<SnapshotUploadProps> = ({
  setSnapshot,
  dropType,
  isDisabled,
  value,
  onClose,
  client,
}) => {
  const csvUpload = useCsvUpload<SnapshotAddressInput>({
    client,
    csvParser,
    defaultRawData: value,
  });

  const normalizeData = csvUpload.normalizeQuery.data;

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
        currencyAddress: o.currencyAddress,
        maxClaimable: o.maxClaimable,
        price: o.price,
      })),
    );
    onClose();
  };

  return (
    <div className="space-y-6">
      {csvUpload.rawData.length > 0 ? (
        <div>
          <SnapshotDataTable data={csvUpload.normalizeQuery.data.result} />
          <div className="flex justify-end gap-3 border-t py-6 border-dashed">
            <Button
              className="gap-2"
              disabled={isDisabled || csvUpload.rawData.length === 0}
              onClick={() => {
                csvUpload.reset();
              }}
              variant="outline"
            >
              <RotateCcwIcon className="size-4" />
              Reset
            </Button>

            {csvUpload.normalizeQuery.data?.invalidFound ? (
              <Button
                className="gap-2"
                disabled={isDisabled || csvUpload.rawData.length === 0}
                onClick={() => {
                  csvUpload.removeInvalid();
                }}
              >
                <CircleSlashIcon className="size-4" />
                Remove invalid
              </Button>
            ) : (
              <Button
                className="gap-2"
                disabled={isDisabled || csvUpload.rawData.length === 0}
                onClick={onSave}
              >
                Next
                <ArrowRightIcon className="size-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <DropZone
            className="py-20"
            onDrop={csvUpload.setFiles}
            isError={csvUpload.noCsv}
            title={
              csvUpload.noCsv
                ? "Invalid CSV file"
                : "Drag & Drop a CSV file here"
            }
            description={
              "The CSV file must follow the format specified in the requirements below"
            }
            resetButton={{ label: "Reset", onClick: () => csvUpload.reset() }}
            accept=".csv"
          />

          <div className="flex flex-col gap-2 mt-6">
            <p className="text-base font-medium">Requirements</p>
            <div className="space-y-2 text-muted-foreground text-sm">
              {dropType === "specific" ? (
                <>
                  <p>
                    Files <em>must</em> contain one .csv file with a list of
                    addresses and their <InlineCode code="maxClaimable" />.
                    (amount each wallet is allowed to claim)
                  </p>

                  <DownloadableCode
                    code={snapshotWithMaxClaimable}
                    lang="csv"
                    fileNameWithExtension="snapshot-with-maxclaimable.csv"
                  />

                  <p>
                    You may optionally add <InlineCode code="price" /> and
                    <InlineCode code="currencyAddress" /> overrides as well.
                    This lets you override the currency and price you would like
                    to charge per wallet you specified
                  </p>

                  <DownloadableCode
                    code={snapshotWithOverrides}
                    lang="csv"
                    fileNameWithExtension="snapshot-with-overrides.csv"
                  />
                </>
              ) : (
                <>
                  <p>
                    Files <em>must</em> contain one .csv file with a list of
                    addresses.
                  </p>

                  <DownloadableCode
                    code={snapshotCSV}
                    lang="csv"
                    fileNameWithExtension="snapshot.csv"
                  />

                  <p>
                    You may optionally add a <InlineCode code="maxClaimable" />
                    column override. (amount each wallet is allowed to claim) If
                    not specified, the default value is the one you have set on
                    your claim phase.
                  </p>

                  <DownloadableCode
                    code={snapshotWithMaxClaimable}
                    lang="csv"
                    fileNameWithExtension="snapshot-with-maxclaimable.csv"
                  />

                  <p>
                    You may optionally add <InlineCode code="price" /> and
                    <InlineCode code="currencyAddress" /> overrides. This lets
                    you override the currency and price you would like to charge
                    per wallet you specified.{" "}
                    <strong>
                      When defining a custom currency address, you must also
                      define a price override.
                    </strong>
                  </p>

                  <DownloadableCode
                    code={snapshotWithOverrides}
                    lang="csv"
                    fileNameWithExtension="snapshot-with-overrides.csv"
                  />
                </>
              )}
              <p>
                Repeated addresses will be removed and only the first found will
                be kept.
              </p>
              <p>
                The limit you set is for the maximum amount of NFTs a wallet can
                claim, not how many they can receive in total.
              </p>
            </div>
          </div>
        </div>
      )}
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
      onOpenChange={(open) => {
        if (!open) {
          props.onClose();
        }
      }}
      open={props.isOpen}
    >
      <SheetContent className="!w-full !max-w-4xl overflow-y-auto">
        <SheetHeader className="mb-3">
          <SheetTitle className="text-left">Snapshot</SheetTitle>
        </SheetHeader>
        <SnapshotViewerSheetContent {...props} />
      </SheetContent>
    </Sheet>
  );
}

const snapshotWithMaxClaimable = `\
address,maxClaimable
0x0000000000000000000000000000000000000000,2
0x000000000000000000000000000000000000dEaD,5`;

const snapshotWithOverrides = `\
address,maxClaimable,price,currencyAddress
0x0000000000000000000000000000000000000000,2,0.1,0x0000000000000000000000000000000000000000
0x000000000000000000000000000000000000dEaD,5,2.5,0x0000000000000000000000000000000000000000`;

const snapshotCSV = `\
address
0x0000000000000000000000000000000000000000
0x000000000000000000000000000000000000dEaD`;
