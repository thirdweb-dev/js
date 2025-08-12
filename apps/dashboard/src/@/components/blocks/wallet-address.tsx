"use client";
import { CheckIcon, CircleSlashIcon, CopyIcon, XIcon } from "lucide-react";
import { useMemo } from "react";
import { isAddress, type ThirdwebClient, ZERO_ADDRESS } from "thirdweb";
import { Blobbie, type SocialProfile, useSocialProfiles } from "thirdweb/react";
import { Img } from "@/components/blocks/Img";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useClipboard } from "@/hooks/useClipboard";
import { cn } from "@/lib/utils";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";

export function WalletAddress(props: {
  address: string | undefined;
  shortenAddress?: boolean;
  className?: string;
  iconClassName?: string;
  client: ThirdwebClient;
  fallbackIcon?: React.ReactNode;
}) {
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
    client: props.client,
  });

  const { onCopy, hasCopied } = useClipboard(address, 2000);

  if (!isAddress(address)) {
    return (
      <ToolTipLabel hoverable label={address}>
        <span className="flex items-center gap-2 underline-offset-4 hover:underline">
          <div className="flex size-6 items-center justify-center rounded-full border bg-background">
            <XIcon className="size-4 text-muted-foreground" />
          </div>
          Invalid Address
        </span>
      </ToolTipLabel>
    );
  }

  // special case for zero address
  if (address === ZERO_ADDRESS) {
    return (
      <div className="flex items-center gap-2 py-2">
        <CircleSlashIcon
          className={cn("size-6 text-muted-foreground/70", props.iconClassName)}
        />
        <span
          className={cn("cursor-pointer font-mono text-sm", props.className)}
        >
          {shortenedAddress}
        </span>
      </div>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild tabIndex={-1}>
        <Button
          className={cn(
            "flex flex-row items-center gap-2 px-0",
            props.className,
          )}
          onClick={(e) => e.stopPropagation()}
          variant="link"
        >
          {address && (
            <WalletAvatar
              address={address}
              iconClassName={props.iconClassName}
              profiles={profiles.data || []}
              thirdwebClient={props.client}
              fallbackIcon={props.fallbackIcon}
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
              className="flex items-center gap-2"
              onClick={onCopy}
              size="sm"
              variant="outline"
            >
              {hasCopied ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <CopyIcon className="h-4 w-4" />
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
                client: props.client,
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
                        alt={profile.name}
                        className="object-cover"
                        src={walletAvatarLink}
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
  iconClassName?: string;
  fallbackIcon?: React.ReactNode;
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
    <div
      className={cn("size-5 overflow-hidden rounded-full", props.iconClassName)}
    >
      {resolvedAvatarSrc ? (
        <Img
          className={cn("size-5 object-cover", props.iconClassName)}
          src={resolvedAvatarSrc}
        />
      ) : props.fallbackIcon ? (
        props.fallbackIcon
      ) : (
        <Blobbie
          address={props.address}
          className={props.iconClassName}
          size={24}
        />
      )}
    </div>
  );
}
