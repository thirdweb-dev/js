"use client";

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
import { ToolTipLabel } from "@/components/ui/tooltip";
import { ThirdwebMiniLogo } from "../../../../../../../components/ThirdwebMiniLogo";
import { searchParams } from "../search-params";

export function BillingHistory(props: {
  teamSlug: string;
  invoices: Stripe.Invoice[];
  status: "all" | "past_due" | "open";
  hasMore: boolean;
  isOwnerAccount: boolean;
}) {
  const [isLoading, startTransition] = useTransition();
  const [cursor, setCursor] = useQueryState(
    "cursor",
    searchParams.cursor.withOptions({
      history: "push",
      shallow: false,
      startTransition,
    }),
  );

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      currency: currency.toUpperCase(),
      style: "currency",
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
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
        if (invoice.due_date && invoice.due_date * 1000 < Date.now()) {
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
                    {invoice.status === "open" && (
                      <>
                        {/* always show the crypto payment button */}
                        <ToolTipLabel
                          label={
                            props.isOwnerAccount
                              ? null
                              : "Only team owners can pay invoices."
                          }
                        >
                          <div>
                            <Button
                              asChild
                              disabled={!props.isOwnerAccount}
                              size="sm"
                              variant="default"
                            >
                              <a
                                href={`/checkout/${props.teamSlug}/invoice?invoice_id=${invoice.id}`}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                <ThirdwebMiniLogo className="mr-2 h-4 w-4" />
                                Pay with crypto
                              </a>
                            </Button>
                          </div>
                        </ToolTipLabel>
                        {/* if we have a hosted invoice url, show that */}
                        {invoice.hosted_invoice_url && (
                          <ToolTipLabel
                            label={
                              props.isOwnerAccount
                                ? null
                                : "Only team owners can pay invoices."
                            }
                          >
                            <div>
                              <Button
                                asChild
                                disabled={!props.isOwnerAccount}
                                size="sm"
                                variant="outline"
                              >
                                <a
                                  href={invoice.hosted_invoice_url}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  <CreditCardIcon className="mr-2 h-4 w-4" />
                                  Pay with Card
                                </a>
                              </Button>
                            </div>
                          </ToolTipLabel>
                        )}
                      </>
                    )}

                    {invoice.invoice_pdf && (
                      <Button asChild size="sm" variant="ghost">
                        <a
                          href={invoice.invoice_pdf}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <DownloadIcon className="mr-2 h-4 w-4 " />
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
            disabled={isLoading || !cursor}
            onClick={() => {
              // use browser history to go back
              // this is KINDA hacky but it works (as long as the user doesn't send the URL to someone else...)
              window.history.back();
            }}
            size="sm"
            variant="outline"
          >
            {isLoading ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
            )}
            Previous
          </Button>
          <Button
            disabled={!props.hasMore || isLoading}
            onClick={() => {
              const lastInvoice = props.invoices[props.invoices.length - 1];
              if (lastInvoice && props.hasMore) {
                setCursor(lastInvoice.id);
              }
            }}
            size="sm"
            variant="outline"
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
