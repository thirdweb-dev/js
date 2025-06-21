"use client";

import { replaceDeployerAddress } from "lib/publisher-utils";
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

export function ProfileHeader(props: {
  profileAddress: string;
  ensName: string | undefined;
  client: ThirdwebClient;
}) {
  return (
    <AccountProvider address={props.profileAddress} client={props.client}>
      <div className="flex w-full flex-col items-center justify-between gap-4 border-border border-b pb-6 md:flex-row">
        <div className="flex w-full items-center gap-4">
          <AccountAvatar
            className="size-20 rounded-full object-cover"
            fallbackComponent={
              <AccountBlobbie className="size-20 rounded-full" />
            }
            loadingComponent={<Skeleton className="size-20 rounded-full" />}
          />
          <div>
            <h1 className="font-semibold text-4xl tracking-tight">
              {/* if we already have an ensName just use it */}
              {props.ensName ? (
                props.ensName
              ) : (
                <AccountName
                  fallbackComponent={
                    <AccountAddress
                      formatFn={(addr) =>
                        shortenIfAddress(replaceDeployerAddress(addr))
                      }
                    />
                  }
                  formatFn={(name) => replaceDeployerAddress(name)}
                  loadingComponent={<Skeleton className="h-8 w-40" />}
                />
              )}
            </h1>
          </div>
        </div>
      </div>
    </AccountProvider>
  );
}
