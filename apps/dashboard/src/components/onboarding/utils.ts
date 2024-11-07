import { type Account, accountStatus } from "@3rdweb-sdk/react/hooks/useApi";

export const skipBilling = (account: Account) => {
  return (
    account.status === accountStatus.validPayment ||
    account.status === accountStatus.paymentVerification ||
    account.onboardSkipped
  );
};
