"use client";

import Link from "next/link";
import { type ThirdwebClient, ZERO_ADDRESS } from "thirdweb";
import {
  AccountAddress,
  AccountAvatar,
  AccountBlobbie,
  AccountName,
  AccountProvider,
} from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEns } from "@/hooks/contract-hooks";
import { replaceDeployerAddress } from "@/lib/publisher-utils";
import { shortenIfAddress } from "@/utils/usedapp-external";

interface PublisherHeaderProps {
  wallet: string;
  client: ThirdwebClient;
}
export const PublisherHeader: React.FC<PublisherHeaderProps> = ({
  wallet,
  client,
}) => {
  const ensQuery = useEns({
    addressOrEnsName: wallet,
    client,
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <h4 className="font-semibold text-lg tracking-tight">Published by</h4>

      <AccountProvider
        // passing zero address during loading time to prevent the component from crashing
        address={ensQuery.data?.address || ZERO_ADDRESS}
        client={client}
      >
        <div className="relative flex items-center gap-3">
          <AccountAvatar
            className="size-10 rounded-full border border-border border-solid object-cover"
            fallbackComponent={
              <AccountBlobbie className="size-10 rounded-full" />
            }
            loadingComponent={<Skeleton className="size-10 rounded-full" />}
          />

          <Link
            className="before:absolute before:inset-0 hover:underline"
            href={replaceDeployerAddress(
              `/${ensQuery.data?.ensName || wallet}`,
            )}
            rel="noopener noreferrer"
            target="_blank"
          >
            <AccountName
              className="font-medium"
              fallbackComponent={
                // When social profile API support other TLDs as well - we can remove this condition
                ensQuery.data?.ensName ? (
                  <span> {ensQuery.data?.ensName} </span>
                ) : (
                  <AccountAddress
                    formatFn={(addr) =>
                      shortenIfAddress(replaceDeployerAddress(addr))
                    }
                  />
                )
              }
              formatFn={(name) => replaceDeployerAddress(name)}
              loadingComponent={<Skeleton className="h-8 w-40" />}
            />
          </Link>
        </div>
      </AccountProvider>

      <Button asChild className="bg-card" variant="outline">
        <Link href={replaceDeployerAddress(`/${wallet}`)}>
          View all contracts
        </Link>
      </Button>
    </div>
  );
};
