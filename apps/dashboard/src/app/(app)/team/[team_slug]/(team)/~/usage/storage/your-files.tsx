"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistance } from "date-fns";
import { PinOffIcon } from "lucide-react";
import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { Button } from "@/components/ui/button";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner";
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
import { NEXT_PUBLIC_DASHBOARD_UPLOAD_SERVER } from "@/constants/public-envs";
import { toSize } from "@/utils/number";

interface PinnedFilesResponse {
  result: PinnedFilesResult;
}

interface PinnedFilesResult {
  pinnedFiles: PinnedFile[];
  count: number;
}

interface PinnedFile {
  ipfsHash: string;
  fileSizeBytes: string;
  pinnedAt: string;
}

// TODO: move to hooks file
export const PINNED_FILES_QUERY_KEY_ROOT = "pinned-files";

const pageSize = 10;

function usePinnedFilesQuery({
  page,
  pageSize,
  authToken,
}: {
  page: number;
  pageSize: number;
  authToken: string;
}) {
  const address = useActiveAccount()?.address;
  const offset = page * pageSize;

  return useQuery({
    enabled: !!address,
    queryFn: async () => {
      const res = await fetch(
        `${NEXT_PUBLIC_DASHBOARD_UPLOAD_SERVER}/ipfs/pinned?limit=${pageSize}${
          offset ? `&offset=${offset}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      return (await res.json()) as PinnedFilesResponse;
    },
    queryKey: [
      PINNED_FILES_QUERY_KEY_ROOT,
      {
        __offset__: offset,
        __page_size__: pageSize,
        userAddress: address,
      },
    ],
  });
}

function useUnpinFileMutation(params: { authToken: string }) {
  const { authToken } = params;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ cid }: { cid: string }) => {
      const res = await fetch(
        `${NEXT_PUBLIC_DASHBOARD_UPLOAD_SERVER}/ipfs/pinned/${cid}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          method: "DELETE",
        },
      );
      return res.json();
    },
    onSuccess: () => {
      // invalidate all queries to do with pinned files
      return queryClient.invalidateQueries({
        queryKey: [PINNED_FILES_QUERY_KEY_ROOT],
      });
    },
  });
}

const UnpinButton: React.FC<{ cid: string; authToken: string }> = ({
  cid,
  authToken,
}) => {
  const unpinMutation = useUnpinFileMutation({
    authToken,
  });
  return (
    <ToolTipLabel label="Unpin File">
      <Button
        onClick={() => unpinMutation.mutateAsync({ cid })}
        size="icon"
        variant="outline"
      >
        {unpinMutation.isPending ? (
          <Spinner className="size-4" />
        ) : (
          <PinOffIcon className="size-4 text-destructive-text" />
        )}
      </Button>
    </ToolTipLabel>
  );
};

export const YourFilesSection = (props: { authToken: string }) => {
  const [page, setPage] = useState(1);
  const pinnedFilesQuery = usePinnedFilesQuery({
    authToken: props.authToken,
    page: page - 1,
    pageSize: pageSize,
  });

  const showPagination = pinnedFilesQuery.data?.result
    ? pinnedFilesQuery.data.result.count > pageSize
    : false;

  const totalPages = pinnedFilesQuery.data?.result
    ? Math.ceil(pinnedFilesQuery.data.result.count / pageSize)
    : 0;

  const pinnedFilesToShow = pinnedFilesQuery.data?.result
    ? pinnedFilesQuery.data.result.pinnedFiles
    : undefined;

  return (
    <div>
      <div>
        <h2 className="font-semibold text-2xl tracking-tight">Your files</h2>
        <p className="text-muted-foreground">
          These files are stored and pinned on the IPFS
        </p>
      </div>

      <div className="h-4" />

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IPFS Hash (CID)</TableHead>
              <TableHead>File Size</TableHead>
              <TableHead>Pinned On</TableHead>
              <TableHead>Unpin File</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pinnedFilesToShow?.map((pinnedFile) => (
              <TableRow key={pinnedFile.ipfsHash + pinnedFile.pinnedAt}>
                <TableCell>
                  <CopyTextButton
                    className="-translate-x-2 max-w-[200px] truncate font-mono md:max-w-[350px]"
                    copyIconPosition="left"
                    textToCopy={pinnedFile.ipfsHash}
                    textToShow={pinnedFile.ipfsHash}
                    tooltip="Copy IPFS hash (CID)"
                    variant="ghost"
                  />
                </TableCell>
                <TableCell className="font-mono">
                  {toSize(BigInt(pinnedFile.fileSizeBytes || 0), "MB")}
                </TableCell>
                <TableCell>
                  <ToolTipLabel
                    label={format(new Date(pinnedFile.pinnedAt), "LLL dd, y")}
                  >
                    <span className="capitalize">
                      {formatDistance(
                        new Date(pinnedFile.pinnedAt),
                        new Date(),
                      )}
                    </span>
                  </ToolTipLabel>
                </TableCell>
                <TableCell>
                  <UnpinButton
                    authToken={props.authToken}
                    cid={pinnedFile.ipfsHash}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {pinnedFilesQuery.data?.result?.count === 0 && (
          <div className="flex min-h-[250px] items-center justify-center rounded-lg">
            No Pinned Files
          </div>
        )}

        {pinnedFilesQuery.isPending && (
          <div className="flex min-h-[730px] items-center justify-center rounded-lg">
            <Spinner className="size-10" />
          </div>
        )}

        {showPagination && (
          <div className="border-border border-t py-6">
            <PaginationButtons
              activePage={page}
              onPageClick={setPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </TableContainer>
    </div>
  );
};
