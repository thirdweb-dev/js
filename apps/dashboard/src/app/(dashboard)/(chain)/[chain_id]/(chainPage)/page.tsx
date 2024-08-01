import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MenuIcon } from "lucide-react";
import { StarButton } from "../../components/client/star-button";
import { getChain, getChainMetadata } from "../../utils";
import { ChainHeader } from "./components/chain-header";
import { BuyFundsSection } from "./components/client/BuyFundsSection";
import {
  SidebarContent,
  type SidebarContentProps,
} from "./components/sidebar-content";

export default async function Page(props: {
  params: { chain_id: string };
}) {
  const chain = await getChain(props.params.chain_id);
  const chainMetadata = await getChainMetadata(chain.chainId);

  return (
    <div className="pb-10">
      <ChainHeader
        headerImageUrl={chainMetadata?.headerImgUrl}
        logoUrl={chain.icon?.url}
        mobileButton={<MobileMenu slug={chain.slug} />}
      />

      <div className="h-8" />

      {/* title, description, mobile action row section*/}
      <div className="flex flex-col gap-2">
        {/* Chain name and favorite */}
        <div className="flex flex-row gap-2 items-center">
          <h1 className="text-xl font-semibold lg:text-3xl lg:font-semibold tracking-tight">
            {chain.name}
          </h1>
          <StarButton chainId={chain.chainId} iconClassName="size-5" />
        </div>
        {/* description */}
        {chainMetadata?.about && (
          <p className="text-secondary-foreground text-sm lg:text-base mb-2">
            {chainMetadata.about}
          </p>
        )}
        {/* mobile action row */}
        <Button className="sm:hidden w-full" variant="primary">
          Get started with thirdweb
        </Button>
      </div>

      <div className="h-6" />

      <BuyFundsSection />

      <div className="h-8" />
    </div>
  );
}

function MobileMenu(props: SidebarContentProps) {
  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button size="icon" variant="outline" className="lg:hidden">
          <MenuIcon strokeWidth={1} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex flex-col gap-2 p-4">
          <SidebarContent {...props} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
