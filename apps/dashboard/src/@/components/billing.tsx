"use client";

import {
  type BillingPortalOptions,
  type RedirectCheckoutOptions,
  redirectToBillingPortal,
  redirectToCheckout,
} from "../actions/billing";
import { Button, type ButtonProps } from "./ui/button";

type CheckoutButtonProps = RedirectCheckoutOptions & ButtonProps;
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
          redirectPath,
        });
      }}
    >
      {children}
    </Button>
  );
}

type BillingPortalButtonProps = BillingPortalOptions & ButtonProps;
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
          redirectPath,
        });
      }}
    >
      {children}
    </Button>
  );
}
