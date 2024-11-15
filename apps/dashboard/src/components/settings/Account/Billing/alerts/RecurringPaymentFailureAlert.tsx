import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { type Account, accountStatus } from "@3rdweb-sdk/react/hooks/useApi";
import { getRecurringPaymentFailureResponse } from "lib/billing";
import { ExternalLinkIcon, XIcon } from "lucide-react";
import { ManageBillingButton } from "../ManageButton";

type RecurringPaymentFailureAlertProps = {
  isServiceCutoff?: boolean;
  onDismiss?: () => void;
  affectedServices?: string[];
  paymentFailureCode: string;
  dashboardAccount: Account;
};

export const RecurringPaymentFailureAlert: React.FC<
  RecurringPaymentFailureAlertProps
> = ({
  dashboardAccount,
  isServiceCutoff = false,
  onDismiss,
  affectedServices = [],
  paymentFailureCode = "bank_decline",
}) => {
  const router = useDashboardRouter();

  const { title, reason, resolution } = getRecurringPaymentFailureResponse({
    paymentFailureCode,
  });

  const header = isServiceCutoff
    ? "You have lost access to some paid services"
    : title;

  return (
    <Alert variant="destructive" className="py-6">
      <AlertTitle>{header}</AlertTitle>
      <AlertDescription>
        {reason ? `${reason}. ` : ""}
        {resolution ? `${resolution}. ` : ""}
        {isServiceCutoff
          ? ""
          : "We will retry several times over the next 10 days after your invoice date, after which you will lose access to your services."}
      </AlertDescription>

      <div className="mt-4 flex flex-col gap-4 text-muted-foreground text-sm">
        {affectedServices.length > 0 && (
          <div className="flex flex-col">
            <p className="mb-1"> Affected services: </p>
            <ul className="list-disc pl-3.5">
              {affectedServices.map((service) => (
                <li key={service}>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-3 md:flex-row">
          <ManageBillingButton
            account={dashboardAccount}
            loadingText="Verifying payment method"
            onClick={
              dashboardAccount.status === accountStatus.validPayment ||
              dashboardAccount.status === accountStatus.invalidPayment
                ? undefined
                : () => {
                    // TODO - get the team slug prop and redirect to that instead of the default team
                    // and don't show this button if this is on the billing page already
                    router.push("/team/~/~/settings/billing");
                  }
            }
          />

          <Button variant="outline" asChild>
            <TrackedLinkTW
              href="/support"
              category="billing"
              label="support"
              target="_blank"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              Contact Support
              <ExternalLinkIcon className="size-4" />
            </TrackedLinkTW>
          </Button>
        </div>
      </div>

      {onDismiss && (
        <Button
          size="icon"
          aria-label="Close"
          variant="ghost"
          onClick={onDismiss}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-5" />
        </Button>
      )}
    </Alert>
  );
};
