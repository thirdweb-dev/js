"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { Team } from "@/api/team/get-team";

const stripePromise = loadStripe(
  // biome-ignore lint/style/noNonNullAssertion: TODO: fix this later
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export function GrowthPlanCheckout(props: {
  team: Team;
  fetchClientSecret: (team: Team) => Promise<string>;
}) {
  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret: () => props.fetchClientSecret(props.team),
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
