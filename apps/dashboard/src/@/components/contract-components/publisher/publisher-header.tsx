"use client";

import { Edit3Icon } from "lucide-react";
import Link from "next/link";
import { type ThirdwebClient, ZERO_ADDRESS } from "thirdweb";
import {
  AccountAddress,
  AccountAvatar,
  AccountName,
  AccountProvider,
} from "thirdweb/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEns } from "@/hooks/contract-hooks";
import { replaceDeployerAddress } from "@/lib/publisher-utils";
import { shortenIfAddress } from "@/utils/usedapp-external";

export function PublisherLink({
  wallet,
  client,
}: {
  wallet: string;
  client: ThirdwebClient;
}) {
  const ensQuery = useEns({
    addressOrEnsName: wallet,
    client,
  });

  return (
    <AccountProvider
      // passing zero address during loading time to prevent the component from crashing
      address={ensQuery.data?.address || ZERO_ADDRESS}
      client={client}
    >
      <div className="flex items-center gap-2.5 relative">
        <div>
          <AccountAvatar
            className="size-[34px] rounded-full border border-border border-solid object-cover"
            fallbackComponent={
              <div className="size-[34px] rounded-full flex items-center justify-center border bg-card">
                <Edit3Icon className="size-3.5 text-muted-foreground" />
              </div>
            }
            loadingComponent={<Skeleton className="size-[34px] rounded-full" />}
          />
        </div>

        <Link
          className="hover:underline before:absolute before:inset-0 space-y-1.5"
          href={replaceDeployerAddress(`/${ensQuery.data?.ensName || wallet}`)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="text-sm font-medium text-foreground leading-none">
            Published by
          </div>

          <AccountName
            className="text-sm text-foreground leading-none"
            fallbackComponent={
              // When social profile API support other TLDs as well - we can remove this condition
              ensQuery.data?.ensName ? (
                <span className="text-sm text-muted-foreground leading-none">
                  {ensQuery.data?.ensName}
                </span>
              ) : (
                <AccountAddress
                  className="text-sm text-muted-foreground leading-none"
                  formatFn={(addr) =>
                    shortenIfAddress(replaceDeployerAddress(addr))
                  }
                />
              )
            }
            formatFn={(name) => replaceDeployerAddress(name)}
            loadingComponent={<Skeleton className="h-[17px] w-40" />}
          />
        </Link>
      </div>
    </AccountProvider>
  );
}
