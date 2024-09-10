"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
  ConnectEmbed,
  type SocialProfile,
  useActiveAccount,
  useSocialProfiles,
} from "thirdweb/react";
import { resolveScheme } from "thirdweb/storage";
import { WALLETS } from "../../lib/constants";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export function SocialProfiles() {
  const [addressOverride, setAddressOverride] = useState<string | undefined>();
  const { theme } = useTheme();
  const account = useActiveAccount();
  const { data: profiles } = useSocialProfiles({
    client: THIRDWEB_CLIENT,
    address: addressOverride || account?.address,
  });

  return account ? (
    <div className="flex flex-col gap-4">
      {profiles?.map((profile) => (
        <SocialProfileCard
          profile={profile}
          key={`${profile.type}-${profile.name}`}
        />
      ))}
      {profiles?.length === 0 && (
        <div>
          <div className="text-center text-lg font-semibold">
            No profiles found.
          </div>
          <Button
            variant="secondary"
            onClick={() =>
              setAddressOverride("0x2247d5d238d0f9d37184d8332aE0289d1aD9991b")
            }
            className="mt-6"
          >
            Preview another user
          </Button>
        </div>
      )}
    </div>
  ) : (
    <ConnectEmbed
      wallets={WALLETS}
      client={THIRDWEB_CLIENT}
      theme={theme === "light" ? "light" : "dark"}
    />
  );
}

function SocialProfileCard({ profile }: { profile: SocialProfile }) {
  return (
    <div className="flex gap-4 w-[300px] bg-background border rounded-lg p-4 shadow-md">
      {profile.avatar ? (
        <img
          src={resolveScheme({ client: THIRDWEB_CLIENT, uri: profile.avatar })}
          alt={profile.name}
          className="size-10 rounded-full"
        />
      ) : (
        <div className="size-10 rounded-full bg-muted-foreground" />
      )}
      <div className="flex gap-2 items-center justify-between flex-1">
        <div className="text-base font-semibold">{profile.name}</div>
        <Badge variant="secondary">{profile.type.toUpperCase()}</Badge>
      </div>
    </div>
  );
}
