import { MobileSidebar } from "@/components/blocks/MobileSidebar";
import { Sidebar } from "@/components/blocks/Sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  MenuIcon,
  TicketCheckIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { mapV4ChainToV5Chain } from "../../../../../contexts/map-chains";
import { getAuthToken } from "../../../../api/lib/getAuthToken";
import { StarButton } from "../../components/client/star-button";
import { getChain, getChainMetadata } from "../../utils";
import { AddChainToWallet } from "./components/client/add-chain-to-wallet";
import { ChainHeader } from "./components/server/chain-header";

// TODO: improve the behavior when clicking "Get started with thirdweb", currently just redirects to the dashboard

export async function generateMetadata(props: {
  params: Promise<{ chain_id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const chain = await getChain(params.chain_id);
  const sanitizedChainName = chain.name.replace("Mainnet", "").trim();
  const title = `${sanitizedChainName}: RPC and Chain Settings`;

  const description = `Use the best ${sanitizedChainName} RPC and add to your wallet. Discover the chain ID, native token, explorers, and ${
    chain.testnet && chain.faucets?.length ? "faucet options" : "more"
  }.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

// this is the dashboard layout file
export default async function ChainPageLayout(props: {
  children: React.ReactNode;
  params: Promise<{ chain_id: string }>;
}) {
  const params = await props.params;
  const { children } = props;
  const chain = await getChain(params.chain_id);
  const authToken = await getAuthToken();

  if (params.chain_id !== chain.slug) {
    redirect(chain.slug);
  }

  const chainMetadata = await getChainMetadata(chain.chainId);

  const sidebarLinks = [
    {
      href: `/${chain.slug}`,
      label: "Overview",
      exactMatch: true,
    },
    {
      href: `/${chain.slug}/popular`,
      label: "Popular Contracts",
    },
  ];

  return (
    <>
      <div className="flex h-14 border-border border-b pl-7">
        <Breadcrumb className="my-auto">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/chainlist">Chainlist</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <Link
                  href={
                    chain.testnet
                      ? "/chainlist/testnets"
                      : "/chainlist/mainnets"
                  }
                >
                  {chain.testnet ? "Testnets" : "Mainnets"}
                </Link>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <ChevronDownIcon className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <Link href="/chainlist/mainnets">Mainnets</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/chainlist/testnets">Testnets</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {chain.name.replace("Mainnet", "")}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="container flex h-full flex-row">
        <Sidebar links={sidebarLinks} />

        <div className="flex w-full flex-col pb-10">
          {/* Icon + Background */}
          <ChainHeader
            headerImageUrl={chainMetadata?.headerImgUrl}
            logoUrl={chain.icon?.url}
            chain={chain}
          />

          <div className="flex justify-end lg:hidden">
            <MobileSidebar
              links={sidebarLinks}
              trigger={
                <Button size="icon" variant="outline">
                  <MenuIcon strokeWidth={1} />
                </Button>
              }
              footer={
                <div className="mt-5 border-t pt-6 pb-2">
                  <Link
                    href="/chainlist"
                    className="flex items-center justify-start gap-2 px-2 text-muted-foreground text-sm hover:text-foreground"
                  >
                    <ArrowLeftIcon className="size-4" />
                    View all chains
                  </Link>
                </div>
              }
            />
          </div>

          <div className="h-4 md:h-8" />

          <div className="flex flex-col gap-3 md:gap-2">
            {/* Gas Sponsored badge - Mobile */}
            {chainMetadata?.gasSponsored && (
              <div className="flex md:hidden">
                <GasSponsoredBadge />
              </div>
            )}

            {/* Chain name */}
            <div className="flex flex-row items-center gap-1.5">
              <h1 className="font-semibold text-2xl tracking-tight lg:font-semibold lg:text-3xl">
                {chain.name}
              </h1>

              {/* Favorite */}
              {authToken && (
                <StarButton
                  chainId={chain.chainId}
                  iconClassName="size-5"
                  className="p-1"
                />
              )}

              {/* Gas Sponsored badge - Desktop */}
              {chainMetadata?.gasSponsored && (
                <div className="hidden md:block">
                  <GasSponsoredBadge />
                </div>
              )}
            </div>

            {/* description */}
            {chainMetadata?.about && (
              <p className="mb-2 whitespace-pre-line text-muted-foreground text-sm lg:text-base">
                {chainMetadata.about}
              </p>
            )}

            {/* mobile action row */}
            <div className="w-full sm:hidden">
              <div className="grid grid-cols-2 gap-2">
                <AddChainToWallet
                  chain={
                    // Do not include chain overrides for chain pages
                    // eslint-disable-next-line no-restricted-syntax
                    mapV4ChainToV5Chain(chain)
                  }
                />
                <Button variant="primary">
                  <Link href="/team" target="_blank">
                    Get started
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="h-8" />
          {children}
        </div>
      </div>
    </>
  );
}

function GasSponsoredBadge() {
  return (
    <div className="flex items-center gap-2 rounded-full bg-[hsla(335,57%,51%,0.2)] px-2.5 py-1 text-[hsl(334,81.12%,69.65%)]">
      <TicketCheckIcon className="size-4" />
      <span className="font-medium text-xs">Gas Sponsored</span>
    </div>
  );
}
