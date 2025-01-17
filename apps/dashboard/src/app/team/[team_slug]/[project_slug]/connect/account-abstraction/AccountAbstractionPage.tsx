"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TabPathLinks } from "@/components/ui/tabs";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import {
  type ApiKeyService,
  accountStatus,
  useUserOpUsageAggregate,
} from "@3rdweb-sdk/react/hooks/useApi";
import { SmartWalletsBillingAlert } from "components/settings/ApiKeys/Alerts";
import { CircleAlertIcon } from "lucide-react";
import { useMemo } from "react";
import { useActiveWalletChain } from "thirdweb/react";
import { AccountAbstractionSummary } from "../../../../../../components/smart-wallets/AccountAbstractionAnalytics/AccountAbstractionSummary";
import { AAFooterSection } from "./AAFooterSection";
import { isOpChainId } from "./isOpChain";

const TRACKING_CATEGORY = "smart-wallet";

export function AccountAbstractionLayout(props: {
  projectSlug: string;
  teamSlug: string;
  projectKey: string;
  apiKeyServices: ApiKeyService[];
  billingStatus: "validPayment" | (string & {}) | null;
  children: React.ReactNode;
}) {
  const { apiKeyServices } = props;

  const chain = useActiveWalletChain();

  const hasSmartWalletsWithoutBilling = useMemo(() => {
    return apiKeyServices.find(
      (s) =>
        props.billingStatus !== accountStatus.validPayment &&
        s.name === "bundler",
    );
  }, [apiKeyServices, props.billingStatus]);

  const isOpChain = chain?.id ? isOpChainId(chain.id) : false;

  const smartWalletsLayoutSlug = `/team/${props.teamSlug}/${props.projectSlug}/connect/account-abstraction`;

  const aggregateUserOpUsageQuery = useUserOpUsageAggregate({
    clientId: props.projectKey,
  });

  return (
    <div>
      <h1 className="mb-1 font-semibold text-2xl tracking-tight lg:text-3xl">
        Account Abstraction
      </h1>
      <p className="text-muted-foreground text-sm">
        Easily integrate Account abstraction (ERC-4337) compliant smart accounts
        into your apps.{" "}
        <TrackedLinkTW
          target="_blank"
          label="docs-wallets"
          category={TRACKING_CATEGORY}
          href="https://portal.thirdweb.com/wallets/smart-wallet"
          className="text-link-foreground hover:text-foreground"
        >
          View Documentation
        </TrackedLinkTW>
      </p>
      <div className="h-6" />
      <div className="flex flex-col gap-6">
        {hasSmartWalletsWithoutBilling ? (
          <SmartWalletsBillingAlert />
        ) : (
          isOpChain && (
            <Alert variant="info">
              <CircleAlertIcon className="size-4" />
              <AlertTitle>
                Using the gas credits for OP chain paymaster
              </AlertTitle>
              <AlertDescription>
                Credits will automatically be applied to cover gas fees for any
                onchain activity across thirdweb services. <br />
                Eligible chains: OP Mainnet, Base, Zora, Frax, Mode.
              </AlertDescription>
            </Alert>
          )
        )}

        <div>
          <AccountAbstractionSummary
            aggregateUserOpUsageQuery={aggregateUserOpUsageQuery.data}
          />

          <div className="h-12" />
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
