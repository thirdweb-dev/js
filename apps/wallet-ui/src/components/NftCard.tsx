import { Image } from "@/components/ui/image";
import type { Erc721Token } from "@/types/Erc721Token";
import { shortenAddress } from "thirdweb/utils";
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
}: { data: Erc721Token; width?: number; height?: number }) {
  const chainData = await getChain(data.chainId.toString());

  return (
    <NftModal data={data} chainData={chainData}>
      <Card className="group h-[400px] w-full md:h-[350px] xl:h-[300px]">
        <div className="absolute inset-0 h-full w-full bg-accent object-cover">
          {(data.image_url || data.collection.image_url) && (
            <Image
              src={data.image_url || data.collection.image_url}
              alt={data.name}
              className="h-full w-full object-cover object-center"
            />
          )}
        </div>
        <div className="relative z-10 flex h-full w-full flex-col items-stretch justify-between">
          <div className="-translate-y-6 flex w-full items-center justify-end opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            {chainData && (
              <ChainIcon iconUrl={chainData.icon?.url} className="h-7 w-7" />
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
