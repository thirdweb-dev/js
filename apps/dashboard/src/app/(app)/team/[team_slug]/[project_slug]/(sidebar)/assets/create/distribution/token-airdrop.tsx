/* eslint-disable @next/next/no-img-element */
"use client";

import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { InlineCode } from "@/components/ui/inline-code";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useCsvUpload } from "hooks/useCsvUpload";
import {
  ArrowDownToLineIcon,
  ArrowRightIcon,
  ArrowUpFromLineIcon,
  CircleAlertIcon,
  FileTextIcon,
  RotateCcwIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import type { TokenDistributionForm } from "../form";

type AirdropAddressInput = {
  address: string;
  quantity: string;
  isValid?: boolean;
  resolvedAddress?: string;
};

export function TokenAirdropSection(props: {
  form: TokenDistributionForm;
}) {
  const airdropAddresses = props.form.watch("airdropAddresses");
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const totalAirdropSupply = airdropAddresses.reduce(
    (acc, curr) => acc + Number(curr.quantity),
    0,
  );

  const isEnabled = props.form.watch("airdropEnabled");

  const removeAirdropAddresses = () => {
    props.form.setValue("airdropAddresses", []);
  };

  return (
    <DynamicHeight>
      <div className="relative border-t border-dashed">
        <div className="flex items-center justify-between gap-3 px-6 py-5">
          <div>
            <h2 className="font-semibold text-lg">Airdrop</h2>
            <p className="text-muted-foreground text-sm">
              Airdrop tokens to a list of addresses with each address receiving
              a specific quantity
            </p>
          </div>

          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => {
              props.form.setValue("airdropEnabled", checked);
              if (!checked) {
                removeAirdropAddresses();
              }
            }}
          />
        </div>

        {isEnabled && (
          <div className="flex justify-start px-6 pb-6">
            {airdropAddresses.length > 0 ? (
              <div className="flex w-full flex-col gap-4 rounded-lg border bg-background p-4 md:flex-row lg:items-center lg:justify-between">
                {/* left */}
                <div>
                  <h3 className="font-medium text-sm">CSV File Uploaded</h3>
                  <p className="text-muted-foreground text-sm">
                    <span className="font-semibold">
                      {airdropAddresses.length}
                    </span>{" "}
                    addresses will receive a total of{" "}
                    <span className="font-semibold">{totalAirdropSupply}</span>{" "}
                    tokens
                  </p>
                </div>

                {/* right */}
                <div className="flex gap-3">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button size="sm" variant="outline">
                        <FileTextIcon className="mr-2 size-4" />
                        View CSV
                      </Button>
                    </SheetTrigger>

                    <SheetContent className="flex h-dvh w-full flex-col gap-0 overflow-hidden lg:max-w-2xl">
                      <SheetHeader className="mb-3">
                        <SheetTitle className="text-left">
                          Airdrop CSV
                        </SheetTitle>
                      </SheetHeader>
                      <AirdropTable
                        data={airdropAddresses}
                        className="rounded-b-none"
                      />
                      <div className="flex justify-end gap-3 rounded-b-lg border border-t-0 bg-card p-6">
                        <Button
                          variant="outline"
                          onClick={removeAirdropAddresses}
                        >
                          <XIcon className="mr-2 size-4" />
                          Remove
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={removeAirdropAddresses}
                    className="gap-2"
                  >
                    <XIcon className="size-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <Sheet open={showUploadSheet} onOpenChange={setShowUploadSheet}>
                  <SheetContent className="flex h-dvh w-full flex-col gap-0 overflow-hidden lg:max-w-2xl">
                    <SheetHeader className="mb-3">
                      <SheetTitle className="text-left font-semibold text-lg">
                        Airdrop CSV File
                      </SheetTitle>
                      <SheetDescription>
                        Upload a CSV file to airdrop tokens to a list of
                        addresses
                      </SheetDescription>
                    </SheetHeader>
                    <AirdropUpload
                      setAirdrop={(addresses) => {
                        props.form.setValue("airdropAddresses", addresses);
                        setShowUploadSheet(false);
                      }}
                      onClose={() => setShowUploadSheet(false)}
                    />
                  </SheetContent>
                </Sheet>

                <Button
                  variant="outline"
                  onClick={() => setShowUploadSheet(true)}
                  className="min-w-44 gap-2 bg-background"
                >
                  <ArrowUpFromLineIcon className="size-4 text-muted-foreground" />
                  Upload CSV
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DynamicHeight>
  );
}

type AirdropUploadProps = {
  setAirdrop: (airdrop: AirdropAddressInput[]) => void;
  onClose: () => void;
};

// CSV parser for airdrop data
const csvParser = (items: AirdropAddressInput[]): AirdropAddressInput[] => {
  return items
    .map(({ address, quantity }) => ({
      address: (address || "").trim(),
      quantity: (quantity || "1").trim(),
    }))
    .filter(({ address }) => address !== "");
};

const AirdropUpload: React.FC<AirdropUploadProps> = ({
  setAirdrop,
  onClose,
}) => {
  const {
    normalizeQuery,
    getInputProps,
    getRootProps,
    rawData,
    noCsv,
    reset,
    removeInvalid,
  } = useCsvUpload<AirdropAddressInput>({ csvParser });

  const normalizeData = normalizeQuery.data;

  if (!normalizeData) {
    return (
      <div className="flex h-[300px] w-full grow items-center justify-center rounded-lg border border-border">
        <Spinner className="size-10" />
      </div>
    );
  }

  const handleContinue = () => {
    setAirdrop(
      normalizeData.result.map((o) => ({
        address: o.resolvedAddress || o.address,
        quantity: o.quantity,
        isValid: o.isValid,
      })),
    );
    onClose();
  };

  return (
    <div className="flex w-full grow flex-col gap-6 overflow-hidden">
      {normalizeData.result.length && rawData.length > 0 ? (
        <div className="flex grow flex-col overflow-hidden outline">
          {normalizeQuery.data.invalidFound && (
            <p className="mb-3 text-red-500 text-sm">
              Invalid addresses found. Please remove them before continuing.
            </p>
          )}
          <AirdropTable
            data={normalizeData.result}
            className="rounded-b-none"
          />
          <div className="flex justify-between gap-3 rounded-b-lg border border-t-0 bg-card p-6">
            <Button
              variant="outline"
              disabled={rawData.length === 0}
              onClick={() => {
                reset();
              }}
            >
              <RotateCcwIcon className="mr-2 size-4" />
              Reset
            </Button>
            {normalizeQuery.data.invalidFound ? (
              <Button
                disabled={rawData.length === 0}
                onClick={() => {
                  removeInvalid();
                }}
              >
                <XIcon className="mr-2 size-4" />
                Remove invalid addresses
              </Button>
            ) : (
              <Button onClick={handleContinue} disabled={rawData.length === 0}>
                Continue <ArrowRightIcon className="ml-2 size-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="relative w-full">
            <div
              className={cn(
                "flex h-[300px] cursor-pointer items-center justify-center rounded-md border border-dashed bg-card hover:border-active-border",
                noCsv &&
                  "border-red-500 bg-red-200/30 text-red-500 hover:border-red-600 dark:border-red-900 dark:bg-red-900/30 dark:hover:border-red-800",
              )}
              {...getRootProps()}
            >
              <input {...getInputProps()} accept=".csv" />
              <div className="flex flex-col items-center justify-center gap-3">
                {!noCsv && (
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex size-11 items-center justify-center rounded-full border bg-card">
                      <UploadIcon className="size-5" />
                    </div>
                    <h2 className="mb-0.5 text-center font-medium text-lg">
                      Upload CSV File
                    </h2>
                    <p className="text-center font-medium text-muted-foreground text-sm">
                      Drag and drop your file or click here to upload
                    </p>
                  </div>
                )}

                {noCsv && (
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex size-11 items-center justify-center rounded-full border border-red-500 bg-red-200/50 text-red-500 dark:border-red-900 dark:bg-red-900/30 dark:text-foreground">
                      <XIcon className="size-5" />
                    </div>
                    <h2 className="mb-0.5 text-center font-medium text-foreground text-lg">
                      Invalid CSV
                    </h2>
                    <p className="text-balance text-center text-sm">
                      Your CSV does not contain the "address" & "quantity"
                      columns
                    </p>

                    <Button
                      className="relative z-50 mt-4"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        reset();
                      }}
                    >
                      Remove Invalid CSV
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="h-6" />
          <CSVFormatDetails />
        </div>
      )}
    </div>
  );
};

function CSVFormatDetails() {
  return (
    <div>
      <h3 className="mb-2 font-semibold">CSV Format</h3>
      <ul className="mb-3 list-none space-y-2 text-muted-foreground text-sm">
        <li>
          CSV file must contain <InlineCode code="address" /> and
          <InlineCode code="quantity" /> columns. If the quantity value is not
          provided in a record, it will default to 1 token.
        </li>
        <li>
          Repeated addresses will be removed and only the first found will be
          kept.
        </li>
        <li>
          ENS Name can be used as an address as well, Address will automatically
          be resolved
        </li>
      </ul>

      <DownloadExampleCSVButton />
    </div>
  );
}

function DownloadExampleCSVButton() {
  return (
    <Button
      size="sm"
      onClick={() => {
        const link = document.createElement("a");
        const exampleData = [
          {
            address: "0x000000000000000000000000000000000000dEaD",
            quantity: "2",
          },
          {
            address: "thirdweb.eth",
            quantity: "1",
          },
        ];

        const csv = `address,quantity\n${exampleData
          .map((o) => `${o.address},${o.quantity}`)
          .join("\n")}`;

        const blob = new Blob([csv], { type: "text/csv" });
        link.href = URL.createObjectURL(blob);
        link.download = "airdrop.csv";
        link.click();
      }}
    >
      <ArrowDownToLineIcon className="mr-2 size-4" />
      Download Example CSV
    </Button>
  );
}

function AirdropTable(props: {
  data: AirdropAddressInput[];
  className?: string;
}) {
  return (
    <TableContainer
      className={cn("flex flex-1 flex-col overflow-hidden", props.className)}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.data.map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <TableRow key={index} className="!border-b">
              <TableCell>
                {item.isValid ? (
                  item.address
                ) : (
                  <div className="flex flex-row items-center gap-2">
                    <CircleAlertIcon className="size-4 text-red-500" />
                    <span className="font-bold text-red-500">
                      {item.address}
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
