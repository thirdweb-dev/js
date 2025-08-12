"use client";
import {
  ExternalLinkIcon,
  GlobeIcon,
  Settings2Icon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import { Img } from "@/components/blocks/Img";
import { Button } from "@/components/ui/button";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { DiscordIcon } from "@/icons/brand-icons/DiscordIcon";
import { GithubIcon } from "@/icons/brand-icons/GithubIcon";
import { InstagramIcon } from "@/icons/brand-icons/InstagramIcon";
import { LinkedInIcon } from "@/icons/brand-icons/LinkedinIcon";
import { RedditIcon } from "@/icons/brand-icons/RedditIcon";
import { TelegramIcon } from "@/icons/brand-icons/TelegramIcon";
import { TiktokIcon } from "@/icons/brand-icons/TiktokIcon";
import { XIcon as TwitterXIcon } from "@/icons/brand-icons/XIcon";
import { YoutubeIcon } from "@/icons/brand-icons/YoutubeIcon";
import { ChainIconClient } from "@/icons/ChainIcon";
import { cn } from "@/lib/utils";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";

const platformToIcons: Record<string, React.FC<{ className?: string }>> = {
  discord: DiscordIcon,
  github: GithubIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  reddit: RedditIcon,
  telegram: TelegramIcon,
  tiktok: TiktokIcon,
  twitter: TwitterXIcon,
  website: GlobeIcon,
  x: TwitterXIcon,
  youtube: YoutubeIcon,
};

export function ContractHeaderUI(props: {
  name: string;
  symbol: string | undefined;
  image: string | undefined;
  chainMetadata: ChainMetadata;
  clientContract: ThirdwebContract;
  socialUrls: object;
  imageClassName?: string;
  contractCreator: string | null;
  className?: string;
}) {
  const socialUrls = useMemo(() => {
    const socialUrlsValue: { name: string; href: string }[] = [];
    for (const [key, value] of Object.entries(props.socialUrls)) {
      if (
        typeof value === "string" &&
        typeof key === "string" &&
        isValidUrl(value)
      ) {
        socialUrlsValue.push({ href: value, name: key });
      }
    }

    return socialUrlsValue;
  }, [props.socialUrls]);
  const activeAccount = useActiveAccount();

  const cleanedChainName = props.chainMetadata?.name
    ?.replace("Mainnet", "")
    .trim();

  const validBlockExplorer = getExplorerToShow(props.chainMetadata);

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row lg:items-center gap-5 py-6 relative",
        props.className,
      )}
    >
      <div className="flex">
        <div className="border p-1 rounded-full bg-card">
          <Img
            className={cn("size-28 shrink-0 rounded-full bg-muted")}
            fallback={
              <div className="flex items-center justify-center font-bold text-5xl text-muted-foreground/50 capitalize">
                {props.name[0]}
              </div>
            }
            src={
              props.image
                ? resolveSchemeWithErrorHandler({
                    client: props.clientContract.client,
                    uri: props.image,
                  })
                : ""
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 flex-1">
        {/* top row */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col flex-wrap gap-3 lg:flex-row lg:items-center">
            <h1 className="font-semibold text-3xl tracking-tighter lg:text-5xl">
              {props.name}
            </h1>

            <div className="flex flex-wrap gap-2 ">
              <Link
                className="flex w-fit shrink-0 items-center gap-2 rounded-3xl border border-border bg-card px-2.5 py-1.5 hover:bg-accent"
                href={`/${props.chainMetadata.slug}`}
              >
                <ChainIconClient
                  className="size-4"
                  client={props.clientContract.client}
                  src={props.chainMetadata.icon?.url || ""}
                />
                {cleanedChainName && (
                  <span className="text-xs">{cleanedChainName}</span>
                )}
              </Link>

              {props.contractCreator &&
                validBlockExplorer &&
                props.contractCreator !== ZERO_ADDRESS && (
                  <SocialLink
                    href={`${validBlockExplorer.url}/address/${props.contractCreator}`}
                    name="Contract Owner"
                    icon={UserIcon}
                  />
                )}

              {socialUrls
                .toSorted((a, b) => {
                  const aIcon = platformToIcons[a.name.toLowerCase()];
                  const bIcon = platformToIcons[b.name.toLowerCase()];

                  if (aIcon && bIcon) {
                    return 0;
                  }

                  if (aIcon) {
                    return -1;
                  }

                  return 1;
                })
                .map(({ name, href }) => (
                  <SocialLink
                    href={href}
                    icon={platformToIcons[name.toLowerCase()]}
                    key={name}
                    name={name}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* bottom row */}
        <div className="flex flex-col items-end sm:flex-row flex-wrap sm:items-center gap-2 absolute top-6 right-0 sm:static w-1/2 sm:w-full">
          <CopyAddressButton
            address={props.clientContract.address}
            className="rounded-full bg-card px-2.5 py-1.5 text-xs"
            copyIconPosition="left"
            tooltip="Copy contract address"
            variant="outline"
          />

          {props.contractCreator?.toLowerCase() ===
            activeAccount?.address?.toLowerCase() && (
            <ToolTipLabel
              contentClassName="max-w-[300px]"
              label={
                <>
                  View this contract in thirdweb dashboard to view contract
                  management interface
                </>
              }
            >
              <Button
                asChild
                className="rounded-full bg-card gap-1.5 text-xs py-1.5 px-2.5 h-auto"
                size="sm"
                variant="outline"
              >
                <Link
                  href={`/team/~/~/contract/${props.chainMetadata.slug}/${props.clientContract.address}`}
                >
                  <Settings2Icon className="size-3.5 text-muted-foreground" />
                  Manage Contract
                </Link>
              </Button>
            </ToolTipLabel>
          )}

          {validBlockExplorer && (
            <BadgeLink
              href={`${validBlockExplorer.url.endsWith("/") ? validBlockExplorer.url : `${validBlockExplorer.url}/`}address/${props.clientContract.address}`}
              key={validBlockExplorer.url}
              name={validBlockExplorer.name}
            />
          )}

          {/* TODO - render social links here */}
        </div>
      </div>
    </div>
  );
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function getExplorerToShow(chainMetadata: ChainMetadata) {
  const validBlockExplorers = chainMetadata.explorers?.filter(
    (e) => e.standard === "EIP3091",
  );

  return validBlockExplorers?.[0];
}

function BadgeLink(props: { name: string; href: string; className?: string }) {
  return (
    <Button
      asChild
      className={cn(
        "!h-auto gap-2 rounded-full bg-card px-3 py-1.5 text-xs capitalize",
        props.className,
      )}
      variant="outline"
    >
      <Link href={props.href} rel="noopener noreferrer" target="_blank">
        {props.name}
        <ExternalLinkIcon className="size-3 text-muted-foreground/70" />
      </Link>
    </Button>
  );
}

function SocialLink(props: {
  name: string;
  href: string;
  icon?: React.FC<{ className?: string }>;
}) {
  return (
    <ToolTipLabel contentClassName="capitalize" label={props.name}>
      <Button
        asChild
        className={cn(
          "!h-auto gap-2 rounded-full bg-card px-3 py-1.5 text-xs capitalize",
          props.icon && "rounded-full p-1.5",
        )}
        variant="outline"
      >
        <Link
          className="capitalize"
          href={props.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {props.icon ? <props.icon className="size-4" /> : props.name}
          {!props.icon && (
            <ExternalLinkIcon className="size-3 text-muted-foreground/70" />
          )}
        </Link>
      </Button>
    </ToolTipLabel>
  );
}
