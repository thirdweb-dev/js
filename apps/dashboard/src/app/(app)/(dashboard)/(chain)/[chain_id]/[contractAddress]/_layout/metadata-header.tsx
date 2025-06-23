"use client";

import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import type { ThirdwebClient } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { MediaRenderer } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { ChainIconClient } from "@/icons/ChainIcon";

interface ExternalLink {
  name: string;
  url: string;
}
interface MetadataHeaderProps {
  address: string;
  data?: {
    name?: string | number | null;
    description?: string | null;
    image?: string | null;
  };
  chain: ChainMetadata;
  externalLinks?: ExternalLink[];
  client: ThirdwebClient;
}

export const MetadataHeader: React.FC<MetadataHeaderProps> = ({
  address,
  data,
  chain,
  externalLinks,
  client,
}) => {
  const cleanedChainName = chain?.name?.replace("Mainnet", "").trim();
  const validBlockExplorers = chain?.explorers
    ?.filter((e) => e.standard === "EIP3091")
    ?.slice(0, 2);

  const validExternalLinks = externalLinks?.filter((e) => {
    if (!e.url) {
      return false;
    }
    if (!e.name) {
      return false;
    }
    try {
      new URL(e.url);
      return true;
    } catch {
      return false;
    }
  });

  return (
    <div className="flex w-full gap-4">
      {data?.image && (
        <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted md:size-20">
          <MediaRenderer
            alt={""}
            className="h-full w-full"
            client={client}
            src={data?.image}
            style={{
              objectFit: "contain",
            }}
          />
        </div>
      )}

      <div className="flex grow flex-col gap-3">
        {/* Title */}
        {!data ? (
          <h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
            No Contract Metadata Detected
          </h1>
        ) : (
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {data?.name && (
              <h1 className="line-clamp-2 font-bold text-2xl tracking-tight lg:text-3xl">
                {data.name}
              </h1>
            )}

            <Link
              className="flex w-fit shrink-0 items-center gap-2 rounded-3xl border border-border bg-card px-2.5 py-1.5 hover:bg-accent"
              href={`/${chain.slug}`}
            >
              <ChainIconClient
                className="size-4"
                client={client}
                src={chain.icon?.url}
              />
              {cleanedChainName && (
                <span className="text-xs">{cleanedChainName}</span>
              )}
            </Link>
          </div>
        )}

        {!data && (
          <p className="text-muted-foreground text-sm">
            This contract does not implement any standards that can be used to
            retrieve metadata. All other functionality is still available.
          </p>
        )}

        {data?.description && (
          <p className="text-muted-foreground text-sm">{data.description}</p>
        )}

        <div className="flex flex-row flex-wrap items-center gap-2">
          <CopyAddressButton
            address={address}
            className="bg-card px-2.5 py-1.5 text-xs"
            copyIconPosition="left"
            variant="outline"
          />

          {validBlockExplorers?.map((validBlockExplorer) => (
            <BadgeLink
              href={`${validBlockExplorer.url.endsWith("/") ? validBlockExplorer.url : `${validBlockExplorer.url}/`}address/${address}`}
              key={validBlockExplorer.url}
              name={validBlockExplorer.name}
            />
          ))}

          {validExternalLinks?.map((e) => (
            <BadgeLink href={e.url} key={e.url} name={e.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

function BadgeLink(props: { name: string; href: string }) {
  return (
    <Button
      asChild
      className="!h-auto gap-2 rounded-lg bg-card px-3 py-1.5 text-xs capitalize"
      variant="outline"
    >
      <Link href={props.href} rel="noopener noreferrer" target="_blank">
        {props.name}
        <ExternalLinkIcon className="size-3 text-muted-foreground" />
      </Link>
    </Button>
  );
}
