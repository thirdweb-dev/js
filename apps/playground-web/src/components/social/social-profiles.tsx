"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { isAddress } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import { getSocialProfiles, type SocialProfile } from "thirdweb/social";
import { resolveScheme } from "thirdweb/storage";
import { isValidENSName } from "thirdweb/utils";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function SocialProfiles() {
  const [address, setAddress] = useState<string | undefined>();
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);

  const { mutate: searchProfiles, isPending } = useMutation({
    mutationFn: async (address: string) => {
      const resolvedAddress = await (async () => {
        if (isValidENSName(address)) {
          return resolveAddress({
            client: THIRDWEB_CLIENT,
            name: address,
          });
        }
        if (isAddress(address)) {
          return address;
        }
        return undefined;
      })();

      if (!resolvedAddress) {
        setProfiles([]);
      } else {
        const profiles = await getSocialProfiles({
          address: resolvedAddress,
          client: THIRDWEB_CLIENT,
        });
        setProfiles(profiles);
      }
    },
  });

  return (
    <div className="flex min-h-[300px] w-[300px] flex-col gap-4">
      <div className="flex items-center gap-2">
        <Input
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter an address or ENS"
          value={address}
        />
        <Button
          disabled={!address}
          onClick={() => searchProfiles(address || "")}
        >
          Search
        </Button>
      </div>
      {!isPending &&
        profiles?.map((profile) => (
          <SocialProfileCard
            key={`${profile.type}-${profile.name}`}
            profile={profile}
          />
        ))}
      {(profiles?.length === 0 || !profiles) && !isPending && (
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="text-center font-semibold text-lg text-muted-foreground">
            No profiles found.
          </div>
        </div>
      )}
      {isPending && (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2Icon className="size-10 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

function SocialProfileCard({ profile }: { profile: SocialProfile }) {
  // This query protects against weird avatar formats that might be returned
  const { data: avatar } = useQuery({
    queryFn: async () => {
      if (profile.avatar) {
        try {
          return resolveScheme({
            client: THIRDWEB_CLIENT,
            uri: profile.avatar,
          });
        } catch {
          return "";
        }
      }
    },
    queryKey: ["avatar", profile.avatar],
  });

  return (
    <div className="flex gap-4 rounded-lg border bg-background p-4 shadow-md">
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={profile.name} className="size-10 rounded-full" src={avatar} />
      ) : (
        <div className="size-10 rounded-full bg-muted-foreground" />
      )}
      <div className="flex flex-1 items-center justify-between gap-2">
        <div className="font-semibold text-base">{profile.name}</div>
        <Badge variant="secondary">{profile.type.toUpperCase()}</Badge>
      </div>
    </div>
  );
}
