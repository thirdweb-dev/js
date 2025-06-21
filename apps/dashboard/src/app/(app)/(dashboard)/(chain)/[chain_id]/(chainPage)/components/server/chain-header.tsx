import Link from "next/link";
import type { ThirdwebClient } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mapV4ChainToV5Chain } from "../../../../../../../../contexts/map-chains";
import { ChainIcon } from "../../../../components/server/chain-icon";
import { AddChainToWallet } from "../client/add-chain-to-wallet";

type ChainHeaderProps = {
  headerImageUrl?: string;
  logoUrl?: string;
  chain: ChainMetadata;
  client: ThirdwebClient;
};

// TODO: improve the behavior when clicking "Get started with thirdweb", currently just redirects to the dashboard

export function ChainHeader(props: ChainHeaderProps) {
  return (
    // force the banner image to be 4:1 aspect ratio and full-width on mobile devices
    <div className="flex flex-col">
      {!props.headerImageUrl && <div className="h-8 md:hidden" />}
      <div
        className={cn(
          "max-sm:-mx-4 relative border-border border-b",
          props.headerImageUrl ? "aspect-[4/1]" : "aspect-[8/1]",
        )}
      >
        {props.headerImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt=""
            className="h-full w-full object-cover object-center"
            src={props.headerImageUrl}
          />
        )}
      </div>
      {/* below header */}
      <div className="relative flex flex-row items-end justify-end">
        {/* chain logo */}

        <ChainIcon
          className={cn(
            "-translate-y-[50%] absolute top-0 left-0 size-20 overflow-hidden rounded-full border border-border bg-muted p-2 lg:size-36 lg:p-4",
            props.headerImageUrl && "lg:left-4",
          )}
          iconUrl={props.logoUrl}
        />

        {/* action group */}
        <div className="pt-3 lg:pt-6">
          {/* Desktop only */}
          <div className="hidden flex-row gap-2 lg:flex">
            <AddChainToWallet
              chain={
                // Do not include chain overrides for chain pages
                // eslint-disable-next-line no-restricted-syntax
                mapV4ChainToV5Chain(props.chain)
              }
              client={props.client}
            />
            <Button asChild variant="default">
              <Link href="/team" rel="noopener noreferrer" target="_blank">
                Get started with thirdweb
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
