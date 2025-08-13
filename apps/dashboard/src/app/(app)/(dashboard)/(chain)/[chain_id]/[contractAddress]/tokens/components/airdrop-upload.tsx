import { ArrowRightIcon, RefreshCcwIcon, TrashIcon } from "lucide-react";
import type { ThirdwebClient } from "thirdweb";
import { DownloadableCode } from "@/components/blocks/code/downloadable-code";
import { DropZone } from "@/components/blocks/drop-zone/drop-zone";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useCsvUpload } from "@/hooks/useCsvUpload";
import { AirdropCSVTable } from "./airdrop-csv-table";

export type AirdropAddressInput = {
  address: string;
  quantity: string;
  isValid?: boolean;
};

export function AirdropUpload(props: {
  setAirdrop: (airdrop: AirdropAddressInput[]) => void;
  client: ThirdwebClient;
}) {
  const csvUpload = useCsvUpload<AirdropAddressInput>({
    client: props.client,
    csvParser,
  });

  if (csvUpload.normalizeQuery.isPending) {
    return (
      <div className="flex min-h-[400px] w-full flex-col grow items-center justify-center">
        <Spinner className="size-10" />
        <p className="text-base text-foreground mt-5">Resolving ENS</p>
        <p className="text-sm text-muted-foreground mt-2">
          {csvUpload.normalizeProgress.current} /{" "}
          {csvUpload.normalizeProgress.total}
        </p>
      </div>
    );
  }

  const normalizeData = csvUpload.normalizeQuery.data;

  if (!normalizeData) {
    return (
      <div className="flex min-h-[400px] w-full flex-col grow items-center justify-center text-center">
        <p className="text-base text-foreground">Failed to resolve ENS</p>
        <p className="text-sm text-muted-foreground mt-2">
          {String(csvUpload.normalizeQuery.error)}
        </p>
      </div>
    );
  }

  const onSave = () => {
    props.setAirdrop(
      normalizeData.result.map((o) => ({
        address: o.resolvedAddress,
        quantity: o.quantity,
      })),
    );
  };

  return (
    <div className="w-full">
      {normalizeData.result.length && csvUpload.rawData.length > 0 ? (
        <div>
          <AirdropCSVTable
            data={csvUpload.normalizeQuery.data.result.map((row) => ({
              address: row.address ?? row.resolvedAddress,
              quantity: row.quantity,
              isValid: row.isValid,
            }))}
          />
          <div className="flex justify-end gap-4 mt-6">
            <Button
              disabled={csvUpload.rawData.length === 0}
              variant="outline"
              className="gap-2"
              onClick={() => {
                csvUpload.reset();
              }}
            >
              <RefreshCcwIcon className="size-4" />
              <span>Reset</span>
            </Button>
            {csvUpload.normalizeQuery.data.invalidFound ? (
              <Button
                disabled={csvUpload.rawData.length === 0}
                className="gap-2"
                onClick={() => {
                  csvUpload.removeInvalid();
                }}
              >
                <TrashIcon className="size-4" />
                <span>Remove invalid</span>
              </Button>
            ) : (
              <Button
                disabled={csvUpload.rawData.length === 0}
                className="gap-2"
                onClick={onSave}
              >
                <span>Next</span>
                <ArrowRightIcon className="size-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <DropZone
            onDrop={csvUpload.setFiles}
            isError={csvUpload.noCsv}
            title="Upload CSV"
            className="py-16"
            description={
              csvUpload.noCsv
                ? "Invalid CSV File. Follow the instructions below to upload a valid CSV file"
                : "Follow the instructions below to create a CSV file"
            }
            resetButton={{ label: "Remove CSV", onClick: csvUpload.reset }}
            accept=".csv"
          />

          <div>
            <h3 className="text-base font-medium mb-2">Requirements</h3>
            <ul className="list-disc list-outside pl-4 space-y-2 text-muted-foreground text-base leading-relaxed">
              <li>
                Files <em>must</em> contain one .csv file with an address and
                quantity column, if the quantity column is not provided, that
                record will be flagged as invalid.{" "}
              </li>
              <li>
                Repeated addresses will be removed and only the first found will
                be kept.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-medium mb-2">CSV Example</h3>
            <DownloadableCode
              code={exampleAirdropCSV}
              lang="csv"
              fileNameWithExtension="airdrop.csv"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const csvParser = (items: AirdropAddressInput[]): AirdropAddressInput[] => {
  return items
    .map(({ address, quantity }) => ({
      address: address.trim(),
      quantity: (quantity || "1").trim(),
    }))
    .filter(({ address }) => address !== "");
};

const exampleAirdropCSV = `address,quantity
0xEb0effdFB4dC5b3d5d3aC6ce29F3ED213E95d675,10
0x000000000000000000000000000000000000dEaD,1`;
