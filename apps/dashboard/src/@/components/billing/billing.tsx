"use client";
import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";
import type { Team } from "@/api/team/get-team";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductSKU } from "@/types/billing";
import {
  buildBillingPortalUrl,
  buildCheckoutUrl,
} from "@/utils/stripe/build-url";

export function CheckoutButton(props: {
  buttonProps?: Omit<ButtonProps, "children">;
  children: React.ReactNode;
  billingStatus: Team["billingStatus"];
  teamSlug: string;
  sku: Exclude<ProductSKU, null>;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      {/* show warning if the team has an invalid payment method */}
      {props.billingStatus === "invalidPayment" && (
        <BillingWarning teamSlug={props.teamSlug} />
      )}
      <Button
        {...props.buttonProps}
        asChild
        className={cn(props.buttonProps?.className, "w-full gap-2")}
        disabled={
          // disable button if the team has an invalid payment method
          // api will return 402 error if the team has an invalid payment method
          props.billingStatus === "invalidPayment" ||
          props.buttonProps?.disabled
        }
        onClick={async (e) => {
          props.buttonProps?.onClick?.(e);
        }}
      >
        <Link
          href={buildCheckoutUrl({
            sku: props.sku,
            teamSlug: props.teamSlug,
          })}
          rel="noopener noreferrer"
          target="_blank"
        >
          {props.children}
        </Link>
      </Button>
    </div>
  );
}

function BillingWarning({ teamSlug }: { teamSlug: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-700/50 dark:bg-amber-900/30 dark:text-amber-400">
      <AlertTriangleIcon className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm">
        You have outstanding invoices. Please{" "}
        <Link
          className="font-medium text-amber-700 underline transition-colors hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
          href={`/team/${teamSlug}/~/billing/invoices?status=open`}
        >
          pay them
        </Link>{" "}
        to continue.
      </p>
    </div>
  );
}

export function BillingPortalButton(props: {
  teamSlug: string;
  buttonProps?: Omit<ButtonProps, "children">;
  children: React.ReactNode;
}) {
  return (
    <Button
      {...props.buttonProps}
      asChild
      className={cn(props.buttonProps?.className, "gap-2")}
      disabled={props.buttonProps?.disabled}
      onClick={async (e) => {
        props.buttonProps?.onClick?.(e);
      }}
    >
      <a
        href={buildBillingPortalUrl({ teamSlug: props.teamSlug })}
        rel="noopener noreferrer"
        target="_blank"
      >
        {props.children}
      </a>
    </Button>
  );
}
