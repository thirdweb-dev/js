"use server";
import "server-only";

import Stripe from "stripe";
import type { Team } from "../api/team";

let existingStripe: Stripe | undefined;

function getStripe() {
  if (!existingStripe) {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

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
  options?: { cursor?: string },
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

export async function getTeamPaymentMethods(team: Team) {
  try {
    const customerId = team.stripeCustomerId;

    if (!customerId) {
      throw new Error("No customer ID found");
    }

    const [paymentMethods, customer] = await Promise.all([
      // Get all payment methods, not just cards
      getStripe().paymentMethods.list({
        customer: customerId,
      }),
      // Get the customer to determine the default payment method
      getStripe().customers.retrieve(customerId),
    ]);

    const defaultPaymentMethodId = customer.deleted
      ? null
      : customer.invoice_settings?.default_payment_method;

    // Add isDefault flag to each payment method
    return paymentMethods.data.map((method) => ({
      ...method,
      isDefault: method.id === defaultPaymentMethodId,
    }));
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw new Error("Failed to fetch payment methods");
  }
}

export async function createSetupIntent(team: Team) {
  try {
    const customerId = team.stripeCustomerId;

    if (!customerId) {
      throw new Error("No customer ID found");
    }

    const setupIntent = await getStripe().setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    });

    return {
      clientSecret: setupIntent.client_secret,
    };
  } catch (error) {
    console.error("Error creating setup intent:", error);

    throw new Error("Failed to create setup intent");
  }
}

export async function addPaymentMethod(
  team: Team,
  paymentMethodId: string,
  setAsDefault = false,
) {
  try {
    const customerId = team.stripeCustomerId;

    if (!customerId) {
      throw new Error("No customer ID found");
    }

    // Attach the payment method to the customer
    await getStripe().paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Create a $5 payment intent to validate the card
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: 500, // $5.00 in cents
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethodId,
      capture_method: "manual", // Authorize only, don't capture
      confirm: true, // Confirm the payment immediately
      description: "Card validation - temporary hold",
      metadata: {
        purpose: "card_validation",
      },
      off_session: true, // Since this is a server-side operation
    });

    // If the payment intent succeeded, cancel it to release the hold
    if (paymentIntent.status === "requires_capture") {
      await getStripe().paymentIntents.cancel(paymentIntent.id, {
        cancellation_reason: "requested_by_customer",
      });
      console.log(
        `Successfully validated card ${paymentMethodId} with temporary hold`,
      );
    } else {
      // If the payment intent didn't succeed, detach the payment method
      await getStripe().paymentMethods.detach(paymentMethodId);
      throw new Error(`Card validation failed: ${paymentIntent.status}`);
    }

    // If setAsDefault is true, update the customer's default payment method
    if (setAsDefault) {
      await getStripe().customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding payment method:", error);

    // Try to detach the payment method if it was attached
    try {
      if (paymentMethodId) {
        await getStripe().paymentMethods.detach(paymentMethodId);
      }
    } catch (detachError) {
      console.error(
        "Error detaching payment method after validation failure:",
        detachError,
      );
    }

    // Determine the error message to return
    let errorMessage = "Failed to add payment method";

    if (error instanceof Stripe.errors.StripeCardError) {
      errorMessage = error.message || "Your card was declined";
    } else if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      errorMessage = "Invalid card information";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
}

export async function deletePaymentMethod(paymentMethodId: string) {
  try {
    // Detach the payment method from the customer
    await getStripe().paymentMethods.detach(paymentMethodId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting payment method:", error);
    throw new Error("Failed to delete payment method");
  }
}

export async function setDefaultPaymentMethod(
  team: Team,
  paymentMethodId: string,
) {
  try {
    const customerId = team.stripeCustomerId;

    if (!customerId) {
      throw new Error("No customer ID found");
    }

    // Update the customer's default payment method
    await getStripe().customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error setting default payment method:", error);
    throw new Error("Failed to set default payment method");
  }
}
