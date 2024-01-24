import { useTrack } from "hooks/analytics/useTrack";
import { Button } from "tw-components";
import { MouseEvent, useEffect, useState } from "react";
import {
  Account,
  AccountStatus,
  useCreateBillingSession,
} from "@3rdweb-sdk/react/hooks/useApi";

interface ManageBillingButtonProps {
  account: Account;
  loading?: boolean;
  loadingText?: string;
  onClick?: () => void;
}

export const ManageBillingButton: React.FC<ManageBillingButtonProps> = ({
  account,
  loading,
  loadingText,
  onClick,
}) => {
  const trackEvent = useTrack();
  const [sessionUrl, setSessionUrl] = useState();
  const paymentVerification =
    account?.status === AccountStatus.PaymentVerification &&
    account.stripePaymentActionUrl;
  const validPayment =
    account?.status === AccountStatus.ValidPayment &&
    !account.paymentAttemptCount;

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
    } else if (onClick) {
      onClick();
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
      isDisabled={loading || (!sessionUrl && !paymentVerification)}
      isLoading={loading}
      loadingText={loadingText}
      onClick={handleClick}
      colorScheme={loading ? "gray" : "blue"}
      size="sm"
      fontWeight="normal"
    >
      {validPayment
        ? "Manage billing"
        : paymentVerification
        ? "Verify payment method →"
        : "Add payment method"}
    </Button>
  );
};
