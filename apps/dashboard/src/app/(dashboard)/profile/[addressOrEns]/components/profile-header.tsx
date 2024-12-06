"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { replaceDeployerAddress } from "lib/publisher-utils";
import {
  AccountAddress,
  AccountAvatar,
  AccountBlobbie,
  AccountName,
  AccountProvider,
} from "thirdweb/react";
import { shortenIfAddress } from "utils/usedapp-external";

export function ProfileHeader(props: { profileAddress: string }) {
  const client = useThirdwebClient();
  return (
    <AccountProvider address={props.profileAddress} client={client}>
      <div className="flex w-full flex-col items-center justify-between gap-4 border-border border-b pb-6 md:flex-row">
        <div className="flex w-full items-center gap-4">
          <AccountAvatar
            className="size-20 rounded-full"
            loadingComponent={<Skeleton className="size-20 rounded-full" />}
            fallbackComponent={
              <AccountBlobbie className="size-20 rounded-full" />
            }
          />
          <div>
            <h1 className="font-semibold text-4xl tracking-tight">
              <AccountName
                fallbackComponent={
                  <AccountAddress
                    formatFn={(addr) =>
                      shortenIfAddress(replaceDeployerAddress(addr))
                    }
                  />
                }
                loadingComponent={<Skeleton className="h-8 w-40" />}
                formatFn={(name) => replaceDeployerAddress(name)}
              />
            </h1>
          </div>
        </div>
      </div>
    </AccountProvider>
  );
}
