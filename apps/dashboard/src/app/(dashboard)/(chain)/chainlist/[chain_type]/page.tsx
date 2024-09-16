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

export function generateMetadata(props: {
  params: { chain_type: "mainnets" | "testnets" };
}) {
  if (props.params.chain_type === "mainnets") {
    return {
      title: "List of Mainnets | Explorers, Popular Contracts & Chain IDs",
      description:
        "A list of EVM mainnets with RPCs, smart contracts, block explorers & faucets. Deploy smart contracts to all EVM chains with thirdweb.",
    };
  }
  if (props.params.chain_type === "testnets") {
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

// we use headers() to determine if we should default to table or grid view by checking viewport
// so this page needs to be forced as dynamic
export const dynamic = "force-dynamic";

export default async function ChainListLayout(props: {
  params: { chain_type: "mainnets" | "testnets" };
  searchParams: SearchParams;
}) {
  const headersList = headers();
  const viewportWithHint = Number(
    headersList.get("Sec-Ch-Viewport-Width") || 0,
  );

  // default is driven by viewport hint
  const activeView = props.searchParams.view
    ? props.searchParams.view
    : viewportWithHint > 1000
      ? "table"
      : "grid";

  const searchParams = { type: props.params.chain_type, ...props.searchParams };
  return (
    <>
      {" "}
      <div className="border-b border-border h-14 pl-7 flex">
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
                    props.params.chain_type === "testnets"
                      ? "/chainlist/testnets"
                      : "/chainlist/mainnets"
                  }
                >
                  {props.params.chain_type === "testnets"
                    ? "Testnets"
                    : "Mainnets"}
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
      <section className="container mx-auto py-10 px-4 h-full flex flex-col">
        <header className="flex flex-col gap-4">
          <div className="flex gap-4 flex-col lg:flex-row lg:justify-between lg:items-center">
            <div className="flex gap-4 flex-row items-center justify-between lg:justify-start lg:flex-col">
              <h1 className="font-semibold text-4xl lg:text-5xl tracking-tighter">
                List of{" "}
                {props.params.chain_type.charAt(0).toUpperCase() +
                  props.params.chain_type.slice(1)}
              </h1>
              <AddYourChainButton className="lg:hidden" />
            </div>
            <div className="flex flex-row lg:flex-col gap-4 items-end">
              <div className="flex flex-row gap-4 w-full">
                <SearchInput />
                <ChainListView activeView={activeView} />
                <AddYourChainButton className="hidden lg:flex" />
              </div>

              <div className="flex flex-row gap-2">
                <AllFilters hideChainType={true} />
                <div className="hidden lg:flex flex-row gap-2">
                  <ChainOptionsFilter />
                  <ChainServiceFilter />
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="h-10" />
        {/* we used to have suspense + spinner here, that feels more jarring than the page loading _minutely_ slower */}
        <ChainsData searchParams={searchParams} activeView={activeView} />
      </section>
    </>
  );
}
