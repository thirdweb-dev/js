import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js/pure";
import { Elements } from "@stripe/react-stripe-js";
import { OnboardingPaymentForm } from "./PaymentForm";
import { Flex, useColorMode } from "@chakra-ui/react";
import { OnboardingTitle } from "./Title";
import { Stripe } from "@stripe/stripe-js";
import { useUpdateAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useTrack } from "hooks/analytics/useTrack";

interface OnboardingBillingProps {
  onSave: () => void;
  onCancel: () => void;
}

export const OnboardingBilling: React.FC<OnboardingBillingProps> = ({
  onSave,
  onCancel,
}) => {
  const { colorMode } = useColorMode();
  const [stripePromise, setStripePromise] = useState<
    Promise<Stripe | null> | undefined
  >();
  const trackEvent = useTrack();

  const mutation = useUpdateAccount();

  const handleCancel = () => {
    trackEvent({
      category: "account",
      action: "onboardSkippedBilling",
      label: "attempt",
    });

    mutation.mutate(
      {
        onboardSkipped: true,
      },
      {
        onSuccess: () => {
          trackEvent({
            category: "account",
            action: "onboardSkippedBilling",
            label: "success",
          });
        },
        onError: (error) => {
          trackEvent({
            category: "account",
            action: "onboardSkippedBilling",
            label: "error",
            error,
          });
        },
      },
    );

    onCancel();
  };

  useEffect(() => {
    const init = async () => {
      setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? ""));
    };
    init();
  }, []);

  return (
    <Flex flexDir="column" gap={8}>
      <OnboardingTitle
        heading="Add a payment method"
        description="To continue using thirdweb without interruption after exceeding your Starter plan limits, please add a payment method. Your card will be used for verification, no charges will be made without notice."
      />
      <Flex flexDir="column" gap={8}>
        {stripePromise && (
          <Elements
            stripe={stripePromise}
            options={{
              mode: "setup",
              paymentMethodCreation: "manual",
              currency: "usd",
              paymentMethodConfiguration:
                process.env.NEXT_PUBLIC_STRIPE_PAYMENT_METHOD_CFG_ID,
              appearance: {
                theme: colorMode === "dark" ? "night" : "stripe",
                ...appearance,
              },
            }}
          >
            <OnboardingPaymentForm onSave={onSave} onCancel={handleCancel} />
          </Elements>
        )}
      </Flex>
    </Flex>
  );
};

const appearance = {
  variables: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSizeBase: "15px",
    colorPrimary: "rgb(51, 133, 255)",
    colorDanger: "#FCA5A5",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      boxShadow: "none",
      background: "transparent",
      backgroundColor: "transparent",
      height: "40px",
    },
    ".Input:hover": {
      borderColor: "rgb(51, 133, 255)",
      boxShadow: "none",
    },
    ".Label": {
      marginBottom: "12px",
      fontWeight: "500",
    },
  },
};
