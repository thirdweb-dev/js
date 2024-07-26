import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MenuIcon } from "lucide-react";
import { StarButton } from "../../components/client/star-button";
import { getChain, getChainMetadata } from "../../utils";
import { ChainHeader } from "./components/chain-header";
import {
  SidebarContent,
  type SidebarContentProps,
} from "./components/sidebar-content";

export default async function Page(props: {
  params: { chain_id: string };
  // searchParams: { timeRange?: TimeRange; page?: number; sortBy?: SortBy };
}) {
  const chain = await getChain(props.params.chain_id);
  const chainMetadata = await getChainMetadata(chain.chainId);

  return (
    <>
      <ChainHeader
        headerImageUrl={chainMetadata?.headerImgUrl}
        logoUrl={chain.icon?.url}
        mobileButton={
          <MobileMenu
            hasFaucet={chain.testnet}
            // TODO: properly check if chain supports pay
            isPaySupported={!chain.testnet}
            slug={chain.slug}
          />
        }
      />
      <div className="flex flex-col lg:pt-12 lg:pb-6 gap-8">
        {/* title, description, mobile action row section*/}
        <div className="flex flex-col gap-2">
          {/* Chain name and favorite */}
          <div className="flex flex-row gap-2 items-center">
            <h1 className="text-xl font-semibold lg:text-3xl lg:font-medium">
              {chain.name}
            </h1>
            <StarButton chainId={chain.chainId} iconClassName="size-5" />
          </div>
          {/* description */}
          {chainMetadata?.about && (
            <p className="text-secondary-foreground text-sm font-medium lg:text-base lg:font-normal">
              {chainMetadata.about}
            </p>
          )}
          {/* mobile action row */}
          <div className="flex flex-row gap-2 items-center lg:hidden pt-1">
            <Button className="w-full" variant="outline">
              Get Funds
            </Button>
            <Button className="w-full" variant="primary">
              Start with thirdweb
            </Button>
          </div>
        </div>
      </div>
    </>
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
