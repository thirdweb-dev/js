import { contractKeys, networkKeys } from "../cache-keys";
import { useActiveChainId } from "./useActiveChainId";
import { useWeb3 } from "./useWeb3";
import { useQuery } from "@tanstack/react-query";
import { ChainId, ValidContractClass } from "@thirdweb-dev/sdk";
import { z } from "zod";

export function useContractMetadataWithAddress(
  address: string,
  queryFn: () => Promise<z.output<ValidContractClass["schema"]["output"]>>,
  chainId?: ChainId,
) {
  const activeChainId = useActiveChainId();
  const web3 = useWeb3();
  const cId = chainId || activeChainId || web3.chainId;

  return useQuery(
    [...networkKeys.chain(cId), ...contractKeys.detail(address)],
    () => queryFn(),
    { enabled: !!address && typeof queryFn === "function" && !!cId },
  );
}
