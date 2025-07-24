"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRightIcon, CreditCardIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  getPayments,
  type PaymentsResponse,
} from "@/api/universal-bridge/developer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TableHeading, TableHeadingRow } from "./common";
import { SkeletonTableRow, TableRow } from "./PaymentHistory";

export function RecentPaymentsSection(props: {
  client: ThirdwebClient;
  projectClientId: string;
  teamId: string;
}) {
  const { data: payPurchaseData, isLoading } = useQuery<
    PaymentsResponse,
    Error
  >({
    queryFn: async () => {
      const res = await getPayments({
        clientId: props.projectClientId,
        limit: 10,
        offset: 0,
        teamId: props.teamId,
      });
      return res;
    },
    queryKey: ["recent-payments", props.projectClientId],
    refetchInterval: 10_000,
  });
  const isEmpty = useMemo(
    () => !payPurchaseData?.data.length,
    [payPurchaseData],
  );
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-semibold text-xl tracking-tight">
          Recent Payments
        </h2>
        <p className="text-muted-foreground text-sm">
          The latest payments from your project.
        </p>
      </div>
      {!isEmpty || isLoading ? (
        <Card className="overflow-hidden">
          <table className="w-full selection:bg-inverted selection:text-inverted-foreground ">
            <thead>
              <TableHeadingRow>
                <TableHeading> Sent </TableHeading>
                <TableHeading> Received </TableHeading>
                <TableHeading>Type</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading>Recipient</TableHeading>
                <TableHeading>Date</TableHeading>
              </TableHeadingRow>
            </thead>
            <tbody>
              {payPurchaseData && !isLoading
                ? payPurchaseData.data.map((purchase) => {
                    return (
                      <TableRow
                        client={props.client}
                        key={purchase.id}
                        purchase={purchase}
                      />
                    );
                  })
                : new Array(10).fill(0).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: ok
                    <SkeletonTableRow key={i} />
                  ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <Card className="flex flex-col p-16 gap-8 items-center justify-center">
          <div className="bg-violet-800/25 text-muted-foreground rounded-full size-16 flex items-center justify-center">
            <CreditCardIcon className="size-8 text-violet-500" />
          </div>
          <div className="flex flex-col gap-1 items-center text-center">
            <h3 className="text-foreground font-medium text-xl">
              No payments yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Start accepting crypto payments with payment links, prebuilt
              components, or custom branded experiences.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-2"
              asChild
            >
              <Link href="/pay" target="_blank">
                Create Payment Link
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="https://portal.thirdweb.com/payments" target="_blank">
                View Documentation
              </Link>
            </Button>
          </div>
        </Card>
      )}
    </section>
  );
}
