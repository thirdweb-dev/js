import {
  type Account,
  AccountStatus,
  useCreateBillingSession,
} from "@3rdweb-sdk/react/hooks/useApi";
import { type MouseEvent, useMemo } from "react";
import { TrackedLinkButton } from "tw-components";

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
  const [buttonLabel, buttonText] = useMemo(() => {
    switch (account.status) {
      case AccountStatus.InvalidPayment:
      case AccountStatus.ValidPayment: {
        return ["manage", "Manage billing"];
      }
      case AccountStatus.PaymentVerification: {
        return ["verifyPaymentMethod", "Verify your payment method →"];
      }
      case AccountStatus.InvalidPaymentMethod: {
        return ["addAnotherPayment", "Add another payment method →"];
      }
      default: {
        return ["addPayment", "Add payment method"];
      }
    }
  }, [account.status]);

  const query = useCreateBillingSession(buttonLabel === "manage");
  const url = useMemo(() => {
    switch (buttonLabel) {
      case "verifyPaymentMethod":
        return account.stripePaymentActionUrl;
      case "manage":
        return query.data?.url;
    }
  }, [query.data, buttonLabel, account.stripePaymentActionUrl]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      e.preventDefault();
      return;
    }

    if (!["verifyPaymentMethod", "manage"].includes(buttonLabel)) {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <TrackedLinkButton
      {...buttonProps}
      isDisabled={loading || (!onClick && !url)}
      href={url ?? ""}
      isLoading={loading}
      category="billingAccount"
      label={buttonLabel}
      loadingText={loadingText}
      onClick={handleClick}
      fontSize="small"
    >
      {buttonText}
    </TrackedLinkButton>
  );
};
