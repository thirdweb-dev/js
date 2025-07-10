import { formatDistance } from "date-fns";
import Image from "next/image";
import type { BillingCredit } from "@/hooks/useApi";
import { formatToDollars } from "./formatToDollars";

interface CreditsItemProps {
  credit?: BillingCredit;
}

export const CreditsItem: React.FC<CreditsItemProps> = ({ credit }) => {
  const isTwCredit = credit?.name.startsWith("TW -");
  const isStartupCredit = credit?.name.startsWith("SU -");

  let creditTitle = credit?.name ?? "thirdweb credits";
  if (isTwCredit) {
    creditTitle = "thirdweb credits";
  } else if (isStartupCredit) {
    creditTitle = "Startup grant credits";
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex flex-col gap-3 p-4 lg:p-6">
        <div className="relative">
          <div className="absolute top-0 right-0">
            {isTwCredit ? (
              <Image
                alt="tw-credit"
                className="size-6"
                objectFit="contain"
                src={require("../../../../public/brand/thirdweb-icon.svg")}
              />
            ) : isStartupCredit ? (
              <Image
                alt="tw-credit"
                className="size-6"
                objectFit="contain"
                src={require("../../../../public/brand/thirdweb-icon.svg")}
              />
            ) : null}
          </div>

          <h3 className="font-semibold text-foreground text-xl tracking-tight">
            {creditTitle}
          </h3>
        </div>

        <div className="flex gap-6">
          <div>
            <h4 className="mb-0.5 text-muted-foreground text-sm">
              Remaining Credits
            </h4>
            <p className="text-foreground">
              {formatToDollars(credit?.remainingValueUsdCents || 0)}
            </p>
          </div>

          {!isTwCredit && (
            <div>
              <h4 className="mb-0.5 text-muted-foreground text-sm">
                Claimed Credits (All-Time)
              </h4>
              <p className="text-foreground">
                {formatToDollars(credit?.originalGrantUsdCents || 0)}
              </p>
            </div>
          )}

          {credit?.expiresAt && (
            <div>
              <h4 className="mb-0.5 text-muted-foreground text-sm">Expires</h4>
              <p className="text-foreground">
                {credit?.expiresAt
                  ? formatDistance(new Date(credit.expiresAt), Date.now(), {
                      addSuffix: true,
                    })
                  : "N/A"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
