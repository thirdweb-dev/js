"use client";

import { Button } from "@/components/ui/button";
import { TabPathLinks } from "@/components/ui/tabs";
import {
  TrackedLinkTW,
  TrackedUnderlineLink,
} from "@/components/ui/tracked-link";
import { SmartWalletsBillingAlert } from "components/settings/ApiKeys/Alerts";
import { useLocalStorage } from "hooks/useLocalStorage";
import { ArrowRightIcon } from "lucide-react";
import { XIcon } from "lucide-react";
import { AAFooterSection } from "./AAFooterSection";

const TRACKING_CATEGORY = "smart-wallet";

export function AccountAbstractionLayout(props: {
  projectSlug: string;
  projectId: string;
  teamSlug: string;
  projectKey: string;
  children: React.ReactNode;
  hasSmartWalletsWithoutBilling: boolean;
}) {
  const smartWalletsLayoutSlug = `/team/${props.teamSlug}/${props.projectSlug}/connect/account-abstraction`;

  return (
    <div>
      <h1 className="mb-1 font-semibold text-2xl tracking-tight lg:text-3xl">
        Account Abstraction
      </h1>
      <p className="text-muted-foreground text-sm">
        Integrate ERC-4337 compliant smart accounts for gasless sponsorships and
        more. <br className="lg:hidden" />
        <TrackedUnderlineLink
          target="_blank"
          label="docs-wallets"
          category={TRACKING_CATEGORY}
          href="https://portal.thirdweb.com/wallets/smart-wallet"
        >
          Learn more about Account Abstraction
        </TrackedUnderlineLink>
      </p>

      <div className="h-6" />

      <div className="flex flex-col gap-6">
        {props.hasSmartWalletsWithoutBilling && <SmartWalletsBillingAlert />}
        <GasCreditAlert teamSlug={props.teamSlug} projectId={props.projectId} />

        <div>
          <TabPathLinks
            links={[
              {
                name: "Analytics",
                path: `${smartWalletsLayoutSlug}`,
                exactMatch: true,
              },
              {
                name: "Account Factories",
                path: `${smartWalletsLayoutSlug}/factories`,
              },
              {
                name: "Sponsorship Rules",
                path: `${smartWalletsLayoutSlug}/settings`,
              },
            ]}
          />

          <div className="h-6" />

          {props.children}
        </div>
      </div>

      <div className="h-14" />

      <AAFooterSection trackingCategory={TRACKING_CATEGORY} />
    </div>
  );
}

function GasCreditAlert(props: {
  teamSlug: string;
  projectId: string;
}) {
  const [isVisible, setIsVisible] = useLocalStorage(
    `gas-credit-${props.projectId}`,
    true,
    false,
  );

  if (!isVisible) return null;

  return (
    <div className="relative rounded-lg border border-border bg-card p-4">
      <Button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 h-auto w-auto p-1 text-muted-foreground"
        aria-label="Close alert"
        variant="ghost"
      >
        <XIcon className="size-5" />
      </Button>
      <div>
        <h2 className="mb-0.5 font-semibold">OP Gas Credit Program</h2>
        <p className="text-muted-foreground text-sm">
          Redeem credits towards gas Sponsorship. <br className="lg:hidden" />
          <TrackedUnderlineLink
            target="_blank"
            label="superchain-landing"
            category={TRACKING_CATEGORY}
            href="https://thirdweb.com/grant/superchain"
          >
            Learn More
          </TrackedUnderlineLink>
        </p>

        <div className="mt-4 flex items-center gap-4">
          <Button asChild variant="outline" size="sm" className="bg-background">
            <TrackedLinkTW
              href={`/team/${props.teamSlug}/~/settings/credits`}
              target="_blank"
              className="gap-2"
              category={TRACKING_CATEGORY}
              label="claim-credits"
            >
              Claim your credits <ArrowRightIcon className="size-4" />
            </TrackedLinkTW>
          </Button>
        </div>
      </div>
    </div>
  );
}
