import { TrackedLinkButton } from "tw-components";
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
  const [sessionUrl, setSessionUrl] = useState();
  const mutation = useCreateBillingSession();

  const validPayment = account.status === AccountStatus.ValidPayment;
  const paymentVerification =
    account.status === AccountStatus.PaymentVerification;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (onClick || loading || (!sessionUrl && !paymentVerification)) {
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    }
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
    <TrackedLinkButton
      variant="outline"
      isDisabled={loading || (!sessionUrl && !paymentVerification)}
      href={account.stripePaymentActionUrl || sessionUrl || ""}
      isLoading={loading}
      category="billingAccount"
      label={
        paymentVerification
          ? "verifyPaymentMethod"
          : onClick
            ? "addPayment"
            : "manage"
      }
      loadingText={loadingText}
      onClick={handleClick}
      color={loading ? "gray" : "blue.500"}
      fontSize="small"
    >
      {validPayment
        ? "Manage billing"
        : paymentVerification
          ? "Verify payment method →"
          : "Add payment method →"}
    </TrackedLinkButton>
  );
};
