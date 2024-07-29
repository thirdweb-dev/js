import { accountKeys } from "@3rdweb-sdk/react/cache-keys";
import { useUpdateAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Flex, FocusLock } from "@chakra-ui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQueryClient } from "@tanstack/react-query";
import { useTrack } from "hooks/analytics/useTrack";
import { useTheme } from "next-themes";
import { OnboardingPaymentForm } from "./PaymentForm";
import { OnboardingTitle } from "./Title";

// only load stripe if the key is available
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
  : null;

interface OnboardingBillingProps {
  onSave: () => void;
  onCancel: () => void;
}

export const OnboardingBilling: React.FC<OnboardingBillingProps> = ({
  onSave,
  onCancel,
}) => {
  const { theme } = useTheme();
  const trackEvent = useTrack();
  const queryClient = useQueryClient();
  const { user } = useLoggedInUser();

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

  return (
    <FocusLock>
      <Flex flexDir="column" gap={8}>
        <OnboardingTitle
          heading="Add a payment method"
          description="thirdweb is free to get started. Add a payment method to prevent service interruptions when you exceed limits."
        />
        <Flex flexDir="column" gap={8}>
          <Elements
            stripe={stripePromise}
            options={{
              mode: "setup",
              paymentMethodCreation: "manual",
              currency: "usd",
              paymentMethodConfiguration:
                process.env.NEXT_PUBLIC_STRIPE_PAYMENT_METHOD_CFG_ID,
              appearance: {
                theme: theme === "dark" ? "night" : "stripe",
                ...appearance,
              },
            }}
          >
            <OnboardingPaymentForm
              onSave={() => {
                queryClient.invalidateQueries(
                  accountKeys.me(user?.address as string),
                );
                onSave();
              }}
              onCancel={handleCancel}
            />
          </Elements>
        </Flex>
      </Flex>
    </FocusLock>
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
      backgroundColor: "transparent",
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
