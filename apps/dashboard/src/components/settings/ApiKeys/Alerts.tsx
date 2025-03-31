import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrackedUnderlineLink } from "@/components/ui/tracked-link";
import { CircleAlertIcon } from "lucide-react";

export const SmartWalletsBillingAlert = () => {
  return (
    <Alert variant="warning">
      <CircleAlertIcon className="size-5" />
      <AlertTitle>Account Abstraction on Mainnet</AlertTitle>
      <AlertDescription>
        To enable AA on mainnet chains,{" "}
        <TrackedUnderlineLink
          href="/team/~/~/settings/billing"
          category="api_keys"
          label="smart_wallets_missing_billing"
        >
          subscribe to a billing plan.
        </TrackedUnderlineLink>
      </AlertDescription>
    </Alert>
  );
};
