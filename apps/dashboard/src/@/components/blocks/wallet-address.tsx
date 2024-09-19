"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useClipboard } from "hooks/useClipboard";
import { Check, Copy, ExternalLinkIcon } from "lucide-react";
import { useMemo } from "react";
import { type ThirdwebClient, isAddress } from "thirdweb";
import { ZERO_ADDRESS } from "thirdweb";
import {
  Blobbie,
  MediaRenderer,
  type SocialProfile,
  useSocialProfiles,
} from "thirdweb/react";
import { resolveScheme } from "thirdweb/storage";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export function WalletAddress(props: {
  address: string | undefined;
  shortenAddress?: boolean;
  className?: string;
}) {
  const thirdwebClient = useThirdwebClient();
  // default back to zero address if no address provided
  const address = useMemo(() => props.address || ZERO_ADDRESS, [props.address]);

  const [shortenedAddress, lessShortenedAddress] = useMemo(() => {
    return [
      props.shortenAddress !== false
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : address,
      `${address.slice(0, 14)}...${address.slice(-12)}`,
    ];
  }, [address, props.shortenAddress]);

  const profiles = useSocialProfiles({
    address: address,
    client: thirdwebClient,
  });

  const { onCopy, hasCopied } = useClipboard(address, 2000);

  if (!isAddress(address)) {
    return <span>Invalid Address ({address})</span>;
  }

  // special case for zero address
  if (address === ZERO_ADDRESS) {
    return <span className="font-mono cursor-pointer">{shortenedAddress}</span>;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          onClick={(e) => e.stopPropagation()}
          variant="link"
          className={cn(
            "flex flex-row gap-2 items-center px-0",
            props.className,
          )}
        >
          {address && (
            <WalletAvatar
              address={address}
              profiles={profiles.data || []}
              thirdwebClient={thirdwebClient}
            />
          )}
          <span className="font-mono cursor-pointer">
            {profiles.data?.[0]?.name || shortenedAddress}
          </span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 border-border"
        onClick={(e) => {
          // do not close the hover card when clicking anywhere in the content
          e.stopPropagation();
        }}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Wallet Address</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onCopy}
              className="flex items-center gap-2"
            >
              {hasCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {hasCopied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <p className="text-sm font-mono bg-muted p-2 rounded text-center">
            {lessShortenedAddress}
          </p>
          <h3 className="text-lg font-semibold">Social Profiles</h3>
          {profiles.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading profiles...</p>
          ) : !profiles.data?.length ? (
            <p className="text-sm text-muted-foreground">No profiles found</p>
          ) : (
            profiles.data?.map((profile) => (
              <div
                className="flex flex-row gap-2 items-center"
                key={profile.type + profile.name}
              >
                {profile.avatar &&
                  (profile.avatar.startsWith("http") ||
                    profile.avatar?.startsWith("ipfs")) && (
                    <Avatar>
                      <AvatarImage
                        src={resolveScheme({
                          client: thirdwebClient,
                          uri: profile.avatar,
                        })}
                        alt={profile.name}
                      />
                      {profile.name && (
                        <AvatarFallback>
                          {profile.name.slice(0, 2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex flex-row gap-4 w-full items-center justify-between">
                    <h4 className="text-md font-semibold">{profile.name}</h4>
                    <Badge variant="outline">{profile.type}</Badge>
                  </div>
                  {profile.bio && (
                    <p className="text-sm text-muted-foreground whitespace-normal line-clamp-1">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
          <Button
            asChild
            variant="upsell"
            className="text-sm flex flex-row gap-2 items-center"
            size="sm"
          >
            <a
              target="_blank"
              href="https://blog.thirdweb.com/changelog/introducing-the-social-sdk?ref=dashboard-social-wallet"
              rel="noreferrer"
            >
              Learn more
              <ExternalLinkIcon className="size-4" />
            </a>
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function WalletAvatar(props: {
  address: string;
  profiles: SocialProfile[];
  thirdwebClient: ThirdwebClient;
}) {
  const avatar = useMemo(() => {
    return props.profiles.find(
      (profile) =>
        profile.avatar &&
        (profile.avatar.startsWith("http") ||
          profile.avatar.startsWith("ipfs")),
    )?.avatar;
  }, [props.profiles]);
  return (
    <div className="size-6 overflow-hidden rounded-full">
      {avatar ? (
        <MediaRenderer
          client={props.thirdwebClient}
          src={avatar}
          className="size-6"
        />
      ) : (
        <Blobbie address={props.address} size={24} />
      )}
    </div>
  );
}
