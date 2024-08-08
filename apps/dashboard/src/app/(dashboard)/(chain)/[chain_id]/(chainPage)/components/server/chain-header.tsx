import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ChainMetadata } from "thirdweb/chains";
import { mapV4ChainToV5Chain } from "../../../../../../../contexts/map-chains";
import { ChainIcon } from "../../../../components/server/chain-icon";
import { AddChainToWallet } from "../client/add-chain-to-wallet";

type ChainHeaderProps = {
  headerImageUrl?: string;
  logoUrl?: string;
  chain: ChainMetadata;
};

// TODO: improve the behavior when clicking "Get started with thirdweb", currently just redirects to the dashboard

export function ChainHeader(props: ChainHeaderProps) {
  return (
    // force the banner image to be 4:1 aspect ratio and full-width on mobile devices
    <div className="flex flex-col">
      {!props.headerImageUrl && <div className="h-8 md:hidden" />}

      <AspectRatio
        ratio={props.headerImageUrl ? 4 : 8}
        className="border-b border-border -mx-4 lg:-mx-6"
      >
        {props.headerImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={props.headerImageUrl}
            alt=""
            className="object-cover object-center h-full w-full"
          />
        )}
      </AspectRatio>

      {/* below header */}
      <div className="relative flex flex-row justify-end items-end">
        {/* chain logo */}

        <ChainIcon
          iconUrl={props.logoUrl}
          className="p-2 lg:p-4 absolute top-0 left-0 size-20 lg:size-36 rounded-full bg-background -translate-y-[50%] overflow-hidden border border-border"
        />

        {/* action group */}
        <div className="pt-3 lg:pt-6">
          {/* Desktop only */}
          <div className="hidden lg:flex flex-row gap-2">
            <AddChainToWallet
              chain={
                // Do not include chain overrides for chain pages
                // eslint-disable-next-line no-restricted-syntax
                mapV4ChainToV5Chain(props.chain)
              }
            />
            <Button variant="primary" asChild>
              <Link href="https://thirdweb.com/dashboard" target="_blank">
                Get started with thirdweb
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
