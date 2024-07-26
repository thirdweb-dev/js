"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useActiveWallet } from "thirdweb/react";
import { getWalletInfo } from "thirdweb/wallets";

export function ActiveWalletLogo(props: {
  className?: string;
}) {
  const connectedWallet = useActiveWallet();

  const walletQuery = useQuery({
    queryKey: ["walletInfo", connectedWallet?.id],
    queryFn: () => {
      if (!connectedWallet?.id) {
        throw new Error("No wallet connected");
      }
      return getWalletInfo(connectedWallet.id, true);
    },
    enabled: !!connectedWallet?.id,
  });

  return walletQuery.data ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={walletQuery.data} alt="Account" className={props.className} />
  ) : (
    <Skeleton className={props.className} />
  );
}
