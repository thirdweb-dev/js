import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  type ColumnDef,
  type PaginationState,
  type TableOptions,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import pluralize from "pluralize";
import { type SetStateAction, useMemo, useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";
import type { IconType } from "react-icons/lib";

type CtaMenuItem<TRowData> = {
  icon?: IconType;
  text: string;
  onClick: (row: TRowData) => void;
  isDestructive?: boolean;
};

type TWTableProps<TRowData> = {
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  columns: ColumnDef<TRowData, any>[];
  data: TRowData[];
  isLoading: boolean;
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
    <ScrollShadow className="border border-border rounded-lg overflow-hidden">
      <table className="w-full border-collapse tabular-nums lining-nums align-top">
        <thead className="bg-muted/50 border-b border-border">
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center gap-2 ">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {/* TODO add fitlering? */}
                      {/* {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null} */}
                    </div>
                  )}
                </Th>
              ))}
              {(tableProps.onRowClick || tableProps.onMenuClick) && (
                <Th className="w-0" />
              )}
            </Tr>
          ))}
        </thead>

        <tbody className="bg-background">
          {table.getRowModel().rows.map((row) => {
            return (
              <Tr
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
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Td>
                  );
                })}

                {/* Show a ... menu or individual CTA buttons. */}
                {tableProps.onRowClick ? (
                  <Td className="text-end">
                    <FiArrowRight className="size-4" />
                  </Td>
                ) : tableProps.onMenuClick ? (
                  <Td className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          aria-label="Actions"
                          className="relative z-10 p-2.5 !h-auto"
                        >
                          <FaEllipsisVertical className="size-4" />
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
                                  "gap-3 px-3 py-3 min-w-[170px] cursor-pointer",
                                  isDestructive && "!text-destructive-text",
                                )}
                              >
                                {icon?.({ className: "size-4" })}
                                {text}
                              </DropdownMenuItem>
                            );
                          },
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Td>
                ) : null}
              </Tr>
            );
          })}
        </tbody>
      </table>

      {tableProps.isLoading && (
        <div className="flex items-center justify-center">
          <div className="flex py-4 gap-4 items-center">
            <Spinner className="size-4" />
            <p className="text-muted-foreground text-sm">
              Loading {pluralize(tableProps.title, 0, false)}
            </p>
          </div>
        </div>
      )}

      {!tableProps.isLoading &&
        tableProps.data.length === 0 &&
        tableProps.isFetched && (
          <div className="flex items-center justify-center">
            <div className="flex py-4 gap-4 items-center">
              <p className="text-muted-foreground text-sm">
                {" "}
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
    </ScrollShadow>
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
        <div className="gap-2 flex items-center">
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

const Th = (props: React.ThHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <th
      {...props}
      className={cn(
        "border-none px-6 py-4 uppercase font-medium text-muted-foreground tracking-wider text-xs text-start",
        props.className,
      )}
    />
  );
};

const Tr = (props: React.HTMLAttributes<HTMLTableRowElement>) => {
  return (
    <tr
      {...props}
      className={cn("border-b border-border last:border-0", props.className)}
    />
  );
};

const Td = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <td
      {...props}
      className={cn(
        "px-6 py-3 text-sm text-start items-center",
        props.className,
      )}
    />
  );
};
