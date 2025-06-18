import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon } from "lucide-react";

export const SmartWalletsBillingAlert = (props: {
  teamSlug: string;
}) => {
  return (
    <Alert variant="warning">
      <CircleAlertIcon className="size-5" />
      <AlertTitle>Account Abstraction on Mainnet</AlertTitle>
      <AlertDescription>
        To enable AA on mainnet chains,{" "}
        <UnderlineLink href={`/team/${props.teamSlug}/~/settings/billing`}>
          subscribe to a billing plan.
        </UnderlineLink>
      </AlertDescription>
    </Alert>
  );
};
