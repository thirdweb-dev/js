import { contractKeys, networkKeys } from "../cache-keys";
import { useReadonlySDK } from "@thirdweb-dev/react";
import { SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import {
  StorageSingleton,
  alchemyUrlMap,
} from "components/app-layouts/providers";
import { useQuery } from "react-query";

export function useContractList(
  chainId: SUPPORTED_CHAIN_ID,
  walletAddress?: string,
) {
  const sdk = useReadonlySDK(
    alchemyUrlMap[chainId],
    undefined,
    StorageSingleton,
  );
  return useQuery(
    [...networkKeys.chain(chainId), ...contractKeys.list(walletAddress)],
    async () => {
      const data = await sdk?.getContractList(walletAddress || "");

      return data;
    },
    {
      enabled: !!sdk && !!walletAddress && !!chainId,
    },
  );
}
