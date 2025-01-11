"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { replaceDeployerAddress } from "lib/publisher-utils";
import Link from "next/link";
import {
  AccountAddress,
  AccountAvatar,
  AccountBlobbie,
  AccountName,
  AccountProvider,
} from "thirdweb/react";
import { shortenIfAddress } from "utils/usedapp-external";

interface ContractPublisherProps {
  addressOrEns: string;
}

export const ContractPublisher: React.FC<ContractPublisherProps> = ({
  addressOrEns,
}) => {
  const client = useThirdwebClient();
  return (
    <AccountProvider address={addressOrEns} client={client}>
      <Link
        className="flex shrink-0 items-center gap-1.5 hover:underline"
        href={replaceDeployerAddress(`/${addressOrEns}`)}
      >
        <AccountAvatar
          fallbackComponent={<AccountBlobbie className="size-5 rounded-full" />}
          loadingComponent={<Skeleton className="size-5 rounded-full" />}
          className="size-5 rounded-full object-cover"
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
          loadingComponent={<Skeleton className="h-4 w-40" />}
          formatFn={(name) => replaceDeployerAddress(name)}
        />
      </Link>
    </AccountProvider>
  );
};
