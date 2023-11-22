import { useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";
import { PROD_OR_DEV_URL } from "constants/rpc";
import { getEVMThirdwebSDK } from "lib/sdk";

export function useContractMetadataWithChain(
  contractAddress: string | undefined,
  chainId: number,
) {
  invariant(contractAddress, "Address is not provided");
  invariant(chainId, "Chain ID is not provided");
  const sdk = getEVMThirdwebSDK(
    chainId,
    `https://${chainId}.rpc.${PROD_OR_DEV_URL}`,
  );
  return useQuery(["contractMetadata", contractAddress, chainId], async () => {
    const sdkContract = await sdk.getContract(contractAddress);
    return await sdkContract.metadata.get();
  });
}
