"use client";
import type { Erc721Token } from "@/types/Erc721Token";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
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

export default function NftCard({
  data,
}: { data: Erc721Token; width?: number; height?: number }) {
  const { data: chainData } = useQuery({
    queryKey: ["chain-metadata", data.chainId],
    queryFn: async () => {
      return getChain(data.chainId.toString());
    },
    enabled: !!data.chainId,
  });

  return (
    <NftModal data={data} chainData={chainData}>
      <Card className="w-full h-[300px] group">
        <div className="absolute inset-0 object-cover w-full h-full bg-accent">
          {(data.image_url || data.collection.image_url) && (
            <Image
              src={data.image_url || data.collection.image_url}
              alt={data.name}
              className="object-cover object-center"
              fill
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
