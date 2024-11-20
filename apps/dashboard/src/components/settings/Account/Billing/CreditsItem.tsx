import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { type BillingCredit, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
import { ChainIcon } from "components/icons/ChainIcon";
import { formatDistance } from "date-fns";
import { useTrack } from "hooks/analytics/useTrack";
import { useLocalStorage } from "hooks/useLocalStorage";
import { CircleAlertIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatToDollars } from "./formatToDollars";

interface CreditsItemProps {
  credit?: BillingCredit;
  isOpCreditDefault?: boolean;
  onClickApply?: () => void;
}

export const CreditsItem: React.FC<CreditsItemProps> = ({
  credit,
  isOpCreditDefault,
  onClickApply,
}) => {
  const trackEvent = useTrack();
  const account = useAccount();

  const [hasAppliedForOpGrant] = useLocalStorage(
    `appliedForOpGrant-${account?.data?.id || ""}`,
    false,
  );

  const isOpCredit = credit?.name.startsWith("OP -") || isOpCreditDefault;
  const isTwCredit = credit?.name.startsWith("TW -");
  const isStartupCredit = credit?.name.startsWith("SU -");

  let creditTitle = credit?.name ?? "thirdweb credits";
  if (isOpCredit) {
    creditTitle = "Optimism sponsorship credits";
  } else if (isTwCredit) {
    creditTitle = "thirdweb credits";
  } else if (isStartupCredit) {
    creditTitle = "Startup grant credits";
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/50 p-4 lg:p-6">
      <div className="relative">
        <div className="absolute top-0 right-0">
          {isOpCredit ? (
            <ChainIcon
              ipfsSrc=// Hard-coded here to remove @thirdweb dev/chains
              "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/optimism/512.png"
              size={24}
            />
          ) : isTwCredit ? (
            <Image
              src={require("../../../../../public/brand/thirdweb-icon.svg")}
              alt="tw-credit"
              className="size-6"
              objectFit="contain"
            />
          ) : isStartupCredit ? (
            <Image
              src={require("../../../../../public/brand/thirdweb-icon.svg")}
              alt="tw-credit"
              className="size-6"
              objectFit="contain"
            />
          ) : null}
        </div>

        <h3 className="text-foreground text-xl tracking-tight">
          {creditTitle}
        </h3>
      </div>

      <div className="mt-1 flex gap-6">
        <div>
          <h4 className="font-medium text-muted-foreground text-sm">
            Remaining Credits
          </h4>
          <p className="text-foreground text-sm">
            {formatToDollars(credit?.remainingValueUsdCents || 0)}
          </p>
        </div>

        {!isTwCredit && (
          <div>
            <h4 className="font-medium text-muted-foreground text-sm">
              Claimed Credits (All-Time)
            </h4>
            <p className="text-foreground text-sm">
              {formatToDollars(credit?.originalGrantUsdCents || 0)}
            </p>
          </div>
        )}

        {credit?.expiresAt && (
          <div>
            <h4 className="font-medium text-muted-foreground text-sm">
              Expires
            </h4>
            <p className="text-foreground text-sm">
              {credit?.expiresAt
                ? formatDistance(new Date(credit.expiresAt), Date.now(), {
                    addSuffix: true,
                  })
                : "N/A"}
            </p>
          </div>
        )}
      </div>

      {hasAppliedForOpGrant && !credit && isOpCredit && (
        <Alert variant="info">
          <CircleAlertIcon className="size-5" />
          <AlertTitle>Grant application pending approval</AlertTitle>
          <AlertDescription>
            You will receive an email once your application&apos;s status
            changes.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        {!hasAppliedForOpGrant && isOpCredit && (
          <Button asChild size="sm" variant="outline" className="bg-background">
            <Link
              href="/team/~/~/settings/credits"
              onClick={() => {
                trackEvent({
                  category: "op-sponsorship",
                  action: "click",
                  label: "apply-now",
                });
                if (onClickApply) {
                  onClickApply();
                }
              }}
            >
              Apply Now
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
