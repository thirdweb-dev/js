"use client";

import { PaginationButtons } from "@/components/pagination-buttons";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
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
import { DASHBOARD_STORAGE_URL } from "@/constants/env";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { formatDistance } from "date-fns/formatDistance";
import { PinOffIcon } from "lucide-react";
import { useState } from "react";
import { toSize } from "utils/number";

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
}: {
  page: number;
  pageSize: number;
}) {
  const user = useLoggedInUser();

  const offset = page * pageSize;

  return useQuery({
    queryKey: [
      PINNED_FILES_QUERY_KEY_ROOT,
      {
        userAddress: user.user?.address,
        __page_size__: pageSize,
        __offset__: offset,
      },
    ],
    queryFn: async () => {
      if (!user.isLoggedIn) {
        throw new Error("User is not logged in");
      }
      if (!user.user?.jwt) {
        throw new Error("No token");
      }
      const res = await fetch(
        `${DASHBOARD_STORAGE_URL}/ipfs/pinned?limit=${pageSize}${
          offset ? `&offset=${offset}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${user.user.jwt}`,
          },
        },
      );
      return (await res.json()) as PinnedFilesResponse;
    },
    enabled: user.isLoggedIn && !!user.user?.address && !!user.user.jwt,
  });
}

function useUnpinFileMutation() {
  const token = useLoggedInUser().user?.jwt ?? null;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ cid }: { cid: string }) => {
      if (!token) {
        throw new Error("No token");
      }
      const res = await fetch(`${DASHBOARD_STORAGE_URL}/ipfs/pinned/${cid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

const UnpinButton: React.FC<{ cid: string }> = ({ cid }) => {
  const unpinMutation = useUnpinFileMutation();
  return (
    <ToolTipLabel label="Unpin File">
      <Button
        variant="outline"
        onClick={() => unpinMutation.mutateAsync({ cid })}
        size="icon"
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

export const YourFilesSection: React.FC = () => {
  const [page, setPage] = useState(1);
  const pinnedFilesQuery = usePinnedFilesQuery({
    page: page - 1,
    pageSize: pageSize,
  });

  const showPagination = pinnedFilesQuery.data
    ? pinnedFilesQuery.data.result.count > pageSize
    : false;

  const totalPages = pinnedFilesQuery.data
    ? Math.ceil(pinnedFilesQuery.data.result.count / pageSize)
    : 0;

  const pinnedFilesToShow = pinnedFilesQuery.data
    ? pinnedFilesQuery.data.result.pinnedFiles
    : undefined;

  return (
    <div>
      <h2 className="font-semibold text-lg tracking-tight">
        Your Pinned Files
      </h2>

      <div className="h-2" />

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
                    textToCopy={pinnedFile.ipfsHash}
                    textToShow={pinnedFile.ipfsHash}
                    className="-translate-x-2 max-w-[200px] truncate font-mono md:max-w-[350px]"
                    copyIconPosition="left"
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
                  <UnpinButton cid={pinnedFile.ipfsHash} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {pinnedFilesQuery.data && pinnedFilesQuery.data.result.count === 0 && (
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
