import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Center, Flex, Tooltip } from "@chakra-ui/react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { TWQueryTable } from "components/shared/TWQueryTable";
import { formatDistance } from "date-fns/formatDistance";
import { DASHBOARD_STORAGE_URL } from "lib/sdk";
import { useCallback, useState } from "react";
import { Button, Card, Heading, Text, TrackedCopyButton } from "tw-components";
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

const DEFAULT_PAGE_SIZE = 50;
function usePinnedFilesQuery({
  page = 0,
  pageSize = DEFAULT_PAGE_SIZE,
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
    // keep the previous data while fetching new data
    placeholderData: keepPreviousData,
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

// END TOOD

const TRACKING_CATEGORY = "storage-files";

const columnHelper = createColumnHelper<PinnedFile>();

const columns = [
  columnHelper.accessor((row) => row.ipfsHash, {
    header: "IPFS Hash (CID)",
    cell: ({ cell }) => {
      const value = cell.getValue();

      return (
        <Flex align="center" maxW="300px">
          <Text isTruncated>{value}</Text>
          <TrackedCopyButton
            value={value}
            category={TRACKING_CATEGORY}
            label="copy-cid"
            aria-label="Copy CID"
          />
        </Flex>
      );
    },
  }),
  columnHelper.accessor((row) => toSize(BigInt(row.fileSizeBytes || 0), "MB"), {
    header: "File Size",
    cell: ({ cell }) => <Text fontFamily="mono">{cell.getValue()}</Text>,
  }),
  columnHelper.accessor((row) => row.pinnedAt, {
    header: "Pinned",
    cell: ({ cell }) => {
      const date = new Date(cell.getValue());
      return (
        <Tooltip
          p={0}
          shouldWrapChildren
          bg="transparent"
          boxShadow="none"
          label={
            <Card py={2} px={4} bgColor="backgroundHighlight">
              <Text size="label.sm">{date.toLocaleString()}</Text>
            </Card>
          }
        >
          <Text>{formatDistance(date, new Date())} ago</Text>
        </Tooltip>
      );
    },
  }),
  columnHelper.accessor((row) => row.ipfsHash, {
    id: "action",
    header: "",
    cell: ({ cell }) => <UnpinButton cid={cell.getValue()} />,
  }),
];

const UnpinButton: React.FC<{ cid: string }> = ({ cid }) => {
  const { mutateAsync, isPending } = useUnpinFileMutation();
  return (
    <Button
      isLoading={isPending}
      size="sm"
      variant="outline"
      onClick={() => mutateAsync({ cid })}
    >
      Unpin
    </Button>
  );
};

export const YourFilesSection: React.FC = () => {
  const user = useLoggedInUser();
  const [page, setPage] = useState(0);

  const query = usePinnedFilesQuery({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const selectData = useCallback(
    (data?: PinnedFilesResponse) => data?.result?.pinnedFiles || [],
    [],
  );
  const selectTotalCount = useCallback(
    (data?: PinnedFilesResponse) => data?.result?.count || 0,
    [],
  );
  return (
    <Flex flexDir="column" w="full" gap={4}>
      <Heading size="title.md" as="h2">
        Your Pinned Files
      </Heading>

      {user.isLoggedIn ? (
        <TWQueryTable
          title="file"
          query={query}
          columns={columns}
          selectData={selectData}
          pagination={{
            page,
            setPage,
            pageSize: DEFAULT_PAGE_SIZE,
            selectTotalCount,
          }}
        />
      ) : (
        <Card>
          <Center>
            <Text>
              Please connect your wallet to see the files you have pinned.
            </Text>
          </Center>
        </Card>
      )}
    </Flex>
  );
};
