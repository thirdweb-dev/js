import "server-only";

import Stripe from "stripe";
import type { Team } from "@/api/team";
import { STRIPE_SECRET_KEY } from "@/constants/server-envs";

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
