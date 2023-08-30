import { useTrack } from "hooks/analytics/useTrack";
import { Button } from "tw-components";
import { MouseEvent } from "react";
import { Account, useCreateAccountPlan } from "@3rdweb-sdk/react/hooks/useApi";

interface ManageBillingButtonProps {
  account: Account;
}

export const ManageBillingButton: React.FC<ManageBillingButtonProps> = ({
  account,
}) => {
  const trackEvent = useTrack();
  const createPlanMutation = useCreateAccountPlan();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!account.email) {
      return;
    }

    if (account.status === "noCustomer") {
      // create plan (stripe customer) to be able to get into customer portal
      trackEvent({
        category: "account",
        action: "createPlan",
        label: "attempt",
      });

      createPlanMutation.mutate(undefined, {
        onSuccess: () => {
          trackEvent({
            category: "account",
            action: "createPlan",
            label: "success",
          });
        },
        onError: (err) => {
          trackEvent({
            category: "account",
            action: "createPlan",
            label: "error",
            error: err,
          });
        },
      });
    }

    window.open(
      `${
        process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL
      }?prefilled_email=${encodeURIComponent(account.email as string)}`,
      "_blank",
    );

    trackEvent({
      category: "billingAccount",
      action: "click",
      label: "manage",
    });
  };

  return (
    <Button
      variant="link"
      isDisabled={!account.email}
      onClick={handleClick}
      colorScheme="blue"
      size="sm"
      fontWeight="normal"
    >
      {account.status === "validPayment"
        ? "Manage billing"
        : "Add payment method →"}
    </Button>
  );
};
