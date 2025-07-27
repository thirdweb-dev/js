"use client";

import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { type ThirdwebClient, ZERO_ADDRESS } from "thirdweb";
import {
  AccountAddress,
  AccountAvatar,
  AccountBlobbie,
  AccountName,
  AccountProvider,
} from "thirdweb/react";
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
    <div>
      <h4 className="font-medium text-base mb-3">Published by</h4>
      <AccountProvider
        // passing zero address during loading time to prevent the component from crashing
        address={ensQuery.data?.address || ZERO_ADDRESS}
        client={client}
      >
        <div className="flex items-center gap-3 relative">
          <div className="translate-y-0.5">
            <AccountAvatar
              className="size-[34px] rounded-full border border-border border-solid object-cover"
              fallbackComponent={
                <AccountBlobbie className="size-[34px] rounded-full" />
              }
              loadingComponent={
                <Skeleton className="size-[34px] rounded-full" />
              }
            />
          </div>

          <div className="space-y-1">
            <Link
              className="hover:underline leading-none before:absolute before:inset-0"
              href={replaceDeployerAddress(
                `/${ensQuery.data?.ensName || wallet}`,
              )}
              rel="noopener noreferrer"
              target="_blank"
            >
              <AccountName
                className="text-base leading-none font-medium"
                fallbackComponent={
                  // When social profile API support other TLDs as well - we can remove this condition
                  ensQuery.data?.ensName ? (
                    <span className="text-base leading-none font-medium">
                      {ensQuery.data?.ensName}
                    </span>
                  ) : (
                    <AccountAddress
                      formatFn={(addr) =>
                        shortenIfAddress(replaceDeployerAddress(addr))
                      }
                    />
                  )
                }
                formatFn={(name) => replaceDeployerAddress(name)}
                loadingComponent={<Skeleton className="h-6 w-40" />}
              />
            </Link>

            <span className="text-sm text-muted-foreground flex items-center gap-1.5 leading-none">
              View all published contracts{" "}
              <ExternalLinkIcon className="size-3 text-muted-foreground" />
            </span>
          </div>
        </div>
      </AccountProvider>
    </div>
  );
};
