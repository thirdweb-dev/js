"use client";

import { useQuery } from "@tanstack/react-query";
import type { ThirdwebContract } from "thirdweb";
import { getContractPageMetadataSetup } from "../_utils/getContractPageMetadataSetup";

export function useContractPageMetadata(contract: ThirdwebContract) {
  return useQuery({
    queryKey: ["getContractPageMetadataSetup", contract],
    queryFn: () => {
      return getContractPageMetadataSetup(contract, () =>
        Promise.resolve(false),
      );
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}
