"use client";

import { DismissibleAlert } from "@/components/blocks/dismissible-alert";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Button } from "@/components/ui/button";
import { TabPathLinks } from "@/components/ui/tabs";
import { SmartWalletsBillingAlert } from "components/settings/ApiKeys/Alerts";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { AAFooter } from "./AAFooterSection";

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
    <div className="flex grow flex-col">
      {/* top */}
      <div className="pt-4 lg:pt-6">
        {/* header */}
        <div className="container flex max-w-7xl flex-col gap-4">
          <div>
            <h1 className="mb-1 font-semibold text-2xl tracking-tight lg:text-3xl">
              Account Abstraction
            </h1>
            <p className="text-muted-foreground text-sm">
              Integrate ERC-4337 compliant smart accounts for gasless
              sponsorships and more. <br className="lg:hidden" />
              <UnderlineLink
                target="_blank"
                rel="noopener noreferrer"
                href="https://portal.thirdweb.com/wallets/smart-wallet"
              >
                Learn more about Account Abstraction
              </UnderlineLink>
            </p>
          </div>
          {props.hasSmartWalletsWithoutBilling && (
            <SmartWalletsBillingAlert teamSlug={props.teamSlug} />
          )}
          <GasCreditAlert
            teamSlug={props.teamSlug}
            projectId={props.projectId}
          />
        </div>

        <div className="h-4" />

        {/* Nav */}
        <TabPathLinks
          scrollableClassName="container max-w-7xl"
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
      </div>

      {/* content */}
      <div className="h-6" />
      <div className="container flex max-w-7xl grow flex-col gap-6">
        <div>{props.children}</div>
      </div>
      <div className="h-20" />

      {/* footer */}
      <div className="border-border border-t">
        <div className="container max-w-7xl">
          <AAFooter />
        </div>
      </div>
    </div>
  );
}

function GasCreditAlert(props: {
  teamSlug: string;
  projectId: string;
}) {
  return (
    <DismissibleAlert
      localStorageId={`${props.projectId}-gas-credit-alert`}
      title="OP Gas Credit Program"
      description={
        <>
          Redeem credits towards gas Sponsorship. <br className="lg:hidden" />
          <UnderlineLink
            target="_blank"
            href="https://thirdweb.com/superchain"
            rel="noopener noreferrer"
          >
            Learn More
          </UnderlineLink>
          <div className="mt-4 flex items-center gap-4">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="bg-background"
            >
              <Link
                href={`/team/${props.teamSlug}/~/settings/credits`}
                target="_blank"
                className="gap-2"
              >
                Claim your credits <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </>
      }
    />
  );
}
