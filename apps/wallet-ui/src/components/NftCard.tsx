import { shortenAddress } from "thirdweb/utils";
import { Image } from "@/components/ui/image";
import type { Erc721Token } from "@/types/Erc721Token";
import { getChain } from "../lib/chains";
import { ChainIcon } from "./ChainIcon";
import { NftModal } from "./NftModal";
import { Badge } from "./ui/badge";
import Card from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function NftLoadingCard() {
  return <Skeleton className="h-[300px] w-[300px]" />;
}

export default async function NftCard({
  data,
}: {
  data: Erc721Token;
  width?: number;
  height?: number;
}) {
  const chainData = await getChain(data.chainId.toString());

  return (
    <NftModal chainData={chainData} data={data}>
      <Card className="group h-[400px] w-full md:h-[350px] xl:h-[300px]">
        <div className="absolute inset-0 h-full w-full bg-accent object-cover">
          {(data.image_url || data.collection.image_url) && (
            <Image
              alt={data.name}
              className="h-full w-full object-cover object-center"
              src={data.image_url || data.collection.image_url}
            />
          )}
        </div>
        <div className="relative z-10 flex h-full w-full flex-col items-stretch justify-between">
          <div className="-translate-y-6 flex w-full items-center justify-end opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            {chainData && (
              <ChainIcon className="h-7 w-7" iconUrl={chainData.icon?.url} />
            )}
          </div>
          <div className="flex w-full translate-y-6 items-center justify-end opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
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
