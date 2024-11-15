import { accountKeys } from "@3rdweb-sdk/react/cache-keys";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { OnboardingPaymentForm } from "./PaymentForm";
import { TitleAndDescription } from "./Title";

// only load stripe if the key is available
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
  : null;

interface AddPaymentMethodProps {
  onSave: () => void;
  onCancel: () => void;
}

const AddPaymentMethod: React.FC<AddPaymentMethodProps> = ({
  onSave,
  onCancel,
}) => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const { user } = useLoggedInUser();

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <TitleAndDescription
        heading="Add a payment method"
        description="thirdweb is free to get started. Add a payment method to prevent service interruptions when you exceed limits."
      />
      <div className="h-4" />
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
            queryClient.invalidateQueries({
              queryKey: accountKeys.me(user?.address as string),
            });
            onSave();
          }}
          onCancel={handleCancel}
        />
      </Elements>
    </div>
  );
};

export default AddPaymentMethod;

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
