"use client";

import { addPaymentMethod } from "@/actions/stripe-actions";
import type { Team } from "@/api/team";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AddressElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { AlertCircle, CheckCircle, CreditCard } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

interface PaymentMethodFormProps {
  team: Team;
  returnUrl?: string;
  onSuccess?: (paymentMethodId: string) => void;
  onError?: (error: Error) => void;
  showBillingName?: boolean;
  showBillingAddressOption?: boolean;
  showDefaultOption?: boolean;
  defaultIsDefault?: boolean;
  buttonText?: string;
  successMessage?: string;
  showAuthorizationMessage?: boolean;
  authorizationMessage?: string;
  redirectOnSuccess?: boolean;
  redirectDelay?: number;
}

function PaymentMethodForm({
  team,
  returnUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/billing`,
  onSuccess,
  onError,
  showBillingName = true,
  showBillingAddressOption = true,
  showDefaultOption = true,
  defaultIsDefault = false,
  buttonText = "Add Payment Method",
  successMessage = "Payment method successfully added!",
  showAuthorizationMessage = true,
  authorizationMessage = "A temporary $5 authorization hold will be placed on your card to verify it. This hold will be released immediately and you won't be charged.",
  redirectOnSuccess = true,
  redirectDelay = 1500,
}: PaymentMethodFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [makeDefault, setMakeDefault] = useState(defaultIsDefault);
  const [billingName, setBillingName] = useState("");
  const [showBillingAddress, setShowBillingAddress] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    if (!cardComplete) {
      setError("Please complete your card details.");
      return;
    }

    setProcessing(true);

    try {
      const { error: submitError, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: returnUrl,
          payment_method_data: {
            billing_details: { name: billingName || undefined },
          },
        },
      });

      if (submitError) {
        const errorMessage =
          submitError.message ||
          "An error occurred while processing your payment method.";
        setError(errorMessage);
        if (onError) onError(new Error(errorMessage));
        setProcessing(false);
        return;
      }

      if (setupIntent?.payment_method) {
        try {
          await addPaymentMethod(
            team,
            setupIntent.payment_method as string,
            makeDefault,
          );
          setSucceeded(true);
          setError(null);

          if (onSuccess) onSuccess(setupIntent.payment_method as string);

          // Redirect or reload after success if configured
          if (redirectOnSuccess) {
            setTimeout(() => {
              window.location.href = returnUrl;
            }, redirectDelay);
          }
        } catch (err) {
          let errorMessage =
            "Failed to validate card. Please try a different card.";
          if (err instanceof Error) {
            errorMessage = err.message;
          }
          setError(errorMessage);
          if (onError) onError(new Error(errorMessage));
        }
      }
    } catch (err) {
      console.error("Error:", err);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      if (onError) onError(new Error(errorMessage));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {succeeded && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {showBillingName && (
          <div className="space-y-2">
            <Label htmlFor="name">Cardholder Name (Optional)</Label>
            <Input
              id="name"
              placeholder="Name on card"
              value={billingName}
              onChange={(e) => setBillingName(e.target.value)}
              disabled={processing || succeeded}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Card Details</Label>
          <div className="rounded-md border p-3">
            <PaymentElement
              onChange={(e) => setCardComplete(e.complete)}
              options={{
                defaultValues: {
                  billingDetails: {
                    name: billingName || undefined,
                  },
                },
                layout: {
                  type: "tabs",
                  defaultCollapsed: false,
                },
              }}
            />
          </div>
        </div>

        {showBillingAddressOption && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-billing-address"
              checked={showBillingAddress}
              onCheckedChange={(checked) =>
                setShowBillingAddress(checked as boolean)
              }
              disabled={processing || succeeded}
            />
            <Label
              htmlFor="show-billing-address"
              className="font-normal text-sm"
            >
              Add billing address
            </Label>
          </div>
        )}

        {showBillingAddress && (
          <div className="mt-4 space-y-2">
            <Label>Billing Address</Label>
            <div className="rounded-md border p-3">
              <AddressElement
                options={{
                  mode: "billing",
                  fields: {
                    phone: "always",
                  },
                  validation: {
                    phone: {
                      required: "never",
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        {showDefaultOption && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="make-default"
              checked={makeDefault}
              onCheckedChange={(checked) => setMakeDefault(checked as boolean)}
              disabled={processing || succeeded}
            />
            <Label htmlFor="make-default" className="font-normal text-sm">
              Make this my default payment method
            </Label>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={!stripe || processing || succeeded}
        >
          {processing ? (
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Verifying Card...
            </div>
          ) : succeeded ? (
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Card Added
            </div>
          ) : (
            <div className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              {buttonText}
            </div>
          )}
        </Button>

        {showAuthorizationMessage && (
          <p className="mt-4 text-center text-muted-foreground text-xs">
            {authorizationMessage}
          </p>
        )}
      </div>
    </form>
  );
}

interface AddPaymentMethodFormProps {
  team: Team;
  clientSecret: string | null;
  returnUrl?: string;
  onSuccess?: (paymentMethodId: string) => void;
  onError?: (error: Error) => void;
  showBillingName?: boolean;
  showBillingAddressOption?: boolean;
  showDefaultOption?: boolean;
  defaultIsDefault?: boolean;
  buttonText?: string;
  successMessage?: string;
  showAuthorizationMessage?: boolean;
  authorizationMessage?: string;
  redirectOnSuccess?: boolean;
  redirectDelay?: number;
  className?: string;
}

export function AddPaymentMethodForm({
  team,
  clientSecret,
  returnUrl,
  onSuccess,
  onError,
  showBillingName,
  showBillingAddressOption,
  showDefaultOption,
  defaultIsDefault,
  buttonText,
  successMessage,
  showAuthorizationMessage,
  authorizationMessage,
  redirectOnSuccess,
  redirectDelay,
  className,
}: AddPaymentMethodFormProps) {
  const { resolvedTheme } = useTheme();

  // If no clientSecret is provided, show an error
  if (!clientSecret) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to initialize payment form. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={className}>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: resolvedTheme === "light" ? "stripe" : "night",
          },
        }}
      >
        <PaymentMethodForm
          team={team}
          returnUrl={returnUrl}
          onSuccess={onSuccess}
          onError={onError}
          showBillingName={showBillingName}
          showBillingAddressOption={showBillingAddressOption}
          showDefaultOption={showDefaultOption}
          defaultIsDefault={defaultIsDefault}
          buttonText={buttonText}
          successMessage={successMessage}
          showAuthorizationMessage={showAuthorizationMessage}
          authorizationMessage={authorizationMessage}
          redirectOnSuccess={redirectOnSuccess}
          redirectDelay={redirectDelay}
        />
      </Elements>
    </div>
  );
}
