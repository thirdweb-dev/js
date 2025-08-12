import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
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

export function AirdropCSVTable(props: {
  data: { address: string; quantity: string; isValid?: boolean }[];
}) {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(props.data.length / pageSize);
  const paginatedData = props.data.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return (
    <div className="border rounded-lg">
      <TableContainer className="border-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.address}>
                <TableCell>
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      !row.isValid && "text-red-500",
                    )}
                  >
                    {row.address}
                    {!row.isValid && (
                      <AlertCircleIcon className="size-4 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{row.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <div className="border-t py-4">
          <PaginationButtons
            activePage={page}
            totalPages={totalPages}
            onPageClick={setPage}
          />
        </div>
      )}
    </div>
  );
}
