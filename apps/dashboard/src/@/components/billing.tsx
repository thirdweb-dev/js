"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  GetBillingCheckoutUrlAction,
  GetBillingCheckoutUrlOptions,
  GetBillingPortalUrlAction,
  GetBillingPortalUrlOptions,
} from "../actions/billing";
import { cn } from "../lib/utils";
import { Spinner } from "./ui/Spinner/Spinner";
import { Button, type ButtonProps } from "./ui/button";

type CheckoutButtonProps = Omit<GetBillingCheckoutUrlOptions, "redirectUrl"> & {
  getBillingCheckoutUrl: GetBillingCheckoutUrlAction;
  buttonProps?: Omit<ButtonProps, "children">;
  children: React.ReactNode;
};

export function CheckoutButton({
  teamSlug,
  sku,
  metadata,
  getBillingCheckoutUrl,
  children,
  buttonProps,
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
    <Button
      {...buttonProps}
      className={cn(buttonProps?.className, "gap-2")}
      disabled={getUrlMutation.isPending || buttonProps?.disabled}
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
