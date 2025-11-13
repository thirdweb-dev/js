"use client";
import { useMemo, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { shortenLargeNumber } from "thirdweb/utils";
import type { RpcMethodStats } from "@/api/analytics";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { Card } from "@/components/ui/card";
import { SkeletonContainer } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardHeading } from "../../../payments/components/common";

export function TopRPCMethodsTable(props: {
  data: RpcMethodStats[];
  client: ThirdwebClient;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const sortedData = useMemo(() => {
    return props.data?.sort((a, b) => b.count - a.count) || [];
  }, [props.data]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedData.length / itemsPerPage);
  }, [sortedData.length]);

  const tableData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage]);

  const isEmpty = useMemo(() => sortedData.length === 0, [sortedData]);

  return (
    <Card className="relative flex flex-col rounded-xl border border-border bg-card p-4">
      {/* header */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <CardHeading>Top EVM Methods Called </CardHeading>
      </div>

      <div className="h-5" />
      <TableContainer scrollableContainerClassName="h-[280px]">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead>Method</TableHead>
              <TableHead>Requests</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((method, i) => {
              return (
                <MethodTableRow
                  client={props.client}
                  key={method.evmMethod}
                  method={method}
                  rowIndex={i}
                />
              );
            })}
          </TableBody>
        </Table>
        {isEmpty && (
          <div className="flex min-h-[240px] w-full items-center justify-center text-muted-foreground text-sm">
            No data available
          </div>
        )}
      </TableContainer>

      {!isEmpty && totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <PaginationButtons
            activePage={currentPage}
            onPageClick={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </Card>
  );
}

function MethodTableRow(props: {
  method?: {
    evmMethod: string;
    count: number;
  };
  client: ThirdwebClient;
  rowIndex: number;
}) {
  const delayAnim = {
    animationDelay: `${props.rowIndex * 100}ms`,
  };

  return (
    <TableRow>
      <TableCell>
        <SkeletonContainer
          className="inline-flex"
          loadedData={props.method?.evmMethod}
          render={(v) => (
            <p className={"truncate max-w-[280px]"} title={v}>
              {v}
            </p>
          )}
          skeletonData="..."
          style={delayAnim}
        />
      </TableCell>
      <TableCell>
        <SkeletonContainer
          className="inline-flex"
          loadedData={props.method?.count}
          render={(v) => {
            return <p>{shortenLargeNumber(v)}</p>;
          }}
          skeletonData={0}
          style={delayAnim}
        />
      </TableCell>
    </TableRow>
  );
}
