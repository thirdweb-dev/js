import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { getAuthToken } from "../../../../api/lib/getAuthToken";
import {
  AllFilters,
  ChainOptionsFilter,
  ChainServiceFilter,
} from "../components/client/filters";
import { SearchInput } from "../components/client/search";
import { ChainListView } from "../components/client/view";
import { AddYourChainButton } from "../components/server/add-chain-button";
import {
  ChainsData,
  type SearchParams,
} from "../components/server/chain-table";

export async function generateMetadata(props: {
  params: Promise<{ chain_type: "mainnets" | "testnets" }>;
}) {
  const params = await props.params;
  if (params.chain_type === "mainnets") {
    return {
      title: "List of Mainnets | Explorers, Popular Contracts & Chain IDs",
      description:
        "A list of EVM mainnets with RPCs, smart contracts, block explorers & faucets. Deploy smart contracts to all EVM chains with thirdweb.",
    };
  }
  if (params.chain_type === "testnets") {
    return {
      title: "List of Testnets | Explorers, Popular Contracts & Chain IDs",
      description:
        "Browse all Testnets across web3 ecosystems, BNB Smart Chain Testnet, Ethereum Sepolia Testnets, Chain IDs, Enabled Services and more. ",
    };
  }
  return {
    title: "Chainlist: RPCs, Block Explorers, Faucets",
    description:
      "A list of EVM networks with RPCs, smart contracts, block explorers & faucets. Deploy smart contracts to all EVM chains with thirdweb.",
  };
}

export default async function ChainListLayout(props: {
  params: Promise<{ chain_type: "mainnets" | "testnets" }>;
  searchParams: Promise<SearchParams>;
}) {
  const authToken = await getAuthToken();
  const headersList = await headers();
  const viewportWithHint = Number(
    headersList.get("Sec-Ch-Viewport-Width") || 0,
  );

  const [params, sParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const searchParams = {
    type: params.chain_type,
    ...sParams,
  };

  // default is driven by viewport hint
  const activeView = searchParams.view
    ? searchParams.view
    : viewportWithHint > 1000
      ? "table"
      : "grid";

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
                    params.chain_type === "testnets"
                      ? "/chainlist/testnets"
                      : "/chainlist/mainnets"
                  }
                >
                  {params.chain_type === "testnets" ? "Testnets" : "Mainnets"}
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
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section className="container mx-auto flex h-full flex-col px-4 py-10">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-row items-center justify-between gap-4 lg:flex-col lg:justify-start">
              <h1 className="font-semibold text-4xl tracking-tighter lg:text-5xl">
                List of{" "}
                {params.chain_type.charAt(0).toUpperCase() +
                  params.chain_type.slice(1)}
              </h1>
              <AddYourChainButton className="lg:hidden" />
            </div>
            <div className="flex flex-row items-end gap-4 lg:flex-col">
              <div className="flex w-full flex-row gap-4">
                <SearchInput />
                <ChainListView activeView={activeView} />
                <AddYourChainButton className="hidden lg:flex" />
              </div>

              <div className="flex flex-row gap-2">
                <AllFilters hideChainType={true} />
                <div className="hidden flex-row gap-2 lg:flex">
                  <ChainOptionsFilter />
                  <ChainServiceFilter />
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="h-10" />
        {/* we used to have suspense + spinner here, that feels more jarring than the page loading _minutely_ slower */}
        <ChainsData
          searchParams={searchParams}
          activeView={activeView}
          isLoggedIn={!!authToken}
        />
      </section>
    </>
  );
}
