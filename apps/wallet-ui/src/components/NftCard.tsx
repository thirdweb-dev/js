import type { Erc721Token } from "@/types/Erc721Token";
import { shortenAddress } from "thirdweb/utils";
import { getChain } from "../lib/chains";
import { ChainIcon } from "./ChainIcon";
import { NftModal } from "./NftModal";
import { Badge } from "./ui/badge";
import Card from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function NftLoadingCard() {
  return <Skeleton className="w-[300px] h-[300px]" />;
}

export default async function NftCard({
  data,
}: { data: Erc721Token; width?: number; height?: number }) {
  const chainData = await getChain(data.chainId.toString());

  return (
    <NftModal data={data} chainData={chainData}>
      <Card className="w-full h-[400px] md:h-[350px] xl:h-[300px] group">
        <div className="absolute inset-0 object-cover w-full h-full bg-accent">
          {(data.image_url || data.collection.image_url) && (
            <img
              src={data.image_url || data.collection.image_url}
              alt={data.name}
              className="w-full h-full object-cover object-center"
            />
          )}
        </div>
        <div className="relative z-10 flex flex-col items-stretch justify-between w-full h-full">
          <div className="flex items-center justify-end w-full transition-all -translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            {chainData && (
              <ChainIcon iconUrl={chainData.icon?.url} className="w-7 h-7" />
            )}
          </div>
          <div className="flex items-center justify-end w-full transition-all translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <Badge>
              {data.name ||
                data.collection.name ||
                data.contract.name ||
                shortenAddress(data.contractAddress)}
            </Badge>
          </div>
        </div>
      </Card>
    </NftModal>
  );
}
