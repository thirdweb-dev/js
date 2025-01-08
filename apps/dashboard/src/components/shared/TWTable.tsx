"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
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
import {
  type ColumnDef,
  type PaginationState,
  type TableOptions,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { EllipsisVerticalIcon, MoveRightIcon } from "lucide-react";
import pluralize from "pluralize";
import { type ReactNode, type SetStateAction, useMemo, useState } from "react";

type CtaMenuItem<TRowData> = {
  icon?: ReactNode;
  text: string;
  onClick: (row: TRowData) => void;
  isDestructive?: boolean;
};

type TWTableProps<TRowData> = {
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  columns: ColumnDef<TRowData, any>[];
  data: TRowData[];
  isPending: boolean;
  isFetched: boolean;
  onRowClick?: (row: TRowData) => void;
  onMenuClick?: CtaMenuItem<TRowData>[];
  pagination?: {
    pageSize: number;
  };
  showMore?: {
    pageSize: number;
    showLess?: boolean;
  };
  title: string;
  bodyRowClassName?: string;
  bodyRowLinkBox?: boolean;
};

export function TWTable<TRowData>(tableProps: TWTableProps<TRowData>) {
  const [showMoreLimit, setShowMoreLimit] = useState(
    tableProps.showMore?.pageSize || Number.POSITIVE_INFINITY,
  );
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: tableProps.pagination?.pageSize || 25,
  });

  const slicedData = useMemo(() => {
    if (tableProps.showMore) {
      return tableProps.data.slice(
        0,
        showMoreLimit || Number.POSITIVE_INFINITY,
      );
    }
    if (tableProps.pagination) {
      return tableProps.data.slice(
        pageIndex * pageSize,
        pageIndex * pageSize + pageSize,
      );
    }
    return tableProps.data;
  }, [
    tableProps.showMore,
    tableProps.pagination,
    tableProps.data,
    showMoreLimit,
    pageIndex,
    pageSize,
  ]);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const paginationOptions: Pick<
    TableOptions<TRowData>,
    "state" | "onPaginationChange" | "manualPagination" | "pageCount"
  > = useMemo(
    () =>
      tableProps.pagination
        ? {
            pageCount: Math.ceil(slicedData.length / pageSize),
            state: { pagination },
            onPaginationChange: setPagination,
            manualPagination: true,
          }
        : {},
    [pageSize, pagination, slicedData.length, tableProps.pagination],
  );

  const table = useReactTable({
    data: slicedData,
    columns: tableProps.columns,
    ...paginationOptions,
    getCoreRowModel: getCoreRowModel(),
    // TODO - add filtering?
    // getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center gap-2 ">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {/* TODO add filtering? */}
                      {/* {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null} */}
                    </div>
                  )}
                </TableHead>
              ))}
              {(tableProps.onRowClick || tableProps.onMenuClick) && (
                <TableHead className="w-0" />
              )}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow
                key={row.id}
                role="group"
                {...(tableProps.onRowClick
                  ? {
                      style: {
                        cursor: "pointer",
                      },
                      onClick: () => tableProps.onRowClick?.(row.original),
                      _hover: { bg: "blackAlpha.50" },
                      _dark: {
                        _hover: {
                          bg: "whiteAlpha.50",
                        },
                      },
                    }
                  : {})}
                className={tableProps.bodyRowClassName}
                linkBox={tableProps.bodyRowLinkBox}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}

                {/* Show a ... menu or individual CTA buttons. */}
                {tableProps.onRowClick ? (
                  <TableCell className="text-end">
                    <MoveRightIcon className="size-4" />
                  </TableCell>
                ) : tableProps.onMenuClick ? (
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          aria-label="Actions"
                          className="!h-auto relative z-10 p-2.5"
                        >
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {tableProps.onMenuClick.map(
                          ({ icon, text, onClick, isDestructive }) => {
                            return (
                              <DropdownMenuItem
                                key={text}
                                onClick={() => onClick(row.original)}
                                className={cn(
                                  "min-w-[170px] cursor-pointer gap-3 px-3 py-3",
                                  isDestructive && "!text-destructive-text",
                                )}
                              >
                                {icon}
                                {text}
                              </DropdownMenuItem>
                            );
                          },
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {tableProps.isPending && (
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 py-4">
            <Spinner className="size-4" />
            <p className="text-muted-foreground text-sm">
              Loading {pluralize(tableProps.title, 0, false)}
            </p>
          </div>
        </div>
      )}

      {!tableProps.isPending &&
        tableProps.data.length === 0 &&
        tableProps.isFetched && (
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4 py-4">
              <p className="text-muted-foreground text-sm">
                No {pluralize(tableProps.title, 0, false)} found.
              </p>
            </div>
          </div>
        )}

      <ShowMoreButton
        shouldShowMore={slicedData.length < tableProps.data.length}
        shouldShowLess={
          !!tableProps.showMore?.showLess &&
          slicedData.length > tableProps.showMore.pageSize
        }
        pageSize={tableProps.showMore?.pageSize || -1}
        showMoreLimit={showMoreLimit}
        setShowMoreLimit={setShowMoreLimit}
      />
    </TableContainer>
  );
}

interface ShowMoreButtonProps {
  pageSize: number;
  showMoreLimit: number;
  setShowMoreLimit: (value: SetStateAction<number>) => void;
  shouldShowMore: boolean;
  shouldShowLess: boolean;
}

const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({
  pageSize,
  showMoreLimit,
  setShowMoreLimit,
  shouldShowLess,
  shouldShowMore,
}) => {
  if (!shouldShowMore && !shouldShowLess) {
    return null;
  }
  let newShowLess = showMoreLimit - pageSize;
  if (newShowLess < pageSize) {
    newShowLess = pageSize;
  }

  return (
    <div className="flex flex-col">
      <Separator />
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          {shouldShowMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreLimit(showMoreLimit + pageSize)}
            >
              Show more
            </Button>
          )}
          {shouldShowLess && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreLimit(newShowLess)}
            >
              Show Less
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
