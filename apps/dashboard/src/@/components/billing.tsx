"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type {
  GetBillingCheckoutUrlAction,
  GetBillingCheckoutUrlOptions,
  GetBillingPortalUrlAction,
  GetBillingPortalUrlOptions,
} from "../actions/billing";
import type { Team } from "../api/team";
import { cn } from "../lib/utils";
import { Spinner } from "./ui/Spinner/Spinner";
import { Button, type ButtonProps } from "./ui/button";

type CheckoutButtonProps = Omit<GetBillingCheckoutUrlOptions, "redirectUrl"> & {
  getBillingCheckoutUrl: GetBillingCheckoutUrlAction;
  buttonProps?: Omit<ButtonProps, "children">;
  children: React.ReactNode;
  billingStatus: Team["billingStatus"];
};

export function CheckoutButton({
  teamSlug,
  sku,
  metadata,
  getBillingCheckoutUrl,
  children,
  buttonProps,
  billingStatus,
}: CheckoutButtonProps) {
  const getUrlMutation = useMutation({
    mutationFn: async () => {
      return getBillingCheckoutUrl({
        teamSlug,
        sku,
        metadata,
        redirectUrl: getAbsoluteUrl("/stripe-redirect"),
      });
    },
  });

  const errorMessage = "Failed to open checkout page";

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {/* show warning if the team has an invalid payment method */}
      {billingStatus === "invalidPayment" && (
        <BillingWarning teamSlug={teamSlug} />
      )}
      <Button
        {...buttonProps}
        className={cn(buttonProps?.className, "w-full gap-2")}
        disabled={
          // disable button if the team has an invalid payment method
          // api will return 402 error if the team has an invalid payment method
          billingStatus === "invalidPayment" ||
          getUrlMutation.isPending ||
          buttonProps?.disabled
        }
        onClick={async (e) => {
          buttonProps?.onClick?.(e);
          getUrlMutation.mutate(undefined, {
            onSuccess: (res) => {
              if (!res.url) {
                toast.error(errorMessage);
                return;
              }

              const tab = window.open(res.url, "_blank");

              if (!tab) {
                toast.error(errorMessage);
                return;
              }
            },
            onError: () => {
              toast.error(errorMessage);
            },
          });
        }}
      >
        {getUrlMutation.isPending && <Spinner className="size-4" />}
        {children}
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
          href={`/team/${teamSlug}/~/settings/invoices?status=open`}
          className="font-medium text-amber-700 underline transition-colors hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
        >
          pay them
        </Link>{" "}
        to continue.
      </p>
    </div>
  );
}

type BillingPortalButtonProps = Omit<
  GetBillingPortalUrlOptions,
  "redirectUrl"
> & {
  getBillingPortalUrl: GetBillingPortalUrlAction;
  buttonProps?: Omit<ButtonProps, "children">;
  children: React.ReactNode;
};

export function BillingPortalButton({
  teamSlug,
  children,
  getBillingPortalUrl,
  buttonProps,
}: BillingPortalButtonProps) {
  const getUrlMutation = useMutation({
    mutationFn: async () => {
      return getBillingPortalUrl({
        teamSlug,
        redirectUrl: getAbsoluteUrl("/stripe-redirect"),
      });
    },
  });

  const errorMessage = "Failed to open billing portal";

  return (
    <Button
      {...buttonProps}
      className={cn(buttonProps?.className, "gap-2")}
      disabled={getUrlMutation.isPending || buttonProps?.disabled}
      onClick={async (e) => {
        buttonProps?.onClick?.(e);
        getUrlMutation.mutate(undefined, {
          onSuccess(res) {
            if (!res.url) {
              toast.error(errorMessage);
              return;
            }

            const tab = window.open(res.url, "_blank");
            if (!tab) {
              toast.error(errorMessage);
              return;
            }
          },
          onError: () => {
            toast.error(errorMessage);
          },
        });
      }}
    >
      {getUrlMutation.isPending && <Spinner className="size-4" />}
      {children}
    </Button>
  );
}

function getAbsoluteUrl(path: string) {
  const url = new URL(window.location.origin);
  url.pathname = path;
  return url.toString();
}
