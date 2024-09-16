"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import {
  AccountStatus,
  type ApiKeyService,
  useAccount,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { SmartWalletsBillingAlert } from "components/settings/ApiKeys/Alerts";
import { CircleAlertIcon } from "lucide-react";
import { useMemo } from "react";
import { useActiveWalletChain } from "thirdweb/react";
import { SmartWallets } from "../../../../../../components/smart-wallets";
import { AAFooterSection } from "./AAFooterSection";
import { isOpChainId } from "./isOpChain";

const TRACKING_CATEGORY = "smart-wallet";

export function AccountAbstractionPage(props: {
  apiKeyServices: ApiKeyService[];
}) {
  const { apiKeyServices } = props;
  const looggedInUserQuery = useLoggedInUser();
  const accountQuery = useAccount();
  const chain = useActiveWalletChain();

  const hasSmartWalletsWithoutBilling = useMemo(() => {
    if (!accountQuery.data) {
      return;
    }

    return apiKeyServices.find(
      (s) =>
        accountQuery.data.status !== AccountStatus.ValidPayment &&
        s.name === "bundler",
    );
  }, [apiKeyServices, accountQuery.data]);

  const isOpChain = chain?.id ? isOpChainId(chain.id) : false;

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-1">
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

      {looggedInUserQuery.isLoading ? (
        <div className="flex items-center justify-center h-[400px] border border-border rounded-lg">
          <Spinner className="size-14" />
        </div>
      ) : (
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
                  Credits will automatically be applied to cover gas fees for
                  any onchain activity across thirdweb services. <br />
                  Eligible chains: OP Mainnet, Base, Zora, Frax, Mode.
                </AlertDescription>
              </Alert>
            )
          )}

          <SmartWallets
            apiKeyServices={apiKeyServices}
            trackingCategory={TRACKING_CATEGORY}
          />
        </div>
      )}

      <div className="h-14" />
      <AAFooterSection trackingCategory={TRACKING_CATEGORY} />
    </div>
  );
}
