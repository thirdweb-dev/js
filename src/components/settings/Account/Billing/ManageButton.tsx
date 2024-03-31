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
  buttonProps?: {
    variant?: "outline" | "solid";
    colorScheme?: "primary";
  };
}

export const ManageBillingButton: React.FC<ManageBillingButtonProps> = ({
  account,
  loading,
  loadingText,
  buttonProps = { variant: "outline", color: loading ? "gray" : "blue.500" },
  onClick,
}) => {
  const [sessionUrl, setSessionUrl] = useState();
  const mutation = useCreateBillingSession();
  const validPayment = account.status === AccountStatus.ValidPayment;
  const paymentVerification =
    account.status === AccountStatus.PaymentVerification;
  const invalidPayment = [
    AccountStatus.InvalidPayment,
    AccountStatus.InvalidPaymentMethod,
  ].includes(account.status);

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
      {...buttonProps}
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
