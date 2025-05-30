import { Img } from "@/components/blocks/Img";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { cn } from "@/lib/utils";
import { ChainIconClient } from "components/icons/ChainIcon";
import { DiscordIcon } from "components/icons/brand-icons/DiscordIcon";
import { GithubIcon } from "components/icons/brand-icons/GithubIcon";
import { InstagramIcon } from "components/icons/brand-icons/InstagramIcon";
import { LinkedInIcon } from "components/icons/brand-icons/LinkedinIcon";
import { RedditIcon } from "components/icons/brand-icons/RedditIcon";
import { TelegramIcon } from "components/icons/brand-icons/TelegramIcon";
import { TiktokIcon } from "components/icons/brand-icons/TiktokIcon";
import { XIcon as TwitterXIcon } from "components/icons/brand-icons/XIcon";
import { YoutubeIcon } from "components/icons/brand-icons/YoutubeIcon";
import { ExternalLinkIcon, GlobeIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";

const platformToIcons: Record<string, React.FC<{ className?: string }>> = {
  twitter: TwitterXIcon,
  x: TwitterXIcon,
  discord: DiscordIcon,
  telegram: TelegramIcon,
  reddit: RedditIcon,
  website: GlobeIcon,
  github: GithubIcon,
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
  linkedin: LinkedInIcon,
};

export function ContractHeaderUI(props: {
  name: string;
  symbol: string | undefined;
  image: string | undefined;
  chainMetadata: ChainMetadata;
  clientContract: ThirdwebContract;
  socialUrls: object;
}) {
  const socialUrls = useMemo(() => {
    const socialUrlsValue: { name: string; href: string }[] = [];
    for (const [key, value] of Object.entries(props.socialUrls)) {
      if (
        typeof value === "string" &&
        typeof key === "string" &&
        isValidUrl(value)
      ) {
        socialUrlsValue.push({ name: key, href: value });
      }
    }

    return socialUrlsValue;
  }, [props.socialUrls]);

  const cleanedChainName = props.chainMetadata?.name
    ?.replace("Mainnet", "")
    .trim();

  const explorersToShow = getExplorersToShow(props.chainMetadata);

  return (
    <div className="flex flex-col items-start gap-4 border-b border-dashed py-8 lg:flex-row lg:items-center">
      {props.image && (
        <Img
          className="size-20 shrink-0 rounded-full border bg-muted"
          src={
            props.image
              ? resolveSchemeWithErrorHandler({
                  uri: props.image,
                  client: props.clientContract.client,
                })
              : ""
          }
          fallback={
            <div className="flex items-center justify-center font-bold text-3xl text-muted-foreground/80">
              {props.name[0]}
            </div>
          }
        />
      )}

      <div className="flex flex-col gap-3">
        {/* top row */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col flex-wrap gap-3 lg:flex-row lg:items-center">
            <h1 className="line-clamp-2 font-bold text-2xl tracking-tight lg:text-3xl">
              {props.name}
            </h1>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/${props.chainMetadata.slug}`}
                className="flex w-fit shrink-0 items-center gap-2 rounded-3xl border border-border bg-card px-2.5 py-1.5 hover:bg-accent"
              >
                <ChainIconClient
                  src={props.chainMetadata.icon?.url || ""}
                  client={props.clientContract.client}
                  className="size-4"
                />
                {cleanedChainName && (
                  <span className="text-xs">{cleanedChainName}</span>
                )}
              </Link>

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
                    key={name}
                    name={name}
                    href={href}
                    icon={platformToIcons[name.toLowerCase()]}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* bottom row */}
        <div className="flex flex-row flex-wrap items-center gap-2">
          <CopyAddressButton
            address={props.clientContract.address}
            copyIconPosition="left"
            className="rounded-full bg-card px-2.5 py-1.5 text-xs"
            variant="outline"
          />

          {explorersToShow?.map((validBlockExplorer) => (
            <BadgeLink
              key={validBlockExplorer.url}
              name={validBlockExplorer.name}
              href={`${validBlockExplorer.url.endsWith("/") ? validBlockExplorer.url : `${validBlockExplorer.url}/`}address/${props.clientContract.address}`}
            />
          ))}

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

function getExplorersToShow(chainMetadata: ChainMetadata) {
  const validBlockExplorers = chainMetadata.explorers
    ?.filter((e) => e.standard === "EIP3091")
    ?.slice(0, 2);

  return validBlockExplorers?.slice(0, 1);
}

function BadgeLink(props: {
  name: string;
  href: string;
}) {
  return (
    <Button
      variant="outline"
      asChild
      className="!h-auto gap-2 rounded-full bg-card px-3 py-1.5 text-xs capitalize"
    >
      <Link href={props.href} target="_blank">
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
    <ToolTipLabel label={props.name} contentClassName="capitalize">
      <Button
        variant="outline"
        asChild
        className={cn(
          "!h-auto gap-2 rounded-full bg-card px-3 py-1.5 text-xs capitalize",
          props.icon && "rounded-full p-1.5",
        )}
      >
        <Link href={props.href} target="_blank" className="capitalize">
          {props.icon ? <props.icon className="size-4" /> : props.name}
          {!props.icon && (
            <ExternalLinkIcon className="size-3 text-muted-foreground/70" />
          )}
        </Link>
      </Button>
    </ToolTipLabel>
  );
}
