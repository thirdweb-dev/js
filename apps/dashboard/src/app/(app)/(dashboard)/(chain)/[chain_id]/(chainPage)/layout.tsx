import { ChevronDownIcon, TicketCheckIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/api/auth-token";
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
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { mapV4ChainToV5Chain } from "@/utils/map-chains";
import { TeamHeader } from "../../../../team/components/TeamHeader/team-header";
import { StarButton } from "../../components/client/star-button";
import { getChain, getCustomChainMetadata } from "../../utils";
import { fetchChainSeo } from "./apis/chain-seo";
import { AddChainToWallet } from "./components/client/add-chain-to-wallet";
import { ChainPageView } from "./components/client/chain-pageview";
import { ChainHeader } from "./components/server/chain-header";

type Params = Promise<{ chain_id: string }>;

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata | undefined> {
  const params = await props.params;
  const chain = await getChain(params.chain_id);
  const chainSeo = await fetchChainSeo(Number(chain.chainId)).catch(
    () => undefined,
  );

  if (!chainSeo) {
    return undefined;
  }

  return {
    title: chainSeo.title,
    description: chainSeo.description,
    metadataBase: new URL("https://thirdweb.com"),
    openGraph: {
      title: chainSeo.og.title,
      description: chainSeo.og.description,
      siteName: "thirdweb",
      type: "website",
      url: "https://thirdweb.com",
    },
    twitter: {
      title: chainSeo.og.title,
      description: chainSeo.og.description,
      card: "summary_large_image",
      creator: "@thirdweb",
      site: "@thirdweb",
    },
  };
}

export default async function ChainPageLayout(props: {
  children: React.ReactNode;
  params: Params;
}) {
  const params = await props.params;
  const { children } = props;
  const [chain, authToken] = await Promise.all([
    getChain(params.chain_id),
    getAuthToken(),
  ]);

  if (params.chain_id !== chain.slug) {
    redirect(chain.slug);
  }

  const customChainMetadata = getCustomChainMetadata(chain.chainId);
  const chainSeo = await fetchChainSeo(chain.chainId);
  const client = getClientThirdwebClient(undefined);
  const description = customChainMetadata?.about || chainSeo?.description;

  return (
    <div className="flex grow flex-col">
      <ChainPageView chainId={chain.chainId} is_testnet={chain.testnet} />
      <div className="border-border border-b bg-card">
        <TeamHeader />
      </div>

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
      <div className="container flex h-full max-w-[1180px] flex-row">
        <div className="flex w-full flex-col pb-10">
          {/* Icon + Background */}
          <ChainHeader
            chain={chain}
            client={client}
            headerImageUrl={customChainMetadata?.headerImgUrl}
            logoUrl={chain.icon?.url}
          />

          <div className="h-4 md:h-8" />

          <div className="flex flex-col gap-3 md:gap-2">
            {/* Gas Sponsored badge - Mobile */}
            {customChainMetadata?.gasSponsored && (
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
                  className="p-1"
                  iconClassName="size-5"
                />
              )}

              {/* Gas Sponsored badge - Desktop */}
              {customChainMetadata?.gasSponsored && (
                <div className="hidden md:block">
                  <GasSponsoredBadge />
                </div>
              )}
            </div>

            {/* description */}
            {description && (
              <p className="mb-2 whitespace-pre-line text-muted-foreground text-sm lg:text-base text-pretty max-w-3xl">
                {description}
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
                  client={client}
                />
                <Button asChild variant="primary">
                  <Link href="/team" rel="noopener noreferrer" target="_blank">
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
    </div>
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
