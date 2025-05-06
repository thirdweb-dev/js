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
  ChevronLeftIcon,
  ChevronRightIcon,
  CreditCardIcon,
  DownloadIcon,
  ReceiptIcon,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { useTransition } from "react";
import type Stripe from "stripe";
import { searchParams } from "../search-params";

export function BillingHistory(props: {
  invoices: Stripe.Invoice[];
  status: "all" | "past_due" | "open";
  hasMore: boolean;
}) {
  const [isLoading, startTransition] = useTransition();
  const [cursor, setCursor] = useQueryState(
    "cursor",
    searchParams.cursor.withOptions({
      startTransition,
      history: "push",
      shallow: false,
    }),
  );

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (invoice: Stripe.Invoice) => {
    switch (invoice.status) {
      case "paid":
        return <Badge variant="success">Paid</Badge>;
      case "open":
      // we treate "uncollectible" as unpaid
      case "uncollectible": {
        // if the invoice due date is in the past, we want to display it as past due
        if (invoice.due_date && invoice.due_date < Date.now()) {
          return <Badge variant="destructive">Past Due</Badge>;
        }
        return <Badge variant="outline">Open</Badge>;
      }
      case "void":
        return <Badge variant="secondary">Void</Badge>;

      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (props.invoices.length === 0) {
    if (props.status === "open") {
      return (
        <div className="py-6 text-center">
          <ReceiptIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 font-medium text-lg">No open invoices</h3>
        </div>
      );
    }
    return (
      <div className="py-6 text-center">
        <ReceiptIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 font-medium text-lg">No billing history</h3>
        <p className="mt-1 text-muted-foreground text-sm">
          Your invoice history will appear here once you have made payments.
        </p>
      </div>
    );
  }

  const showPagination = props.hasMore || cursor;

  return (
    <div>
      <TableContainer className="rounded-none border-x-0 border-b-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">#{invoice.number}</TableCell>
                <TableCell>{formatDate(invoice.created)}</TableCell>
                <TableCell>
                  {invoice.status === "paid"
                    ? formatCurrency(invoice.amount_paid, invoice.currency)
                    : formatCurrency(invoice.amount_due, invoice.currency)}
                </TableCell>
                <TableCell>{getStatusBadge(invoice)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {invoice.status === "open" &&
                      invoice.hosted_invoice_url && (
                        <Button variant="default" size="sm" asChild>
                          <a
                            href={invoice.hosted_invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <CreditCardIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            Pay Now
                          </a>
                        </Button>
                      )}

                    {invoice.invoice_pdf && (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={invoice.invoice_pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <DownloadIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          PDF
                        </a>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showPagination && (
        <div className="flex items-center justify-between border-t p-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // use browser history to go back
              // this is KINDA hacky but it works (as long as the user doesn't send the URL to someone else...)
              window.history.back();
            }}
            disabled={isLoading || !cursor}
          >
            {isLoading ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
            )}
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const lastInvoice = props.invoices[props.invoices.length - 1];
              if (lastInvoice && props.hasMore) {
                setCursor(lastInvoice.id);
              }
            }}
            disabled={!props.hasMore || isLoading}
          >
            Next
            {isLoading && props.hasMore ? (
              <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
