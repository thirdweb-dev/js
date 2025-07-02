"use client";
import { useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import { shortenLargeNumber } from "thirdweb/utils";
import type { InsightEndpointStats } from "@/api/analytics";
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
import { CardHeading } from "../../universal-bridge/components/common";

export function TopInsightEndpointsTable(props: {
  data: InsightEndpointStats[];
  client: ThirdwebClient;
}) {
  const tableData = useMemo(() => {
    return props.data?.sort((a, b) => b.totalRequests - a.totalRequests);
  }, [props.data]);
  const isEmpty = useMemo(() => tableData.length === 0, [tableData]);

  return (
    <div className="flex flex-col">
      {/* header */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <CardHeading>Top Endpoints</CardHeading>
      </div>

      <div className="h-5" />
      <TableContainer scrollableContainerClassName="h-[280px]">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead>Endpoint</TableHead>
              <TableHead>Requests</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((endpoint, i) => {
              return (
                <EndpointTableRow
                  client={props.client}
                  endpoint={endpoint}
                  key={endpoint.endpoint}
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
    </div>
  );
}

function EndpointTableRow(props: {
  endpoint?: {
    endpoint: string;
    totalRequests: number;
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
          loadedData={props.endpoint?.endpoint}
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
          loadedData={props.endpoint?.totalRequests}
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
