"use client";

import { replaceDeployerAddress } from "lib/publisher-utils";
import Link from "next/link";
import type { ThirdwebClient } from "thirdweb";
import {
  AccountAddress,
  AccountAvatar,
  AccountBlobbie,
  AccountName,
  AccountProvider,
} from "thirdweb/react";
import { shortenIfAddress } from "utils/usedapp-external";
import { Skeleton } from "@/components/ui/skeleton";

interface ContractPublisherProps {
  addressOrEns: string;
  client: ThirdwebClient;
}

export const ContractPublisher: React.FC<ContractPublisherProps> = ({
  addressOrEns,
  client,
}) => {
  return (
    <AccountProvider address={addressOrEns} client={client}>
      <Link
        className="flex shrink-0 items-center gap-1.5 hover:underline"
        href={replaceDeployerAddress(`/${addressOrEns}`)}
      >
        <AccountAvatar
          className="size-5 rounded-full object-cover"
          fallbackComponent={<AccountBlobbie className="size-5 rounded-full" />}
          loadingComponent={<Skeleton className="size-5 rounded-full" />}
        />

        <AccountName
          className="text-xs"
          fallbackComponent={
            <AccountAddress
              className="text-xs"
              formatFn={(addr) =>
                shortenIfAddress(replaceDeployerAddress(addr))
              }
            />
          }
          formatFn={(name) => replaceDeployerAddress(name)}
          loadingComponent={<Skeleton className="h-4 w-40" />}
        />
      </Link>
    </AccountProvider>
  );
};
