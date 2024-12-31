"use client";

import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { Button } from "@/components/ui/button";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { ChainIcon } from "components/icons/ChainIcon";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import type { ChainMetadata } from "thirdweb/chains";
import { MediaRenderer } from "thirdweb/react";

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
}

export const MetadataHeader: React.FC<MetadataHeaderProps> = ({
  address,
  data,
  chain,
  externalLinks,
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
            src={data?.image}
            client={getThirdwebClient()}
            alt={""}
            className="h-full w-full"
            style={{
              objectFit: "contain",
            }}
          />
        </div>
      )}

      <div className="flex grow flex-col gap-4">
        {/* Title */}
        {!data ? (
          <h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
            No Contract Metadata Detected
          </h1>
        ) : (
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {data?.name && (
              <h1 className="line-clamp-2 font-semibold text-2xl tracking-tight lg:text-3xl">
                {data.name}
              </h1>
            )}

            {chain && (
              <Link
                href={`/${chain.slug}`}
                className="flex w-fit shrink-0 items-center gap-2 rounded-3xl border border-border bg-muted/50 px-2.5 py-1.5 hover:bg-muted"
              >
                <ChainIcon ipfsSrc={chain.icon?.url} className="size-4" />
                {cleanedChainName && (
                  <span className="text-xs">{cleanedChainName}</span>
                )}
              </Link>
            )}
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
            copyIconPosition="left"
            className="bg-muted/50 text-xs"
            variant="outline"
          />

          {validBlockExplorers?.map((validBlockExplorer) => (
            <BadgeLink
              key={validBlockExplorer.url}
              name={validBlockExplorer.name}
              href={`${validBlockExplorer.url.endsWith("/") ? validBlockExplorer.url : `${validBlockExplorer.url}/`}address/${address}`}
            />
          ))}

          {validExternalLinks?.map((e) => (
            <BadgeLink href={e.url} name={e.name} key={e.url} />
          ))}
        </div>
      </div>
    </div>
  );
};

function BadgeLink(props: {
  name: string;
  href: string;
}) {
  return (
    <Button
      variant="outline"
      asChild
      className="!h-auto gap-2 rounded-lg bg-muted/50 px-3 py-1.5 text-xs capitalize"
    >
      <Link href={props.href} target="_blank">
        {props.name}
        <ExternalLinkIcon className="size-3 text-muted-foreground" />
      </Link>
    </Button>
  );
}
