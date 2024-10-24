"use client";
import { UnorderedList } from "@/components/ui/List/List";
import { InlineCode } from "@/components/ui/inline-code";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { useQuery } from "@tanstack/react-query";
import { TransactionButton } from "components/buttons/TransactionButton";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  UploadIcon,
} from "lucide-react";
import {
  type Dispatch,
  type SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { type Column, usePagination, useTable } from "react-table";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import {
  getBaseURICount,
  getBatchIdAtIndex,
  updateBatchBaseURI,
} from "thirdweb/extensions/erc721";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { upload } from "thirdweb/storage";
import type { NFTInput } from "thirdweb/utils";
import { Button, Heading, Text } from "tw-components";
import { processInputData } from "utils/batch";

type BatchInfo = {
  batchIndex: bigint;
  startTokenId: bigint;
  endTokenId: bigint;
};

/**
 * Batch update metadata using `updateBatchBaseURI`
 * Used for DropERC721 (NFT Drop) only
 */
export function BatchUpdateMetadataButton({
  contract,
}: { contract: ThirdwebContract }) {
  const [open, setOpen] = useState(false);
  // Screen: IntroStep -> BatchSelectedStep -> Sign transaction
  const [selectedBatch, setSelectedBatch] = useState<BatchInfo>();
  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          colorScheme="primary"
          leftIcon={<PencilIcon className="size-4" />}
        >
          Update Metadata
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Batch Update Metadata</SheetTitle>
        </SheetHeader>
        <div className="flex w-full items-center px-3 py-5">
          {selectedBatch ? (
            <BatchSelectedStep
              contract={contract}
              selectedBatch={selectedBatch}
              setSelectedBatch={setSelectedBatch}
              setOpen={setOpen}
            />
          ) : (
            <IntroStep
              contract={contract}
              setSelectedBatch={setSelectedBatch}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// This is the first screen that appears when users click on the "Update Metadatas" buttons
function IntroStep({
  contract,
  setSelectedBatch,
}: {
  contract: ThirdwebContract;
  setSelectedBatch: Dispatch<SetStateAction<BatchInfo | undefined>>;
}) {
  // Add this to the SDK?
  async function getBatchInfo({
    contract,
  }: { contract: ThirdwebContract }): Promise<BatchInfo[]> {
    const batchCount = await getBaseURICount({ contract });
    if (batchCount === 0n) {
      throw new Error("No batch found");
    }
    const batches: BatchInfo[] = [];
    // Look for the batchId & determine the start + end tokenId of the batch
    let startTokenId = 0n;
    let endTokenId = 0n;
    let batchIndex = 0n;
    for (let i = 0n; i < batchCount; i += 1n) {
      batchIndex = i;
      endTokenId = await getBatchIdAtIndex({
        contract,
        index: batchIndex,
      });
      batches.push({ batchIndex, startTokenId, endTokenId: endTokenId - 1n });
      startTokenId = endTokenId;
    }
    return batches;
  }
  const batchQuery = useQuery({
    queryFn: () => getBatchInfo({ contract }),
    queryKey: ["batch-info", contract.chain.id, contract.address],
  });
  const paginationPortalRef = useRef<HTMLDivElement>(null);
  return (
    <div className="m-auto flex flex-col gap-3 md:flex-row md:gap-8">
      <div className="flex flex-col md:w-1/2">
        <p className="mb-5 text-lg">Select a batch to update</p>
        {batchQuery.isLoading && "Loading..."}
        {batchQuery.data && (
          <BatchInfoTable
            data={batchQuery.data}
            portalRef={paginationPortalRef}
            selectBatch={setSelectedBatch}
          />
        )}
      </div>
      <div className="flex flex-col md:w-1/2">
        <p className="mb-5 text-lg">How it works</p>
        <UnorderedList>
          <li>
            Every time you upload (aka. Lazy Mint) one or more NFT to the
            collection, you create a batch.
          </li>
          <li>
            For example, when you upload the first 3 NFTs to your collection,
            you create the first batch, containing tokenIds 0, 1 and 2.
            <br />
            When you upload the next 5 items, you create the second batch,
            containing tokenIds 3, 4, 5, 6 and 7.
          </li>
          <li>
            With thirdweb NFT Drop contract, you can easily update all the
            content of the NFTs in one batch, with one transaction.
          </li>
        </UnorderedList>
      </div>
    </div>
  );
}

// This is the second screen (step) that appears when users have selected a batch (from the BatchInfoTable) to update
function BatchSelectedStep({
  contract,
  selectedBatch,
  setSelectedBatch,
  setOpen,
}: {
  contract: ThirdwebContract;
  selectedBatch: BatchInfo;
  setSelectedBatch: Dispatch<SetStateAction<BatchInfo | undefined>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const client = useThirdwebClient();
  const sendAndConfirmTx = useSendAndConfirmTransaction();

  const numOfTokensInSelectedBatch = useMemo(() => {
    return selectedBatch.endTokenId - selectedBatch.startTokenId + 1n;
  }, [selectedBatch]);

  const form = useForm<{ metadatas: NFTInput[] }>({
    defaultValues: {
      metadatas: [],
    },
  });

  const hasFailed = form.getFieldState("metadatas", form.formState).error
    ?.message;

  const uploadedFiles = form.watch("metadatas");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      try {
        await processInputData(acceptedFiles, (data) => {
          // MUST make sure the length of uploaded items matches the length of the batch
          if (BigInt(data.length) !== numOfTokensInSelectedBatch) {
            return form.setError("metadatas", {
              message: `Number of items mimatched. Expected ${numOfTokensInSelectedBatch}, received ${data.length}`,
              type: "validate",
            });
          }
          form.setValue("metadatas", data);
          // Make sure the error is cleared on subsequent retries
          form.clearErrors("metadatas");
        });
      } catch {
        form.setError("metadatas", {
          message: "Invalid metadata files",
          type: "validate",
        });
      }
    },
  });

  const update = form.handleSubmit(async (data) => {
    try {
      const uploadPromise = upload({
        client,
        files: data.metadatas,
        rewriteFileNames: {
          fileStartNumber: Number(selectedBatch.startTokenId),
        },
      });
      toast.promise(uploadPromise, {
        loading: "Uploading assets",
        error: "Failed to upload assets",
      });
      const batchOfUris = await uploadPromise;
      if (!batchOfUris || !batchOfUris.length || !batchOfUris[0]) {
        throw new Error("Failed to upload batch of new metadatas");
      }

      const baseUri = batchOfUris[0].substring(
        0,
        batchOfUris[0].lastIndexOf("/"),
      );
      // IMPORTANT: The new ipfs URI must have the trailing slash at the end
      // this is required by the Drop contract
      const uri = `${baseUri}/`;
      const transaction = updateBatchBaseURI({
        contract,
        uri,
        index: selectedBatch.batchIndex,
      });
      const promise = sendAndConfirmTx.mutateAsync(transaction, {
        onSuccess: () => {
          form.reset();
          setSelectedBatch(undefined);
          setOpen(false);
        },
        onError: (err) => {
          console.error(err);
        },
      });
      toast.promise(promise, {
        loading: "Updating batch",
        success: "Batch updated successfully",
        error: "Failed to update batch",
      });
    } catch (err) {
      console.error(err);
      toast.error("Update metadata failed. Please try again");
    }
  });

  return (
    <div className="m-auto flex flex-col gap-3 md:flex-row md:gap-8">
      <div className="flex flex-col md:w-1/2">
        <div className="m-auto flex flex-col gap-5">
          {uploadedFiles.length && !hasFailed ? (
            <>
              <p className="text-center text-lg">
                {uploadedFiles.length} files added.
              </p>
              <form className="flex flex-col pb-10" onSubmit={update}>
                <div className="flex flex-row gap-3">
                  <Button onClick={() => form.reset()}>Reset</Button>
                  <TransactionButton
                    type="submit"
                    className="mx-auto w-fit"
                    colorScheme="primary"
                    txChainID={contract.chain.id}
                    transactionCount={1}
                    isDisabled={!!hasFailed || !form.watch("metadatas").length}
                    isLoading={form.formState.isSubmitting}
                    loadingText="Updating..."
                  >
                    Update metadatas
                  </TransactionButton>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                variant="ghost"
                w="fit-content"
                leftIcon={<ChevronLeftIcon />}
                onClick={() => {
                  form.reset();
                  setSelectedBatch(undefined);
                }}
              >
                Back
              </Button>
              <div className="relative mx-auto aspect-square w-full">
                <div
                  className={cn(
                    "flex h-full cursor-pointer rounded-md border border-border hover:border-blue-500",
                    hasFailed ? "bg-red-200" : "bg-card",
                  )}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <div className="m-auto flex flex-col p-6">
                    <UploadIcon
                      className={cn(
                        "mx-auto mb-2 size-8",
                        hasFailed ? "text-red-500" : "text-gray-600",
                      )}
                    />
                    {isDragActive ? (
                      <Heading
                        as={Text}
                        size="label.md"
                        color="gray.600"
                        textAlign="center"
                      >
                        Drop the files here
                      </Heading>
                    ) : (
                      <Heading
                        as={Text}
                        size="label.md"
                        lineHeight={1.2}
                        color={hasFailed ? "red.500" : "gray.600"}
                        textAlign="center"
                      >
                        {hasFailed
                          ? hasFailed
                          : "Drag & Drop files or folders here, or click to select files"}
                      </Heading>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col md:w-1/2">
        <UploadRequirements selectedBatch={selectedBatch} />
      </div>
    </div>
  );
}

interface BatchTableProps {
  data: BatchInfo[];
  portalRef: React.RefObject<HTMLDivElement>;
  selectBatch: Dispatch<SetStateAction<BatchInfo | undefined>>;
}

/**
 * A table to show info about all batches and their tokenIds from a collection
 */
const BatchInfoTable: React.FC<BatchTableProps> = ({
  data,
  portalRef,
  selectBatch,
}) => {
  const columns = useMemo(() => {
    return [
      {
        Header: "Batch Index",
        accessor: ({ batchIndex }) => {
          return `Batch Index: ${batchIndex.toString()}`;
        },
      },
      {
        Header: "TokenIds",
        accessor: ({ startTokenId, endTokenId }) => {
          return `${startTokenId.toString()} - ${endTokenId.toString()}`;
        },
      },
      {
        Header: "Update",
        accessor: (batchInfo) => {
          return (
            <Button
              colorScheme="primary"
              onClick={() => selectBatch(batchInfo)}
            >
              Select
            </Button>
          );
        },
      },
    ] as Column<BatchInfo>[];
  }, [selectBatch]);
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
        pageSize: 25,
        pageIndex: 0,
      },
    },
    // old package: this will be removed
    // eslint-disable-next-line react-compiler/react-compiler
    usePagination,
  );
  return (
    <div className="overflow-y-auto lg:max-h-[600px]">
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup, headerGroupIndex) => (
            <Tr
              {...headerGroup.getHeaderGroupProps()}
              // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
              key={headerGroupIndex}
            >
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
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, rowIndex) => {
            prepareRow(row);
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
              <Tr {...row.getRowProps()} key={rowIndex}>
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
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {/* Only need to show the Pagination components if we have more than 25 records */}
      {data.length > 25 && (
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
    </div>
  );
};

/**
 * This component shows the requirements for uploading files to update the batch must be strict
 * Since this feature is not user-friendly by itself,
 * We need to make sure users do not make any mistake that would corrupt the batch
 */
function UploadRequirements({ selectedBatch }: { selectedBatch: BatchInfo }) {
  const numOfTokensInSelectedBatch = useMemo(() => {
    return selectedBatch.endTokenId - selectedBatch.startTokenId + 1n;
  }, [selectedBatch]);

  // A string like this: "0, 1, 2, ..., n"
  const sequenceExample = useMemo(() => {
    if (selectedBatch.startTokenId === selectedBatch.endTokenId) {
      // If there are only 1 item in this batch, we cna simplify the requirements
      return "";
    }
    if (selectedBatch.endTokenId - selectedBatch.startTokenId <= 2n) {
      return Array.from(
        {
          length: Number(
            selectedBatch.endTokenId - selectedBatch.startTokenId + 1n,
          ),
        },
        (_, i) => selectedBatch.startTokenId + BigInt(i),
      ).join(", ");
    }

    const firstThree = [
      selectedBatch.startTokenId,
      selectedBatch.startTokenId + 1n,
      selectedBatch.startTokenId + 2n,
    ].join(", ");
    return `${firstThree}, ... ${selectedBatch.endTokenId}`;
  }, [selectedBatch]);

  const hasOnly1Item = useMemo(
    () => selectedBatch.startTokenId === selectedBatch.endTokenId,
    [selectedBatch],
  );
  return (
    <>
      <p className="mb-5 text-lg">
        You have selected batch index: {selectedBatch.batchIndex.toString()}
      </p>
      <UnorderedList>
        <li>
          This batch contains {numOfTokensInSelectedBatch.toString()} NFTs, from
          tokenId {selectedBatch.startTokenId.toString()} to tokenId{" "}
          {selectedBatch.endTokenId.toString()}.
        </li>
        <li>
          Files <em>must</em> contain one .csv or .json file with metadata. -{" "}
          <Link download color="blue.500" href="/example.csv">
            Download example.csv
          </Link>
          .{" "}
          <Link download color="blue.500" href="/example.json">
            Download example.json
          </Link>
          .
        </li>
        <li>
          The csv <em>must</em> have a <InlineCode code="name" /> column, which
          defines the name of the NFT.
        </li>
        {!hasOnly1Item && sequenceExample && (
          <li>
            Asset names <em>must</em> be sequential {sequenceExample}
            .[extension]. It <strong>MATTERS</strong> at what number you begin.
            For this batch, the number must begin with{" "}
            {selectedBatch.startTokenId.toString()} and end with{" "}
            {selectedBatch.endTokenId.toString()} (Example:{" "}
            <InlineCode code={`${selectedBatch.startTokenId}.png`} />,{" "}
            <InlineCode code={`${selectedBatch.startTokenId + 1n}.png`} />
            ...
            <InlineCode code={`${selectedBatch.endTokenId}.png`} />
            ).
          </li>
        )}
        {hasOnly1Item && (
          <li>
            Since this batch has only 1 item (tokenId:{" "}
            {selectedBatch.startTokenId.toString()}), you just need to make sure
            you upload asset for only 1 item. The uploaded asset will be matched
            correctly to the tokenId {selectedBatch.startTokenId}
          </li>
        )}
        <li>
          Make sure to drag and drop the CSV/JSON and the images{" "}
          <strong>at the same time</strong>.
        </li>
      </UnorderedList>
      <Heading size="subtitle.sm" mt={4}>
        Options
      </Heading>
      <UnorderedList>
        <li>
          Images and other file types can be used in combination.
          <br />
          <small>
            They both have to follow the asset naming convention above.
            (Example: <InlineCode code="0.png" /> and{" "}
            <InlineCode code="0.mp4" />,
            <InlineCode code="1.png" /> and <InlineCode code="1.glb" />, etc.)
          </small>
        </li>
        <li>
          When uploading files, we will upload them and pin them to IPFS
          automatically for you. If you already have the files uploaded, you can
          add an <InlineCode code="image" /> and/or
          <InlineCode code="animation_url" /> column and add the IPFS hashes
          there.{" "}
          <Link download color="blue.500" href="/example-with-ipfs.csv">
            Download example.csv
          </Link>
        </li>
        <li>
          If you want to make your media files map to your NFTs, you can add add
          the name of your files to the <InlineCode code="image" /> and
          <InlineCode code="animation_url" /> column.{" "}
          <Link download color="blue.500" href="/example-with-maps.csv">
            Download example.csv
          </Link>
        </li>
      </UnorderedList>
    </>
  );
}
