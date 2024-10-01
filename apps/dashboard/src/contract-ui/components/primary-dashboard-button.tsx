"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import type { EVMContractInfo } from "@3rdweb-sdk/react";
import {
  useAddContractMutation,
  useAllContractList,
} from "@3rdweb-sdk/react/hooks/useRegistry";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { CodeIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Chain } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

const TRACKING_CATEGORY = "add_to_dashboard_upsell";

type AddToDashboardCardProps = {
  contractAddress: string;
  chain: Chain;
  contractInfo: EVMContractInfo;
  hideCodePageLink?: boolean;
};

export const PrimaryDashboardButton: React.FC<AddToDashboardCardProps> = ({
  contractAddress,
  chain,
  contractInfo,
  hideCodePageLink,
}) => {
  const addContract = useAddContractMutation();
  const trackEvent = useTrack();
  const walletAddress = useActiveAccount()?.address;
  const pathname = usePathname();
  const registry = useAllContractList(walletAddress);

  const { onSuccess: onAddSuccess, onError: onAddError } = useTxNotifications(
    "Successfully imported",
    "Failed to import",
  );

  const isInRegistry =
    registry.isFetched &&
    registry.data?.find(
      (c) =>
        contractAddress &&
        // compare address...
        c.address.toLowerCase() === contractAddress.toLowerCase() &&
        // ... and chainId
        c.chainId === chain.id,
    ) &&
    registry.isSuccess;

  if (
    !walletAddress ||
    !contractAddress ||
    !chain ||
    pathname?.includes("payments")
  ) {
    return null;
  }

  if (isInRegistry) {
    if (hideCodePageLink) {
      return null;
    }

    if (!pathname?.endsWith("/code")) {
      return (
        <Button variant="outline" asChild className="gap-2">
          <Link
            href={`/${contractInfo.chainSlug}/${contractInfo.contractAddress}/code`}
          >
            <CodeIcon className="size-4" />
            Code Snippets
          </Link>
        </Button>
      );
    }

    return null;
  }

  return (
    <Button
      className="gap-2"
      variant="outline"
      onClick={() => {
        if (!chain) {
          return;
        }
        trackEvent({
          category: TRACKING_CATEGORY,
          action: "add-to-dashboard",
          label: "attempt",
          contractAddress,
        });
        addContract.mutate(
          {
            contractAddress,
            chainId: chain.id,
          },
          {
            onSuccess: () => {
              onAddSuccess();
              trackEvent({
                category: TRACKING_CATEGORY,
                action: "add-to-dashboard",
                label: "success",
                contractAddress,
              });
            },
            onError: (err) => {
              onAddError(err);
              trackEvent({
                category: TRACKING_CATEGORY,
                action: "add-to-dashboard",
                label: "error",
                contractAddress,
                error: err,
              });
            },
          },
        );
      }}
    >
      {addContract.isPending ? (
        <Spinner className="size-4" />
      ) : (
        <PlusIcon className="size-4" />
      )}
      Import contract
    </Button>
  );
};
