"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { replaceDeployerAddress } from "lib/publisher-utils";
import Link from "next/link";
import { type ThirdwebClient, ZERO_ADDRESS } from "thirdweb";
import {
  AccountAddress,
  AccountAvatar,
  AccountBlobbie,
  AccountName,
  AccountProvider,
} from "thirdweb/react";
import { shortenIfAddress } from "utils/usedapp-external";
import { useEns } from "../hooks";

interface PublisherHeaderProps {
  wallet: string;
  client: ThirdwebClient;
}
export const PublisherHeader: React.FC<PublisherHeaderProps> = ({
  wallet,
  client,
}) => {
  const ensQuery = useEns({
    client,
    addressOrEnsName: wallet,
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
            fallbackComponent={
              <AccountBlobbie className="size-10 rounded-full" />
            }
            loadingComponent={<Skeleton className="size-10 rounded-full" />}
            className="size-10 rounded-full border border-border border-solid object-cover"
          />

          <Link
            className="before:absolute before:inset-0 hover:underline"
            target="_blank"
            href={replaceDeployerAddress(
              `/${ensQuery.data?.ensName || wallet}`,
            )}
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
              loadingComponent={<Skeleton className="h-8 w-40" />}
              formatFn={(name) => replaceDeployerAddress(name)}
            />
          </Link>
        </div>
      </AccountProvider>

      <Button variant="outline" asChild className="bg-card">
        <Link href={replaceDeployerAddress(`/${wallet}`)}>
          View all contracts
        </Link>
      </Button>
    </div>
  );
};
