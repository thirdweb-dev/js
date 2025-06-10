import { ChainIconClient } from "components/icons/ChainIcon";
import { useAllChainsData } from "hooks/chains/allChains";
import type { ThirdwebClient } from "thirdweb/dist/types/client/client";

export function ChainOverview(props: {
  chainId: string;
  client: ThirdwebClient;
}) {
  const { idToChain } = useAllChainsData();
  const chainMetadata = idToChain.get(Number(props.chainId));

  return (
    <div className="flex items-center gap-2">
      <ChainIconClient
        className="size-3.5"
        client={props.client}
        src={chainMetadata?.icon?.url || ""}
      />
      <p className="text-foreground text-sm">
        {chainMetadata?.name || `Chain ${props.chainId}`}
      </p>
    </div>
  );
}
