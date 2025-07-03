/** biome-ignore-all lint/a11y/useSemanticElements: FIXME */
"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  type TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import { EllipsisVerticalIcon, MoveRightIcon } from "lucide-react";
import pluralize from "pluralize";
import { type ReactNode, type SetStateAction, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/Spinner/Spinner";
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
  tableContainerClassName?: string;
  tableScrollableClassName?: string;
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
            manualPagination: true,
            onPaginationChange: setPagination,
            pageCount: Math.ceil(slicedData.length / pageSize),
            state: { pagination },
          }
        : {},
    [pageSize, pagination, slicedData.length, tableProps.pagination],
  );

  const table = useReactTable({
    columns: tableProps.columns,
    data: slicedData,
    ...paginationOptions,
    getCoreRowModel: getCoreRowModel(),
    // TODO - add filtering?
    // getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <TableContainer
      className={tableProps.tableContainerClassName}
      scrollableContainerClassName={tableProps.tableScrollableClassName}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead colSpan={header.colSpan} key={header.id}>
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
                      _dark: {
                        _hover: {
                          bg: "whiteAlpha.50",
                        },
                      },
                      _hover: { bg: "blackAlpha.50" },
                      onClick: () => tableProps.onRowClick?.(row.original),
                      style: {
                        cursor: "pointer",
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
                          aria-label="Actions"
                          className="!h-auto relative z-10 p-2.5"
                          variant="ghost"
                        >
                          <EllipsisVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {tableProps.onMenuClick.map(
                          ({ icon, text, onClick, isDestructive }) => {
                            return (
                              <DropdownMenuItem
                                className={cn(
                                  "min-w-[170px] cursor-pointer gap-3 px-3 py-3",
                                  isDestructive && "!text-destructive-text",
                                )}
                                key={text}
                                onClick={() => onClick(row.original)}
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
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-4 py-4">
              <p className="text-muted-foreground text-sm">
                No {pluralize(tableProps.title, 0, false)} found
              </p>
            </div>
          </div>
        )}

      <ShowMoreButton
        pageSize={tableProps.showMore?.pageSize || -1}
        setShowMoreLimit={setShowMoreLimit}
        shouldShowLess={
          !!tableProps.showMore?.showLess &&
          slicedData.length > tableProps.showMore.pageSize
        }
        shouldShowMore={slicedData.length < tableProps.data.length}
        showMoreLimit={showMoreLimit}
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
              onClick={() => setShowMoreLimit(showMoreLimit + pageSize)}
              size="sm"
              variant="ghost"
            >
              Show more
            </Button>
          )}
          {shouldShowLess && (
            <Button
              onClick={() => setShowMoreLimit(newShowLess)}
              size="sm"
              variant="ghost"
            >
              Show Less
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
