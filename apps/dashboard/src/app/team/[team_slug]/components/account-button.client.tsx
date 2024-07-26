"use client";

import { Button } from "@/components/ui/button";
import { thirdwebClient } from "@/constants/client";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useQuery } from "@tanstack/react-query";
import { resolveAvatar, resolveName } from "thirdweb/extensions/ens";
import { useAutoConnect, useWalletDetailsModal } from "thirdweb/react";

import { useTheme } from "next-themes";
import type { ThirdwebClient } from "thirdweb";
import { ActiveWalletLogo } from "./active-wallet-logo";

export function AccountButton(props: {
  client: ThirdwebClient;
  initialData?: string | null;
}) {
  // trigger auto-connection of the wallet
  useAutoConnect({
    client: thirdwebClient,
  });
  // use the connected user (also ensures login state!)
  const loggedInUser = useLoggedInUser();
  const { open } = useWalletDetailsModal();

  const ensAvatar = useQuery({
    queryKey: ["ens-avatar", loggedInUser.user?.address],
    queryFn: async () => {
      if (!loggedInUser.user?.address) {
        throw new Error("No wallet connected");
      }
      const ensName = await resolveName({
        client: props.client,
        address: loggedInUser.user.address,
      });
      if (!ensName) {
        return null;
      }
      return resolveAvatar({
        client: props.client,
        name: ensName,
      });
    },
    enabled: !!loggedInUser.user?.address,
    // initialize the query with the intial data if available
    placeholderData: props.initialData,
  });

  const { theme } = useTheme();

  let content: React.ReactNode;
  if (ensAvatar.data) {
    content = (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ensAvatar.data}
          className="h-full w-full rounded-full"
          alt=""
        />
        <ActiveWalletLogo className="size-5 rounded-full absolute top-0 right-0 translate-x-2 -translate-y-2 border border-card" />
      </>
    );
  } else {
    content = <ActiveWalletLogo className="h-full w-full rounded-full" />;
  }

  return (
    <Button
      onClick={() => {
        open({
          client: props.client,
          theme: theme === "light" ? "light" : "dark",
        });
      }}
      size="icon"
      className="rounded-full relative hover:outline-primary hover:outline hover:outline-2 hover:outline-offset-2"
      variant="ghost"
    >
      {content}
    </Button>
  );
}
