import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useAddress } from "@thirdweb-dev/react-core";
import type { BigNumber } from "ethers";

type BalanceInfo = {
  symbol: string;
  value: BigNumber;
  name: string;
  decimals: number;
  displayValue: string;
};

const sdkCache = new Map<number, ThirdwebSDK>();

export function useMultiChainBalance(options: {
  tokenAddress?: string;
  chainId: number;
}): UseQueryResult<BalanceInfo> {
  const address = useAddress();

  return useQuery({
    queryKey: ["tokenBalance", options.tokenAddress, options.chainId],
    enabled: !!address,
    queryFn: async () => {
      if (!address) {
        throw new Error("No address provided");
      }

      let sdk: ThirdwebSDK;
      const cachedSDK = sdkCache.get(options.chainId);
      if (cachedSDK) {
        sdk = cachedSDK;
      } else {
        sdk = new ThirdwebSDK(options.chainId);
        sdkCache.set(options.chainId, sdk);
      }

      if (!options.tokenAddress) {
        return sdk.getBalance(address);
      }

      const contract = await sdk.getContract(options.tokenAddress);
      const balance: BalanceInfo = await contract.erc20.balanceOf(address);
      return balance;
    },
  });
}
