"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRightIcon, DollarSignIcon } from "lucide-react";
import Link from "next/link";
import { Suspense, use, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

const predefinedAmounts = [
  { value: "25", label: "$25" },
  { value: "100", label: "$100" },
  { value: "500", label: "$500" },
  { value: "1000", label: "$1,000" },
] as const;

interface CreditBalanceSectionProps {
  balancePromise: Promise<number>;
  teamSlug: string;
}

export function CreditBalanceSection({
  balancePromise,
  teamSlug,
}: CreditBalanceSectionProps) {
  const [selectedAmount, setSelectedAmount] = useState<string>(
    predefinedAmounts[0].value,
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Credit Balance
        </CardTitle>
        <CardDescription className="mt-2">
          Your credit balance automatically applies to all invoices before your
          default payment method is charged.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance */}
        <ErrorBoundary fallback={<CurrentBalanceErrorBoundary />}>
          <Suspense fallback={<CurrentBalanceSkeleton />}>
            <CurrentBalance balancePromise={balancePromise} />
          </Suspense>
        </ErrorBoundary>

        <Separator />
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Top Up Credits</h3>
          <p className="text-muted-foreground text-sm">
            Add credits to your account for future billing cycles. Credits are
            non-refundable and do not expire.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Amount Selection */}
          <div className="space-y-4 lg:col-span-2">
            <Label className="font-medium text-base">Select Amount</Label>
            <RadioGroup
              value={selectedAmount}
              onValueChange={setSelectedAmount}
              className="grid grid-cols-4 gap-3"
            >
              {predefinedAmounts.map((amount) => (
                <div key={amount.value}>
                  <RadioGroupItem
                    value={amount.value}
                    id={amount.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={amount.value}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 transition-colors hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="font-semibold text-lg">
                      {amount.label}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Top-up Summary and Button */}
          <div className="space-y-4">
            <ErrorBoundary
              fallback={
                <TopUpSummaryErrorBoundary selectedAmount={selectedAmount} />
              }
            >
              <Suspense
                fallback={
                  <TopUpSummarySkeleton selectedAmount={selectedAmount} />
                }
              >
                <TopUpSummary
                  selectedAmount={selectedAmount}
                  currentBalancePromise={balancePromise}
                />
              </Suspense>
            </ErrorBoundary>

            <Button asChild className="w-full" size="lg">
              <Link
                href={`/checkout/${teamSlug}/topup?amount=${selectedAmount}`}
                prefetch={false}
                target="_blank"
              >
                Top Up Credits
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CurrentBalance({
  balancePromise,
}: { balancePromise: Promise<number> }) {
  const currentBalance = use(balancePromise);

  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
      <div className="flex items-center gap-2">
        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">Current Credit Balance</span>
      </div>
      <span className="font-semibold text-lg">{formatUsd(currentBalance)}</span>
    </div>
  );
}

function CurrentBalanceSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
      <div className="flex items-center gap-2">
        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">Current Credit Balance</span>
      </div>
      <Skeleton className="h-6 w-24" />
    </div>
  );
}
function CurrentBalanceErrorBoundary() {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
      <div className="flex items-center gap-2">
        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">Current Credit Balance</span>
      </div>
      <span className="text-destructive-text text-sm">
        Failed to load current credit balance, please try again later.
      </span>
    </div>
  );
}

function TopUpSummary({
  selectedAmount,
  currentBalancePromise,
}: {
  selectedAmount: string;
  currentBalancePromise: Promise<number>;
}) {
  const currentBalance = use(currentBalancePromise);

  return (
    <div className="space-y-3 rounded-lg bg-muted/30 p-4">
      <h3 className="font-medium text-sm">Summary</h3>
      <div className="flex justify-between text-sm">
        <span>Top-up amount:</span>
        <span className="font-medium">{formatUsd(Number(selectedAmount))}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>New balance:</span>
        <span className="font-medium">
          {formatUsd(currentBalance + Number(selectedAmount))}
        </span>
      </div>
    </div>
  );
}

function TopUpSummarySkeleton({
  selectedAmount,
}: {
  selectedAmount: string;
}) {
  return (
    <div className="space-y-3 rounded-lg bg-muted/30 p-4">
      <h3 className="font-medium text-sm">Summary</h3>
      <div className="flex justify-between text-sm">
        <span>Top-up amount:</span>
        <span className="font-medium">{formatUsd(Number(selectedAmount))}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>New balance:</span>
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

function TopUpSummaryErrorBoundary({
  selectedAmount,
}: {
  selectedAmount: string;
}) {
  return (
    <div className="space-y-3 rounded-lg bg-muted/30 p-4">
      <h3 className="font-medium text-sm">Summary</h3>
      <div className="flex justify-between text-sm">
        <span>Top-up amount:</span>
        <span className="font-medium">{formatUsd(Number(selectedAmount))}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>New balance:</span>
        <span className="text-destructive-text text-sm">
          Unable to calculate
        </span>
      </div>
    </div>
  );
}

// utils
function formatUsd(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
