"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { useClipboard } from "hooks/useClipboard";
import { Check, Copy } from "lucide-react";
import { useMemo } from "react";
import { type ThirdwebClient, isAddress } from "thirdweb";
import { ZERO_ADDRESS } from "thirdweb";
import { Blobbie, type SocialProfile, useSocialProfiles } from "thirdweb/react";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Img } from "./Img";

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
    return <span className="cursor-pointer font-mono">{shortenedAddress}</span>;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          onClick={(e) => e.stopPropagation()}
          variant="link"
          className={cn(
            "flex flex-row items-center gap-2 px-0",
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
          <span className="cursor-pointer font-mono">
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
            <h3 className="font-semibold text-lg">Wallet Address</h3>
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
          <p className="rounded bg-muted p-2 text-center font-mono text-sm">
            {lessShortenedAddress}
          </p>
          <h3 className="font-semibold text-lg">Social Profiles</h3>
          {profiles.isPending ? (
            <p className="text-muted-foreground text-sm">Loading profiles...</p>
          ) : !profiles.data?.length ? (
            <p className="text-muted-foreground text-sm">No profiles found</p>
          ) : (
            profiles.data?.map((profile) => {
              const walletAvatarLink = resolveSchemeWithErrorHandler({
                client: thirdwebClient,
                uri: profile.avatar,
              });

              return (
                <div
                  className="flex flex-row items-center gap-2"
                  key={profile.type + profile.name}
                >
                  {walletAvatarLink && (
                    <Avatar>
                      <AvatarImage
                        src={walletAvatarLink}
                        alt={profile.name}
                        className="object-cover"
                      />
                      {profile.name && (
                        <AvatarFallback>
                          {profile.name.slice(0, 2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex w-full flex-row items-center justify-between gap-4">
                      <h4 className="font-semibold text-md">{profile.name}</h4>
                      <Badge variant="outline">{profile.type}</Badge>
                    </div>
                    {profile.bio && (
                      <p className="line-clamp-1 whitespace-normal text-muted-foreground text-sm">
                        {profile.bio}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
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

  const resolvedAvatarSrc = avatar
    ? resolveSchemeWithErrorHandler({
        client: props.thirdwebClient,
        uri: avatar,
      })
    : undefined;

  return (
    <div className="size-6 overflow-hidden rounded-full">
      {resolvedAvatarSrc ? (
        <Img src={resolvedAvatarSrc} className="size-6 object-cover" />
      ) : (
        <Blobbie address={props.address} size={24} />
      )}
    </div>
  );
}
