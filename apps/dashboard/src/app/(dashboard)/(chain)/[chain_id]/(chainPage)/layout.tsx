import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getChain } from "../../utils";
import { SidebarContent } from "./components/sidebar-content";

export async function generateMetadata(
  { params }: { params: { chain_id: string } },
  // parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const chain = await getChain(params.chain_id);

  const sanitizedChainName = chain.name.replace("Mainnet", "").trim();

  const title = `${sanitizedChainName}: RPC and Chain Settings`;

  const description = `Use the best ${sanitizedChainName} RPC and add to your wallet. Discover the chain ID, native token, explorers, and ${
    chain.testnet && chain.faucets?.length ? "faucet options" : "more"
  }.`;

  return {
    title,
    description,
  };
}

// this is the dashboard layout file
export default async function ChainPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { chain_id: string };
}) {
  const chain = await getChain(params.chain_id);
  if (params.chain_id !== chain.slug) {
    redirect(chain.slug);
  }

  return (
    <div className="container flex flex-row h-full">
      <aside className="w-[280px] p-4 border-r border-border flex-shrink-0 hidden lg:flex flex-col gap-2">
        <SidebarContent
          hasFaucet={chain.testnet}
          // TODO: properly check if chain supports pay
          isPaySupported={!chain.testnet}
          slug={chain.slug}
        />
      </aside>
      <div className="flex flex-col w-full lg:px-6">{children}</div>
    </div>
  );
}
