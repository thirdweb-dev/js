import { useCreatePaymentMethod } from "@3rdweb-sdk/react/hooks/useApi";
import { Center, Flex, Spinner } from "@chakra-ui/react";
import {
  useElements,
  useStripe,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useErrorHandler } from "contexts/error-handler";
import { useTrack } from "hooks/analytics/useTrack";
import { FormEvent, useState } from "react";
import { Button } from "tw-components";

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const mutation = useCreatePaymentMethod();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setSaving(false);
      return onError(submitError);
    }

    const { error: createError, paymentMethod } =
      await stripe.createPaymentMethod({
        elements,
      });

    if (createError) {
      setSaving(false);
      return onError(submitError);
    }

    trackEvent({
      category: "account",
      action: "addPaymentMethod",
      label: "attempt",
    });

    mutation.mutate(paymentMethod.id, {
      onSuccess: () => {
        onSave();
        setSaving(false);

        trackEvent({
          category: "account",
          action: "addPaymentMethod",
          label: "success",
        });
      },
      onError: (error: any) => {
        const message =
          "message" in error
            ? error.message
            : "Couldn't add a payment method. Try later!";
        onError(message);
        setSaving(false);

        trackEvent({
          category: "account",
          action: "addPaymentMethod",
          label: "error",
          error: message,
        });
      },
    });
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <Flex flexDir="column" gap={8}>
        <PaymentElement onLoaderStart={() => setLoading(false)} />

        {loading ? (
          <Center pb={16}>
            <Spinner size="sm" />
          </Center>
        ) : (
          <Flex flexDir="column" gap={3}>
            <Button
              w="full"
              size="lg"
              fontSize="md"
              variant="inverted"
              type="submit"
              isDisabled={!stripe}
              isLoading={saving}
            >
              Add payment
            </Button>
            <Button
              w="full"
              size="lg"
              fontSize="md"
              variant="outline"
              isDisabled={saving}
              onClick={onCancel}
            >
              I&apos;ll do this later
            </Button>
          </Flex>
        )}
      </Flex>
    </form>
  );
};
