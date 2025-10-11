import "server-only";

import { cookies, headers } from "next/headers";
import Stripe from "stripe";
import type { Team } from "@/api/team/get-team";
import {
  GROWTH_PLAN_SKU,
  PAYMENT_METHOD_CONFIGURATION,
  STRIPE_SECRET_KEY,
} from "@/constants/server-envs";

let existingStripe: Stripe | undefined;

function getStripe() {
  if (!existingStripe) {
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    existingStripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });
  }

  return existingStripe;
}

export async function getTeamInvoices(
  team: Team,
  options?: { cursor?: string; status?: "open" },
) {
  try {
    const customerId = team.stripeCustomerId;

    if (!customerId) {
      throw new Error("No customer ID found");
    }

    // Get the list of invoices for the customer
    const invoices = await getStripe().invoices.list({
      customer: customerId,
      limit: 10,
      starting_after: options?.cursor,
      // Only return open invoices if the status is open
      status: options?.status,
    });

    return invoices;
  } catch (error) {
    console.error("Error fetching billing history:", error);

    // If the error is that the customer doesn't exist, return an empty array
    // instead of throwing an error
    if (
      error instanceof Stripe.errors.StripeError &&
      error.message.includes("No such customer")
    ) {
      return {
        data: [],
        has_more: false,
      };
    }

    throw new Error("Failed to fetch billing history");
  }
}

async function getStripeCustomer(customerId: string) {
  return await getStripe().customers.retrieve(customerId);
}

export async function getStripeBalance(customerId: string) {
  const customer = await getStripeCustomer(customerId);
  if (customer.deleted) {
    return 0;
  }
  // Stripe returns a positive balance for credits, so we need to divide by -100 to get the actual balance (as long as the balance is not 0)
  return customer.balance === 0 ? 0 : customer.balance / -100;
}

export async function fetchClientSecret(team: Team) {
  "use server";
  const origin = (await headers()).get("origin");
  const stripe = getStripe();
  const customerId = team.stripeCustomerId;

  if (!customerId) {
    throw new Error("No customer ID found");
  }

  // try to get the gclid cookie
  const gclid = (await cookies()).get("gclid")?.value;

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of
        // the product you want to sell
        price: GROWTH_PLAN_SKU,
        quantity: 1,
      },
    ],
    mode: "subscription",

    return_url: `${origin}/get-started/team/${team.slug}/select-plan?session_id={CHECKOUT_SESSION_ID}`,
    automatic_tax: { enabled: true },
    allow_promotion_codes: true,
    customer: customerId,
    customer_update: {
      address: "auto",
    },
    payment_method_collection: "always",
    payment_method_configuration: PAYMENT_METHOD_CONFIGURATION,
    subscription_data: {
      trial_period_days: 14,
      trial_settings: {
        end_behavior: {
          missing_payment_method: "cancel",
        },
      },
      // if gclid exists, set it as a metadata field so we can attribute the conversion later
      metadata: gclid ? { gclid } : undefined,
    },
  });

  if (!session.client_secret) {
    throw new Error("No client secret found");
  }

  return session.client_secret;
}

export async function getStripeSessionById(sessionId: string) {
  const session = await getStripe().checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "payment_intent"],
  });
  return session;
}
