import { ChainCombobox } from "@/components/ChainCombobox";
import { client } from "@/lib/client";
import { resolveName } from "thirdweb/extensions/ens";
import { shortenAddress } from "thirdweb/utils";
import { getChains } from "../../../../../lib/chains";
import { SIMPLEHASH_NFT_SUPPORTED_CHAIN_IDS } from "../../../../../util/simplehash";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { ecosystem: string; address: string };
}) {
  const ens = await resolveName({
    client,
    address: params.address,
  });

  const thirdwebChains = await getChains();
  const simpleHashChains = thirdwebChains.filter((chain) =>
    SIMPLEHASH_NFT_SUPPORTED_CHAIN_IDS.includes(chain.chainId),
  );

  return (
    <div className="flex flex-col w-full">
      <div className="px-8 py-4 mb-8 border-b pt-36 bg-card">
        <div className="flex items-end justify-between w-full mx-auto max-w-7xl bg-card">
          <h2 className="text-4xl font-bold">
            {ens || shortenAddress(params.address)}
          </h2>
          <ChainCombobox chains={simpleHashChains} />
        </div>
      </div>
      <div className="flex-1 p-4 px-8">
        <div className="h-full mx-auto max-w-7xl">{children}</div>
      </div>
    </div>
  );
}
