"use client";

import type {
  BillingBillingPortalAction,
  BillingPortalOptions,
  RedirectBillingCheckoutAction,
  RedirectCheckoutOptions,
} from "../actions/billing";
import { Button, type ButtonProps } from "./ui/button";

type CheckoutButtonProps = Omit<RedirectCheckoutOptions, "redirectUrl"> &
  ButtonProps & {
    redirectPath: string;
    redirectToCheckout: RedirectBillingCheckoutAction;
  };

export function CheckoutButton({
  onClick,
  teamSlug,
  sku,
  metadata,
  redirectPath,
  children,
  redirectToCheckout,
  ...restProps
}: CheckoutButtonProps) {
  return (
    <Button
      {...restProps}
      onClick={async (e) => {
        onClick?.(e);
        await redirectToCheckout({
          teamSlug,
          sku,
          metadata,
          redirectUrl: getRedirectUrl(redirectPath),
        });
      }}
    >
      {children}
    </Button>
  );
}

type BillingPortalButtonProps = Omit<BillingPortalOptions, "redirectUrl"> &
  ButtonProps & {
    redirectPath: string;
    redirectToBillingPortal: BillingBillingPortalAction;
  };

export function BillingPortalButton({
  onClick,
  teamSlug,
  redirectPath,
  children,
  redirectToBillingPortal,
  ...restProps
}: BillingPortalButtonProps) {
  return (
    <Button
      {...restProps}
      onClick={async (e) => {
        onClick?.(e);
        await redirectToBillingPortal({
          teamSlug,
          redirectUrl: getRedirectUrl(redirectPath),
        });
      }}
    >
      {children}
    </Button>
  );
}

function getRedirectUrl(path: string) {
  const url = new URL(window.location.origin);
  url.pathname = path;
  return url.toString();
}
