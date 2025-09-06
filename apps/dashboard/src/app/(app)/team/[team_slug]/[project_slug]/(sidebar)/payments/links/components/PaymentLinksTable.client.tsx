"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, TrashIcon } from "lucide-react";
import { type PropsWithChildren, useState } from "react";
import { toast } from "sonner";
import { toTokens } from "thirdweb";
import {
  deletePaymentLink,
  getPaymentLinks,
  getPayments,
} from "@/api/universal-bridge/developer";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/CopyButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { TableData } from "../../components/common";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { formatTokenAmount } from "../../components/format";
import { CreatePaymentLinkButton } from "./CreatePaymentLinkButton.client";

export function PaymentLinksTable(props: { clientId: string; teamId: string }) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-semibold text-xl tracking-tight">Your Payments</h2>
        <p className="text-muted-foreground text-sm">
          The payments you have created in this project
        </p>
      </div>
      <PaymentLinksTableInner clientId={props.clientId} teamId={props.teamId} />
    </section>
  );
}

function PaymentLinksTableInner(props: { clientId: string; teamId: string }) {
  const paymentLinksQuery = useQuery({
    queryFn: async () => {
      return getPaymentLinks({
        clientId: props.clientId,
        teamId: props.teamId,
      });
    },
    queryKey: ["payment-links", props.clientId, props.teamId],
  });

  const paymentLinkUsagesQuery = useQuery({
    queryFn: async () => {
      const paymentLinks = paymentLinksQuery.data || [];
      return await Promise.all(
        paymentLinks.map(async (paymentLink) => {
          const { data } = await getPayments({
            clientId: props.clientId,
            teamId: props.teamId,
            paymentLinkId: paymentLink.id,
          });
          return {
            paymentLink,
            usages: data,
          };
        }),
      );
    },
    queryKey: [
      "payment-link-usages",
      paymentLinksQuery.dataUpdatedAt,
      props.clientId,
      props.teamId,
    ],
  });

  const client = getClientThirdwebClient();

  if (paymentLinksQuery.error) {
    return (
      <ErrorState
        title="That wasn't supposed to happen!"
        description={paymentLinksQuery.error.message}
        buttons={[
          <Button
            key="try-again"
            variant="default"
            size="sm"
            onClick={() => paymentLinksQuery.refetch()}
          >
            Retry
          </Button>,
        ]}
      />
    );
  }

  if (!paymentLinksQuery.isLoading && paymentLinksQuery.data?.length === 0) {
    return (
      <EmptyState
        title="No payments configured yet"
        description="Create a payment to receive any token in seconds."
        buttons={[
          <CreatePaymentLinkButton
            key="create-payment-link"
            clientId={props.clientId}
            teamId={props.teamId}
          >
            <Button className="gap-2 rounded-full" variant="default" size="sm">
              <PlusIcon className="size-4" />
              Create Payment
            </Button>
          </CreatePaymentLinkButton>,
        ]}
      />
    );
  }

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Usages</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentLinksQuery.data && !paymentLinksQuery.isLoading
              ? paymentLinksQuery.data.map((paymentLink) => (
                  <TableRow key={paymentLink.id}>
                    <TableCell className="font-medium">
                      {paymentLink.title}
                    </TableCell>
                    <TableCell>
                      <WalletAddress
                        address={paymentLink.receiver}
                        shortenAddress
                        client={client}
                      />
                    </TableCell>
                    <TableCell>
                      {formatTokenAmount(
                        toTokens(
                          paymentLink.amount,
                          paymentLink.destinationToken.decimals,
                        ),
                      )}{" "}
                      {paymentLink.destinationToken.symbol}
                    </TableCell>
                    <TableCell>
                      {paymentLinkUsagesQuery.isLoading ? (
                        <Skeleton className="h-7 w-8" />
                      ) : (
                        paymentLinkUsagesQuery.data?.find(
                          (x) => x.paymentLink.id === paymentLink.id,
                        )?.usages?.length || 0
                      )}
                    </TableCell>
                    <TableCell>
                      {paymentLinkUsagesQuery.isLoading ? (
                        <Skeleton className="h-7 w-20" />
                      ) : (
                        `${(
                          paymentLinkUsagesQuery.data
                            ?.find((x) => x.paymentLink.id === paymentLink.id)
                            ?.usages?.reduce(
                              (acc, curr) =>
                                acc +
                                Number(
                                  toTokens(
                                    BigInt(curr.destinationAmount),
                                    curr.destinationToken.decimals,
                                  ),
                                ),
                              0,
                            ) || 0
                        ).toString()} ${paymentLink.destinationToken.symbol}`
                      )}
                    </TableCell>
                    <TableCell>
                      <CopyButton
                        tooltip={false}
                        label="Copy"
                        variant="ghost"
                        text={paymentLink.link}
                        iconClassName="size-3.5"
                        className="-translate-x-2"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <DeletePaymentLinkButton
                        clientId={props.clientId}
                        teamId={props.teamId}
                        paymentLinkId={paymentLink.id}
                      >
                        <Button size="icon" variant="ghost">
                          <TrashIcon className="size-4" strokeWidth={1} />
                        </Button>
                      </DeletePaymentLinkButton>
                    </TableCell>
                  </TableRow>
                ))
              : new Array(10).fill(0).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: ok
                  <SkeletonTableRow key={i} />
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function SkeletonTableRow() {
  return (
    <tr className="border-border border-b">
      <TableData>
        <Skeleton className="h-7 w-20" />
      </TableData>
      <TableData>
        <Skeleton className="h-7 w-20" />
      </TableData>
      <TableData>
        <Skeleton className="h-7 w-20 rounded-2xl" />
      </TableData>
      <TableData>
        <Skeleton className="h-7 w-20 rounded-2xl" />
      </TableData>
      <TableData>
        <Skeleton className="h-7 w-[140px]" />
      </TableData>
      <TableData>
        <Skeleton className="h-7 w-[200px]" />
      </TableData>
    </tr>
  );
}

function DeletePaymentLinkButton(
  props: PropsWithChildren<{
    paymentLinkId: string;
    clientId: string;
    teamId: string;
  }>,
) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deletePaymentLink({
        clientId: props.clientId,
        teamId: props.teamId,
        paymentLinkId: id,
      });
      return null;
    },
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            payment.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            className="gap-2"
            disabled={deleteMutation.isPending}
            onClick={() => {
              deleteMutation.mutateAsync(props.paymentLinkId, {
                onError(err) {
                  toast.error("Failed to delete payment link.", {
                    description: err instanceof Error ? err.message : undefined,
                  });
                },
                onSuccess: () => {
                  toast.success("Payment deleted successfully.");
                  setOpen(false);
                  return queryClient.invalidateQueries({
                    queryKey: ["payment-links", props.clientId, props.teamId],
                  });
                },
              });
            }}
            variant="destructive"
          >
            Delete Webhook
            {deleteMutation.isPending && <Spinner className="size-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
