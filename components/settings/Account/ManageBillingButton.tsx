import { useTrack } from "hooks/analytics/useTrack";
import { Button } from "tw-components";
import { MouseEvent, useEffect, useState } from "react";
import {
  Account,
  useCreateBillingSession,
} from "@3rdweb-sdk/react/hooks/useApi";

interface ManageBillingButtonProps {
  account: Account;
}

export const ManageBillingButton: React.FC<ManageBillingButtonProps> = ({
  account,
}) => {
  const trackEvent = useTrack();
  const [sessionUrl, setSessionUrl] = useState();
  const paymentVerification =
    account?.status === "paymentVerification" && account.stripePaymentActionUrl;

  const mutation = useCreateBillingSession();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (paymentVerification) {
      window.open(account.stripePaymentActionUrl);

      trackEvent({
        category: "billingAccount",
        action: "click",
        label: "verifyPaymentMethod",
      });

      return;
    }

    window.open(sessionUrl);

    trackEvent({
      category: "billingAccount",
      action: "click",
      label: "manage",
    });
  };

  useEffect(() => {
    if (!paymentVerification) {
      mutation.mutate(undefined, {
        onSuccess: (data) => {
          setSessionUrl(data.url);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentVerification]);

  return (
    <Button
      variant="link"
      isDisabled={!sessionUrl && !paymentVerification}
      onClick={handleClick}
      colorScheme="blue"
      size="sm"
      fontWeight="normal"
    >
      {account.status === "validPayment"
        ? "Manage billing"
        : paymentVerification
        ? "Verify payment method →"
        : "Add payment method →"}
    </Button>
  );
};
