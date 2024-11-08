"use client";

import { Badge } from "@/components/ui/badge";
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
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export type CrossChain = {
  id: number;
  network: string;
  chainId: number;
  status: "DEPLOYED" | "NOT_DEPLOYED";
};

const columns: ColumnDef<CrossChain>[] = [
  {
    accessorKey: "network",
    header: "Network",
  },
  {
    accessorKey: "chainId",
    header: "Chain ID",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      if (row.getValue("status") === "DEPLOYED") {
        return <Badge variant="success">Deployed</Badge>;
      }
      return <Button>Deploy</Button>;
    },
  },
];

export function DataTable({ data }: { data: CrossChain[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
