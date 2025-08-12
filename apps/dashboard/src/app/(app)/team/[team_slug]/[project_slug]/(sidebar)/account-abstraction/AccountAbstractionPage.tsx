"use client";

import { TabPathLinks } from "@/components/ui/tabs";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { AAFooter } from "./AAFooterSection";
import { SmartWalletsBillingAlert } from "./Alerts";

export function AccountAbstractionLayout(props: {
  projectSlug: string;
  projectId: string;
  teamSlug: string;
  projectKey: string;
  children: React.ReactNode;
  hasSmartWalletsWithoutBilling: boolean;
}) {
  const smartWalletsLayoutSlug = `/team/${props.teamSlug}/${props.projectSlug}/account-abstraction`;

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
                href="https://portal.thirdweb.com/wallets/smart-wallet"
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn more
              </UnderlineLink>
            </p>
          </div>
          {props.hasSmartWalletsWithoutBilling && (
            <SmartWalletsBillingAlert teamSlug={props.teamSlug} />
          )}
        </div>

        <div className="h-4" />

        {/* Nav */}
        <TabPathLinks
          links={[
            {
              exactMatch: true,
              name: "Analytics",
              path: `${smartWalletsLayoutSlug}`,
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
          scrollableClassName="container max-w-7xl"
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
