import type { Metadata, ResolvingMetadata } from "next";
import { resolveName } from "thirdweb/extensions/ens";
import { shortenAddress } from "thirdweb/utils";
import { ChainCombobox } from "@/components/ChainCombobox";
import { getChains } from "@/lib/chains";
import { client } from "@/lib/client";
import { getEcosystemChainIds } from "@/lib/ecosystemConfig";
import { getEcosystemInfo } from "@/lib/ecosystems";
import { SIMPLEHASH_NFT_SUPPORTED_CHAIN_IDS } from "@/util/simplehash";

export async function generateMetadata(
  props: { params: Promise<{ ecosystem: string; address: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const [ecosystem, parentMetadata] = await Promise.all([
    getEcosystemInfo(params.ecosystem),
    parent,
  ]);
  const previousImages = parentMetadata.openGraph?.images || [];

  return {
    openGraph: {
      images: [ecosystem.imageUrl, ...previousImages],
    },
    title: `${ecosystem.name} | ${shortenAddress(params.address)}`,
  };
}

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ ecosystem: string; address: string }>;
}) {
  const params = await props.params;

  const { children } = props;

  const ensPromise = resolveName({
    address: params.address,
    client,
  });
  const thirdwebChainsPromise = getChains();

  const [ens, thirdwebChains] = await Promise.all([
    ensPromise,
    thirdwebChainsPromise,
  ]);

  const specialChainIds = getEcosystemChainIds(params.ecosystem);
  const allowedChainIds = specialChainIds ?? SIMPLEHASH_NFT_SUPPORTED_CHAIN_IDS;

  const simpleHashChains = thirdwebChains.filter((chain) =>
    allowedChainIds.includes(chain.chainId),
  );

  return (
    <div className="flex w-full flex-col">
      <div className="mb-4 border-b bg-card pt-36">
        <div className="container flex w-full flex-col items-end justify-between gap-4 bg-card py-4 md:flex-row">
          <h2 className="font-bold text-4xl">
            {ens || shortenAddress(params.address)}
          </h2>
          <ChainCombobox chains={simpleHashChains} />
        </div>
      </div>
      <div className="container flex-1 py-4">
        <div className="h-full">{children}</div>
      </div>
    </div>
  );
}
