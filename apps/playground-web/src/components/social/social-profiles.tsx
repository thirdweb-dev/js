"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { isAddress } from "thirdweb";
import { resolveAddress } from "thirdweb/extensions/ens";
import { type SocialProfile, getSocialProfiles } from "thirdweb/social";
import { resolveScheme } from "thirdweb/storage";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function SocialProfiles() {
  const [address, setAddress] = useState<string | undefined>();
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);

  const { mutate: searchProfiles, isPending } = useMutation({
    mutationFn: async (address: string) => {
      const resolvedAddress = await (async () => {
        if (address.endsWith(".eth")) {
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
          client: THIRDWEB_CLIENT,
          address: resolvedAddress,
        });
        setProfiles(profiles);
      }
    },
  });

  return (
    <div className="flex w-[300px] min-h-[300px] flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Enter an address or ENS"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button
          onClick={() => searchProfiles(address || "")}
          disabled={!address}
        >
          Search
        </Button>
      </div>
      {!isPending &&
        profiles?.map((profile) => (
          <SocialProfileCard
            profile={profile}
            key={`${profile.type}-${profile.name}`}
          />
        ))}
      {(profiles?.length === 0 || !profiles) && !isPending && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center text-lg font-semibold text-muted-foreground">
            No profiles found.
          </div>
        </div>
      )}
      {isPending && (
        <div className="w-full flex justify-center items-center h-full">
          <Loader2Icon className="animate-spin size-10 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

function SocialProfileCard({ profile }: { profile: SocialProfile }) {
  // This query protects against weird avatar formats that might be returned
  const { data: avatar } = useQuery({
    queryKey: ["avatar", profile.avatar],
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
  });

  return (
    <div className="flex gap-4 bg-background border rounded-lg p-4 shadow-md">
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt={profile.name} className="size-10 rounded-full" />
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
