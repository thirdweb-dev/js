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
  const invalidPayment = account.status === AccountStatus.InvalidPayment;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (onClick || loading || !sessionUrl) {
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    }
  };

  useEffect(() => {
    if (!onClick) {
      mutation.mutate(undefined, {
        onSuccess: (data) => {
          setSessionUrl(data.url);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClick]);

  return (
    <TrackedLinkButton
      variant="outline"
      isDisabled={loading || (!onClick && !sessionUrl)}
      href={sessionUrl || ""}
      isLoading={loading}
      category="billingAccount"
      label={
        paymentVerification || invalidPayment
          ? "addAnotherPayment"
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
        : paymentVerification || invalidPayment
          ? "Add another payment method →"
          : "Add payment method →"}
    </TrackedLinkButton>
  );
};
