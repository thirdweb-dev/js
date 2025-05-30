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
import { ArrowRightIcon, DollarSignIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const predefinedAmounts = [
  { value: "25", label: "$25" },
  { value: "100", label: "$100" },
  { value: "500", label: "$500" },
  { value: "1000", label: "$1,000" },
] as const;

interface CreditTopupSectionProps {
  currentBalance: number;
  teamSlug: string;
}

export default function CreditTopupSection({
  currentBalance = 0.0,
  teamSlug,
}: CreditTopupSectionProps) {
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
          Your credit balance automatically applies to all of your subscription
          charges before your default payment method is charged.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-2">
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Current Credit Balance</span>
          </div>
          <span className="font-semibold text-lg">
            {formatUsd(currentBalance)}
          </span>
        </div>

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
            <div className="space-y-3 rounded-lg bg-muted/30 p-4">
              <h3 className="font-medium text-sm">Summary</h3>
              <div className="flex justify-between text-sm">
                <span>Top-up amount:</span>
                <span className="font-medium">
                  {formatUsd(Number(selectedAmount))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>New balance:</span>
                <span className="font-medium">
                  {formatUsd(currentBalance + Number(selectedAmount))}
                </span>
              </div>
            </div>

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

function formatUsd(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
