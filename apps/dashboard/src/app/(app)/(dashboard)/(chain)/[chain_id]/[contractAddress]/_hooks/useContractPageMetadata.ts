"use client";

import { useQuery } from "@tanstack/react-query";
import type { ThirdwebContract } from "thirdweb";
import { getContractPageMetadataSetup } from "../_utils/getContractPageMetadataSetup";

export function useContractPageMetadata(contract: ThirdwebContract) {
  return useQuery({
    queryFn: () => {
      return getContractPageMetadataSetup(contract, () =>
        Promise.resolve(false),
      );
    },
    queryKey: ["getContractPageMetadataSetup", contract],
    refetchOnWindowFocus: false,
    retry: false,
  });
}
