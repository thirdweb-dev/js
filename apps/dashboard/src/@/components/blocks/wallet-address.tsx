"use client";
import { CircleSlashIcon, XIcon } from "lucide-react";
import { useMemo } from "react";
import { isAddress, type ThirdwebClient, ZERO_ADDRESS } from "thirdweb";
import { Blobbie, type SocialProfile, useSocialProfiles } from "thirdweb/react";
import { Img } from "@/components/blocks/Img";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";
import { CopyTextButton } from "../ui/CopyTextButton";
import { Skeleton } from "../ui/skeleton";

type WalletAddressProps = {
  address: string | undefined;
  shortenAddress?: boolean;
  className?: string;
  iconClassName?: string;
  client: ThirdwebClient;
  fallbackIcon?: React.ReactNode;
};

export function WalletAddress(props: WalletAddressProps) {
  const profiles = useSocialProfiles({
    address: props.address,
    client: props.client,
  });

  return (
    <WalletAddressUI
      {...props}
      profiles={{
        data: profiles.data || [],
        isPending: profiles.isPending,
      }}
    />
  );
}

export function WalletAddressUI(
  props: WalletAddressProps & {
    profiles: {
      data: SocialProfile[];
      isPending: boolean;
    };
  },
) {
  // default back to zero address if no address provided
  const address = useMemo(() => props.address || ZERO_ADDRESS, [props.address]);

  const [shortenedAddress, _lessShortenedAddress] = useMemo(() => {
    return [
      props.shortenAddress !== false
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : address,
      `${address.slice(0, 14)}...${address.slice(-12)}`,
    ];
  }, [address, props.shortenAddress]);

  if (!isAddress(address)) {
    return (
      <ToolTipLabel hoverable label={address}>
        <span className="flex items-center gap-2 underline-offset-4 hover:underline w-fit">
          <div className="flex size-5 items-center justify-center rounded-full border bg-background">
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
          className={cn("size-5 text-muted-foreground/70", props.iconClassName)}
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
            "flex flex-row items-center gap-2 px-0 max-w-full truncate",
            props.className,
          )}
          onClick={(e) => e.stopPropagation()}
          variant="link"
        >
          {address && (
            <WalletAvatar
              address={address}
              iconClassName={props.iconClassName}
              profiles={props.profiles.data}
              thirdwebClient={props.client}
              fallbackIcon={props.fallbackIcon}
            />
          )}
          <span className="cursor-pointer font-mono max-w-full truncate">
            {props.profiles.data?.[0]?.name || shortenedAddress}
          </span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-[calc(100vw-2rem)] lg:w-[450px] border-border rounded-xl p-4 lg:p-6"
        onClick={(e) => {
          // do not close the hover card when clicking anywhere in the content
          e.stopPropagation();
        }}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-medium text-sm">Wallet Address</h3>

            <CopyTextButton
              textToShow={address}
              textToCopy={address}
              tooltip="Copy address"
              copyIconPosition="right"
              variant="ghost"
              className="text-muted-foreground -translate-x-1.5"
            />
          </div>

          <div className="space-y-1 border-t pt-5 border-dashed">
            <h3 className="font-medium text-sm">Social Profiles</h3>

            {props.profiles.isPending ? (
              <Skeleton className="h-4 w-[50%]" />
            ) : !props.profiles.data?.length ? (
              <p className="text-muted-foreground text-sm">No profiles found</p>
            ) : (
              <div className="!mt-2">
                {props.profiles.data?.map((profile) => {
                  const walletAvatarLink = resolveSchemeWithErrorHandler({
                    client: props.client,
                    uri: profile.avatar,
                  });

                  return (
                    <div
                      className="flex flex-row items-center gap-3 py-2"
                      key={profile.type + profile.name}
                    >
                      <Avatar className="size-9">
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

                      <div className="space-y-0.5">
                        <h4 className="text-sm leading-none">{profile.name}</h4>
                        <span className="text-muted-foreground text-xs leading-none capitalize">
                          {profile.type === "ens" ? "ENS" : profile.type}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
          fallback={
            <Blobbie
              address={props.address}
              className={props.iconClassName}
              size={20}
            />
          }
        />
      ) : props.fallbackIcon ? (
        props.fallbackIcon
      ) : (
        <Blobbie
          address={props.address}
          className={props.iconClassName}
          size={20}
        />
      )}
    </div>
  );
}
