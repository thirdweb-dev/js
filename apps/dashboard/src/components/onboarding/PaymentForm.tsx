import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useCreatePaymentMethod } from "@3rdweb-sdk/react/hooks/useApi";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { PaymentVerificationFailureAlert } from "components/settings/Account/Billing/alerts/PaymentVerificationFailureAlert";
import { useErrorHandler } from "contexts/error-handler";
import { useTrack } from "hooks/analytics/useTrack";
import { type FormEvent, useState } from "react";

interface OnboardingPaymentForm {
  onSave: () => void;
  onCancel: () => void;
}

export const OnboardingPaymentForm: React.FC<OnboardingPaymentForm> = ({
  onSave,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const trackEvent = useTrack();
  const { onError } = useErrorHandler();
  const [paymentFailureCode, setPaymentFailureCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const mutation = useCreatePaymentMethod();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setSaving(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setSaving(false);
      if (submitError.code) {
        return setPaymentFailureCode(submitError.code);
      }
      return onError(submitError);
    }

    const { error: createError, paymentMethod } =
      await stripe.createPaymentMethod({
        elements,
      });

    if (createError) {
      setSaving(false);
      return onError(createError);
    }

    trackEvent({
      category: "account",
      action: "addPaymentMethod",
      label: "attempt",
    });

    mutation.mutate(paymentMethod.id, {
      onSuccess: () => {
        onSave();
        setPaymentFailureCode("");
        setSaving(false);

        trackEvent({
          category: "account",
          action: "addPaymentMethod",
          label: "success",
        });
      },
      // biome-ignore lint/suspicious/noExplicitAny: FIXME
      onError: (error: any) => {
        const failureCode = error?.message;
        setPaymentFailureCode(failureCode || "generic_decline");
        setSaving(false);

        trackEvent({
          category: "account",
          action: "addPaymentMethod",
          label: "error",
          error: failureCode,
        });
      },
    });
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <PaymentElement
          onLoaderStart={() => setLoading(false)}
          options={{ terms: { card: "never" } }}
        />

        {loading ? (
          <div className="flex min-h-[100px] items-center justify-center">
            <Spinner className="size-5" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {paymentFailureCode ? (
              <PaymentVerificationFailureAlert
                paymentFailureCode={paymentFailureCode}
              />
            ) : (
              <Alert variant="info">
                <AlertTitle className="text-sm">
                  A temporary hold will be placed and immediately released on
                  your payment method.
                </AlertTitle>
              </Alert>
            )}

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={onCancel} disabled={saving}>
                I'll do this later
              </Button>

              <Button className="gap-2" type="submit" disabled={!stripe}>
                {loading && <Spinner className="size-4" />}
                Add payment
              </Button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
