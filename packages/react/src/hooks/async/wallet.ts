import { SupportedChainId } from "../../constants/chain";
import { useThirdwebConfigContext } from "../../contexts/thirdweb-config";
import { ContractAddress } from "../../types";
import { cacheKeys } from "../../utils/cache-keys";
import { useAddress } from "../useAddress";
import { useChainId } from "../useChainId";
import { useSigner } from "../useSigner";
import { useQuery } from "@tanstack/react-query";
import { UserWallet } from "@thirdweb-dev/sdk";
import { useMemo } from "react";

/**
 * A hook to get the native or (optional) ERC20 token balance of the connected wallet.
 *
 * @param tokenAddress - the address of the token contract, if empty will use the chain's native token
 * @returns the balance of the connected wallet (native or ERC20)
 * @beta
 */
export function useBalance(tokenAddress?: ContractAddress) {
  const { rpcUrlMap } = useThirdwebConfigContext();
  const chainId = useChainId() as SupportedChainId;
  const signer = useSigner();
  const walletAddress = useAddress();

  const walletSDK = useMemo(() => {
    if (signer) {
      const rpcUrl = rpcUrlMap[chainId];
      return new UserWallet(signer, {
        readonlySettings: rpcUrl
          ? {
              rpcUrl,
              chainId,
            }
          : undefined,
      });
    }
    return undefined;
  }, [signer, chainId]);

  const cacheKey = useMemo(() => {
    return cacheKeys.wallet.balance(chainId, walletAddress, tokenAddress);
  }, [chainId, tokenAddress, walletAddress]);

  return useQuery(
    cacheKey,
    () => {
      return walletSDK?.balance(tokenAddress);
    },
    {
      // if user is not logged in no reason to try to fetch
      enabled: !!walletSDK && !!walletAddress,
      retry: true,
      keepPreviousData: false,
    },
  );
}
