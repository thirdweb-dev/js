"use client";

import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import ConfigureSplit from "./ConfigureSplitFees";

export function SplitFeesCard(props: {
  splitWallet: string;
  recipients: readonly string[];
  allocations: readonly bigint[];
  controller: string;
  referenceContract: ThirdwebContract;
}) {
  const account = useActiveAccount();
  const isController = props.controller === account?.address;
  const router = useRouter();

  const columns: ColumnDef<{ allocation: number; recipient: string }>[] = [
    {
      accessorKey: "recipient",
      header: "Recipient",
    },
    {
      accessorKey: "allocation",
      header: "Percentage",
    },
  ];

  const totalAllocation = props.allocations.reduce(
    (acc, curr) => acc + curr,
    0n,
  );
  const data = useMemo(
    () =>
      props.recipients.map((recipient, i) => ({
        recipient: recipient,
        allocation:
          (Number(props.allocations[i] || 0n) / Number(totalAllocation)) * 100,
      })),
    [props.recipients, props.allocations, totalAllocation],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="rounded-lg border border-border bg-muted/50">
      {/* Header */}
      <div className="relative p-4 lg:p-6">
        {/* Title */}
        <div className="pr-14">
          <h3 className="mb-1 gap-2 font-semibold text-xl tracking-tight">
            Split Fees
            {/* Info Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute top-4 right-4 h-auto w-auto p-2 text-muted-foreground"
                >
                  <InfoIcon className="size-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Split Fees Contract</DialogTitle>
                  <DialogDescription>
                    This contract holds the funds that are split between the
                    recipients.
                  </DialogDescription>

                  {/* Avoid adding focus on other elements to prevent tooltips from opening on modal open */}
                  <input className="sr-only" aria-hidden />

                  <div className="h-2" />

                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="mb-1 text-muted-foreground text-sm">
                        Split Fees
                      </p>
                      <CopyAddressButton
                        className="text-xs"
                        address={props.splitWallet}
                        copyIconPosition="left"
                        variant="outline"
                      />
                    </div>

                    <div>
                      <p className="text-muted-foreground text-sm">
                        Controller
                      </p>
                      <WalletAddress address={props.controller} />
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </h3>
        </div>

        <div className="h-5" />

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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="flex flex-row justify-end gap-3 border-border border-t p-4 lg:p-6">
        <ConfigureSplit
          splitWallet={props.splitWallet}
          referenceContract={props.referenceContract}
          postSplitConfigure={(_splitWallet: string) => router.refresh()}
        >
          <Button size="sm" className="min-w-24 gap-2" disabled={!isController}>
            Update
          </Button>
        </ConfigureSplit>
      </div>
    </section>
  );
}
