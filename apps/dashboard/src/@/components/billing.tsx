"use client";

import {
  type BillingPortalOptions,
  type RedirectCheckoutOptions,
  redirectToBillingPortal,
  redirectToCheckout,
} from "../actions/billing";
import { Button, type ButtonProps } from "./ui/button";

type CheckoutButtonProps = Omit<RedirectCheckoutOptions, "redirectUrl"> &
  ButtonProps & {
    redirectPath: string;
  };

export function CheckoutButton({
  onClick,
  teamSlug,
  sku,
  metadata,
  redirectPath,
  children,
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
  };
export function BillingPortalButton({
  onClick,
  teamSlug,
  redirectPath,
  children,
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
