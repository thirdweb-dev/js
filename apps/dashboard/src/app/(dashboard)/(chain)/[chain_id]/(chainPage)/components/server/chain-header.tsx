import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { defineChain } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { ChainIcon } from "../../../../components/server/chain-icon";
import { AddChainToWallet } from "../client/add-chain-to-wallet";
import { SidebarContent } from "./sidebar-content";

type ChainHeaderProps = {
  headerImageUrl?: string;
  logoUrl?: string;
  chain: ChainMetadata;
};

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
            <AddChainToWallet chain={defineChain(props.chain)} />
            <Button variant="primary" asChild>
              <Link href="https://portal.thirdweb.com/" target="_blank">
                Get started with thirdweb
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Drawer direction="bottom">
            <DrawerTrigger asChild>
              <Button size="icon" variant="outline" className="lg:hidden">
                <MenuIcon strokeWidth={1} />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4">
                <SidebarContent chain={props.chain} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}
