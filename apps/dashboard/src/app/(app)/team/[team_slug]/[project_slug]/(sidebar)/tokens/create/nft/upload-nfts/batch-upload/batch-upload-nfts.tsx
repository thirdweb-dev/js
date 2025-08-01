import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ImageOffIcon,
  RotateCcwIcon,
  TagIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  getAddress,
  NATIVE_TOKEN_ADDRESS,
  type ThirdwebClient,
} from "thirdweb";
import { MediaRenderer } from "thirdweb/react";
import { DropZone } from "@/components/blocks/drop-zone/drop-zone";
import { FilePreview } from "@/components/blocks/file-preview";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { TokenSelector } from "@/components/blocks/TokenSelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { DecimalInput } from "@/components/ui/decimal-input";
import { Label } from "@/components/ui/label";
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
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";
import { nftWithPriceSchema } from "../schema";
import { BatchUploadInstructions } from "./batch-upload-instructions";
import {
  type NFTMetadataWithPrice,
  type ProcessBatchUploadFilesResult,
  processBatchUploadFiles,
} from "./process-files";

export function BatchUploadNFTs(props: {
  client: ThirdwebClient;
  results: ProcessBatchUploadFilesResult | null;
  setResults: (results: ProcessBatchUploadFilesResult | null) => void;
  chainId: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div>
      {!props.results || props.results.type === "error" ? (
        <div>
          <div className="p-4 md:p-6">
            <DropZone
              accept={undefined}
              className="bg-background py-20"
              description={
                props.results?.type === "error"
                  ? props.results.error
                  : "Drag and drop the files or folder"
              }
              isError={props.results?.type === "error"}
              onDrop={async (files) => {
                try {
                  const results = await processBatchUploadFiles(files);
                  props.setResults(results);
                } catch (e) {
                  console.error(e);
                  props.setResults({
                    error: e instanceof Error ? e.message : "Unknown error",
                    type: "error",
                  });
                }
              }}
              resetButton={{
                label: "Remove files",
                onClick: () => {
                  props.setResults(null);
                },
              }}
              title={
                props.results?.type === "error"
                  ? "Invalid files"
                  : "Upload Files"
              }
            />
            <div className="h-6" />
            <BatchUploadInstructions />
          </div>

          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <Button className="gap-2" onClick={props.onPrev} variant="outline">
              <ArrowLeftIcon className="size-4" />
              Back
            </Button>

            <Button className="gap-2" disabled>
              Next
              <ArrowRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <BatchUploadResultsTable
          chainId={props.chainId}
          client={props.client}
          data={props.results.data}
          onNext={props.onNext}
          onPrev={props.onPrev}
          onReset={() => {
            props.setResults(null);
          }}
          setData={(dataOrFn) => {
            const data =
              typeof dataOrFn === "function"
                ? dataOrFn(
                    props.results?.type === "data" ? props.results.data : [],
                  )
                : dataOrFn;

            props.setResults({
              data,
              type: "data",
            });
          }}
        />
      )}
    </div>
  );
}

const nativeTokenAddress = getAddress(NATIVE_TOKEN_ADDRESS);

function BatchUploadResultsTable(props: {
  data: NFTMetadataWithPrice[];
  setData: React.Dispatch<React.SetStateAction<NFTMetadataWithPrice[]>>;
  onReset: () => void;
  client: ThirdwebClient;
  chainId: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  const { data, setData, onReset, client, onNext, onPrev } = props;
  const imageFallback = (
    <div className="flex size-20 items-center justify-center rounded-lg border bg-muted/50">
      <ImageOffIcon className="size-7 text-muted-foreground" />
    </div>
  );

  const [batchMode, setBatchMode] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const itemsToShow = data.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(data.length / pageSize);

  return (
    <div>
      <DynamicHeight>
        <div className="rounded-lg rounded-b-none border-b bg-background p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-medium text-lg">Global Settings</h2>
              <p className="text-muted-foreground text-sm">
                Update price, currency, and supply for all NFTs at once.
              </p>
            </div>

            <Switch checked={batchMode} onCheckedChange={setBatchMode} />
          </div>

          {batchMode && (
            <BatchUpdateFieldset
              chainId={props.chainId}
              client={client}
              data={data}
              setData={setData}
            />
          )}
        </div>
      </DynamicHeight>

      <TableContainer className="rounded-t-none border-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NFT</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Supply</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itemsToShow.map((item, paginatedIndex) => {
              const itemIndex = paginatedIndex + (page - 1) * pageSize;

              return (
                <TableRow key={item.name}>
                  {/* Nft */}
                  <TableCell className="min-w-[400px] whitespace-normal">
                    <div className="flex items-start gap-4">
                      <div className="flex shrink-0 flex-col gap-4">
                        {item.image instanceof File ? (
                          <FilePreview
                            className="size-20 rounded-lg border object-cover"
                            client={client}
                            srcOrFile={item.image}
                          />
                        ) : typeof item.image === "string" ? (
                          <MediaRenderer
                            className="size-20 rounded-lg border object-cover"
                            client={client}
                            src={
                              item.image
                                ? resolveSchemeWithErrorHandler({
                                    client,
                                    uri: item.image,
                                  })
                                : ""
                            }
                          />
                        ) : (
                          imageFallback
                        )}

                        {!!item.animation_url && (
                          <div>
                            {typeof item.animation_url === "string" ? (
                              <MediaRenderer
                                className="size-20 rounded-lg border object-cover"
                                client={client}
                                src={item.animation_url}
                              />
                            ) : item.animation_url instanceof File ? (
                              <FilePreview
                                className="size-20 rounded-lg border object-cover"
                                client={client}
                                srcOrFile={item.animation_url}
                              />
                            ) : (
                              imageFallback
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-base">
                            {item.name}
                          </span>

                          {item.description && (
                            <span className="text-muted-foreground text-sm">
                              {item.description}
                            </span>
                          )}
                        </div>

                        {item.background_color && (
                          <div className="flex items-center gap-2">
                            <div
                              className="size-4 rounded-full"
                              style={{ backgroundColor: item.background_color }}
                            />
                            <span className="font-mono">
                              {item.background_color}
                            </span>
                          </div>
                        )}

                        {Array.isArray(item.attributes) && (
                          <div className="flex flex-wrap gap-2">
                            {item.attributes.map((property: unknown) => {
                              if (
                                typeof property === "object" &&
                                property !== null &&
                                "trait_type" in property &&
                                "value" in property &&
                                typeof property.trait_type === "string" &&
                                typeof property.value === "string"
                              ) {
                                return (
                                  <Badge
                                    className="gap-2 text-sm"
                                    key={`${property.trait_type}-${property.value}`}
                                    variant="secondary"
                                  >
                                    <TagIcon className="size-3 text-muted-foreground" />
                                    <span className="text-foreground">
                                      {property.trait_type}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {property.value}
                                    </span>
                                  </Badge>
                                );
                              }
                            })}
                          </div>
                        )}

                        {item.external_url &&
                          typeof item.external_url === "string" && (
                            <div>
                              <a
                                className="inline whitespace-pre-wrap break-all text-muted-foreground underline decoration-muted-foreground/50 decoration-dotted underline-offset-4 hover:text-foreground"
                                href={item.external_url}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                {item.external_url}
                              </a>
                            </div>
                          )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Price Amount */}
                  <TableCell className="whitespace-normal">
                    <div className="flex items-center">
                      <DecimalInput
                        className="w-24 rounded-r-none border-r-0 disabled:opacity-100"
                        onChange={(value) => {
                          setData((v) => {
                            const newData = [...v];
                            newData[itemIndex] = {
                              ...newData[itemIndex],
                              price_amount: value,
                              price_currency: item.price_currency,
                              supply: item.supply,
                            };
                            return newData;
                          });
                        }}
                        value={item.price_amount}
                      />

                      <TokenSelector
                        addNativeTokenIfMissing={true}
                        chainId={props.chainId}
                        className="w-36 rounded-l-none bg-background disabled:opacity-100"
                        client={props.client}
                        disableAddress={true}
                        onChange={(token) => {
                          setData((v) => {
                            const newData = [...v];
                            newData[itemIndex] = {
                              ...newData[itemIndex],
                              price_amount: item.price_amount,
                              price_currency: token.address,
                              supply: item.supply,
                            };
                            return newData;
                          });
                        }}
                        popoverContentClassName="!w-64"
                        selectedToken={{
                          address: item.price_currency || nativeTokenAddress,
                          chainId: props.chainId,
                        }}
                        showCheck={true}
                      />
                    </div>
                  </TableCell>

                  {/* Supply */}
                  <TableCell className="whitespace-normal">
                    <div className="space-y-2">
                      <DecimalInput
                        className="w-32 disabled:opacity-100"
                        onChange={(value) => {
                          setData((v) => {
                            const newData = [...v];
                            newData[itemIndex] = {
                              ...newData[itemIndex],
                              price_amount: item.price_amount,
                              price_currency: item.price_currency,
                              supply: value,
                            };
                            return newData;
                          });
                        }}
                        // disabled={batchMode}
                        value={item.supply}
                      />

                      {item.supply === "0" && (
                        <p className="text-red-500 text-sm">Invalid Supply</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <div className="border-t px-4 py-6">
          <PaginationButtons
            activePage={page}
            onPageClick={setPage}
            totalPages={totalPages}
          />
        </div>
      )}

      <div className="flex flex-col items-center justify-between gap-3 border-t px-6 py-6 lg:flex-row">
        <Button className="gap-2" onClick={onReset} variant="outline">
          <RotateCcwIcon className="size-4 text-muted-foreground" />
          Reset
        </Button>
        <div className="flex gap-3">
          {/* back */}
          <Button className="gap-2" onClick={onPrev} variant="outline">
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>

          <Button
            className="gap-2"
            onClick={() => {
              const result = nftWithPriceSchema.array().safeParse(data);
              if (result.success) {
                onNext();
              } else {
                toast.error(result.error.message);
              }
            }}
          >
            Next
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function BatchUpdateFieldset(props: {
  data: NFTMetadataWithPrice[];
  setData: React.Dispatch<React.SetStateAction<NFTMetadataWithPrice[]>>;
  client: ThirdwebClient;
  chainId: number;
}) {
  const { data, setData, client, chainId } = props;

  const isAllPriceAmountSame = data.every(
    (item) => item.price_amount === data[0]?.price_amount,
  );
  const isAllPriceCurrencySame = data.every(
    (item) => item.price_currency === data[0]?.price_currency,
  );
  const isAllSupplySame = data.every((item) => item.supply === data[0]?.supply);

  const globalSupply = isAllSupplySame ? data[0]?.supply || "" : "";
  const globalPriceAmount = isAllPriceAmountSame
    ? data[0]?.price_amount || ""
    : "";

  const globalPriceCurrency = isAllPriceCurrencySame
    ? data[0]?.price_currency
    : undefined;

  return (
    <div className="mt-5 border-t border-dashed pt-3">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="space-y-1.5">
          <Label>Price</Label>
          <div className="flex w-full">
            <DecimalInput
              className="!text-xl h-12 w-32 rounded-r-none border-r-0 bg-card font-bold placeholder:font-semibold placeholder:text-xl"
              onChange={(value) => {
                setData((v) => {
                  return v.map((item) => ({
                    ...item,
                    price_amount: value,
                  }));
                });
              }}
              placeholder="Custom"
              value={globalPriceAmount}
            />

            <TokenSelector
              addNativeTokenIfMissing={true}
              chainId={chainId}
              className="h-12 w-48 rounded-l-none bg-card"
              client={client}
              disableAddress={true}
              onChange={(token) => {
                setData((v) => {
                  return v.map((item) => ({
                    ...item,
                    price_currency: token.address,
                  }));
                });
              }}
              popoverContentClassName="!w-64"
              selectedToken={
                globalPriceCurrency
                  ? {
                      address: globalPriceCurrency,
                      chainId: chainId,
                    }
                  : undefined
              }
              showCheck={true}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Supply</Label>
          <DecimalInput
            className="!text-xl h-12 bg-card font-bold placeholder:font-semibold placeholder:text-xl lg:w-40"
            onChange={(value) => {
              setData((v) => {
                return v.map((item) => ({
                  ...item,
                  supply: value,
                }));
              });
            }}
            placeholder="Custom"
            value={globalSupply}
          />

          {globalSupply === "0" && (
            <p className="text-red-500 text-sm">Invalid Supply</p>
          )}
        </div>
      </div>
    </div>
  );
}
