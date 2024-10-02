import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { getBillingPaymentMethodVerificationFailureResponse } from "lib/billing";
import { ExternalLinkIcon } from "lucide-react";

type PaymentVerificationFailureAlertProps = {
  onDismiss?: () => void;
  paymentFailureCode: string;
};

export const PaymentVerificationFailureAlert: React.FC<
  PaymentVerificationFailureAlertProps
> = ({ paymentFailureCode = "generic_decline" }) => {
  const { title, reason, resolution } =
    getBillingPaymentMethodVerificationFailureResponse({ paymentFailureCode });

  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>
          {reason ? `${reason}. ` : ""}
          {resolution ? `${resolution}.` : ""}
        </p>

        <TrackedLinkTW
          className="mt-3 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          href="/support"
          category="billing"
          label="support"
          target="_blank"
        >
          Contact Support
          <ExternalLinkIcon className="size-4" />
        </TrackedLinkTW>
      </AlertDescription>
    </Alert>
  );
};
