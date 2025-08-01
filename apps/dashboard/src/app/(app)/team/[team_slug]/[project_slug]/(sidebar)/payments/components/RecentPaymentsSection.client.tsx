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
import { Skeleton } from "@/components/ui/skeleton";
import { TableData, TableHeading, TableHeadingRow } from "./common";
import { EmptyState } from "./EmptyState";
import { TableRow } from "./PaymentsTableRow";

export function RecentPaymentsSection(props: {
  client: ThirdwebClient;
  projectClientId: string;
  teamSlug: string;
  projectSlug: string;
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
                <TableHeading>Sent</TableHeading>
                <TableHeading>Received</TableHeading>
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
        <EmptyState
          icon={CreditCardIcon}
          title="No payments yet"
          description="Start accepting crypto payments with payment links, prebuilt components, or custom branded experiences."
          buttons={[
            <Button
              key="create-payment-link"
              variant="default"
              size="sm"
              className="flex items-center gap-2"
              asChild
            >
              <Link
                href={`/team/${props.teamSlug}/${props.projectSlug}/payments/links`}
              >
                Create Payment Link
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>,
            <Button key="documentation" asChild variant="outline" size="sm">
              <Link href="https://portal.thirdweb.com/payments" target="_blank">
                View Documentation
              </Link>
            </Button>,
          ]}
        />
      )}
    </section>
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
