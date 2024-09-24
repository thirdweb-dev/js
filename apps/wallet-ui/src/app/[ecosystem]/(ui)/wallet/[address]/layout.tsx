import { ChainCombobox } from "@/components/ChainCombobox";
import { getCurrentUser } from "@/lib/auth";
import { getChains } from "@/lib/chains";
import { client } from "@/lib/client";
import { getEcosystemInfo } from "@/lib/ecosystems";
import { SIMPLEHASH_NFT_SUPPORTED_CHAIN_IDS } from "@/util/simplehash";
import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import { resolveName } from "thirdweb/extensions/ens";
import { shortenAddress } from "thirdweb/utils";

export async function generateMetadata(
  { params }: { params: { ecosystem: string; address: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [ecosystem, parentMetadata] = await Promise.all([
    getEcosystemInfo(params.ecosystem),
    parent,
  ]);
  const previousImages = parentMetadata.openGraph?.images || [];

  return {
    title: `${ecosystem.name} | ${shortenAddress(params.address)}`,
    openGraph: {
      images: [ecosystem.imageUrl, ...previousImages],
    },
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { ecosystem: string; address: string };
}) {
  const userAddressPromise = getCurrentUser();
  const ensPromise = resolveName({
    client,
    address: params.address,
  });
  const thirdwebChainsPromise = getChains();

  const [userAddress, ens, thirdwebChains] = await Promise.all([
    userAddressPromise,
    ensPromise,
    thirdwebChainsPromise,
  ]);

  if (userAddress !== params.address) {
    redirect(`/wallet/${userAddress}`);
  }

  const simpleHashChains = thirdwebChains.filter((chain) =>
    SIMPLEHASH_NFT_SUPPORTED_CHAIN_IDS.includes(chain.chainId),
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
