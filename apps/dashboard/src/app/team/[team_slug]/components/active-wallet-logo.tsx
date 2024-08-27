"use client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { type WalletId, getWalletInfo } from "thirdweb/wallets";

export function ActiveWalletLogo(props: {
  className?: string;
  walletId: WalletId | undefined;
}) {
  const { walletId } = props;
  const imageQuery = useQuery({
    queryKey: ["walletInfo", walletId],
    queryFn: () => {
      if (!walletId) {
        throw new Error("No wallet connected");
      }
      return getWalletInfo(walletId, true);
    },
    enabled: !!walletId,
  });

  return imageQuery.data ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageQuery.data} alt="Account" className={props.className} />
  ) : (
    <div className={cn("bg-muted", props.className)} />
  );
}
