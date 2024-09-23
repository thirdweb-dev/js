import { useCreatePaymentMethod } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Center,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { PaymentVerificationFailureAlert } from "components/settings/Account/Billing/alerts/PaymentVerificationFailureAlert";
import { useErrorHandler } from "contexts/error-handler";
import { useTrack } from "hooks/analytics/useTrack";
import { type FormEvent, useState } from "react";
import { Button, Text } from "tw-components";

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
      <Flex flexDir="column" gap={8}>
        <PaymentElement
          onLoaderStart={() => setLoading(false)}
          options={{ terms: { card: "never" } }}
        />

        {loading ? (
          <Center pb={16}>
            <Spinner size="sm" />
          </Center>
        ) : (
          <Flex flexDir="column" gap={4}>
            {paymentFailureCode ? (
              <PaymentVerificationFailureAlert
                paymentFailureCode={paymentFailureCode}
              />
            ) : (
              <Alert
                status="info"
                borderRadius="md"
                as={Flex}
                alignItems="start"
                justifyContent="space-between"
                variant="left-accent"
                bg="inputBg"
              >
                <Flex>
                  <AlertIcon boxSize={4} mt={1} ml={1} />
                  <Flex flexDir="column" gap={1} pl={1}>
                    <AlertDescription as={Text} fontSize="body.md">
                      A temporary hold will be placed and immediately released
                      on your payment method.
                    </AlertDescription>
                  </Flex>
                </Flex>
              </Alert>
            )}

            <Button
              w="full"
              size="lg"
              fontSize="md"
              colorScheme="blue"
              type="submit"
              isDisabled={!stripe}
              isLoading={saving}
            >
              Add payment
            </Button>
            <Button
              size="lg"
              fontSize="sm"
              variant="link"
              mt="4"
              onClick={onCancel}
              isDisabled={saving}
              colorScheme="blue"
            >
              <Text color="blue.500">I&apos;ll do this later</Text>
            </Button>
          </Flex>
        )}
      </Flex>
    </form>
  );
};
