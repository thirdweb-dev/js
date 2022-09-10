import { contractKeys, networkKeys } from "../cache-keys";
import { useQuery } from "@tanstack/react-query";
import { useReadonlySDK } from "@thirdweb-dev/react";
import { ChainId, SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import {
  StorageSingleton,
  alchemyUrlMap,
} from "components/app-layouts/providers";
import { useMemo } from "react";

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
    async () =>
      [...((await sdk?.getContractList(walletAddress || "")) || [])].reverse(),
    {
      enabled: !!sdk && !!walletAddress && !!chainId,
    },
  );
}

export function useMainnetsContractList(address: string | undefined) {
  const mainnetQuery = useContractList(ChainId.Mainnet, address);
  const polygonQuery = useContractList(ChainId.Polygon, address);
  const fantomQuery = useContractList(ChainId.Fantom, address);
  const avalancheQuery = useContractList(ChainId.Avalanche, address);
  const optimismQuery = useContractList(ChainId.Optimism, address);
  const arbitrumQuery = useContractList(ChainId.Arbitrum, address);
  const binanceQuery = useContractList(
    ChainId.BinanceSmartChainMainnet,
    address,
  );

  const mainnetList = useMemo(() => {
    return (
      mainnetQuery.data?.map((d) => ({ ...d, chainId: ChainId.Mainnet })) || []
    )
      .concat(
        polygonQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.Polygon,
        })) || [],
      )
      .concat(
        avalancheQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.Avalanche,
        })) || [],
      )
      .concat(
        fantomQuery.data?.map((d) => ({ ...d, chainId: ChainId.Fantom })) || [],
      )
      .concat(
        optimismQuery.data?.map((d) => ({ ...d, chainId: ChainId.Optimism })) ||
          [],
      )
      .concat(
        arbitrumQuery.data?.map((d) => ({ ...d, chainId: ChainId.Arbitrum })) ||
          [],
      )
      .concat(
        binanceQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.BinanceSmartChainMainnet,
        })) || [],
      );
  }, [
    mainnetQuery.data,
    polygonQuery.data,
    fantomQuery.data,
    avalancheQuery.data,
    optimismQuery.data,
    arbitrumQuery.data,
    binanceQuery.data,
  ]);

  return {
    data: mainnetList,
    isLoading:
      mainnetQuery.isLoading ||
      polygonQuery.isLoading ||
      fantomQuery.isLoading ||
      avalancheQuery.isLoading ||
      optimismQuery.isLoading ||
      arbitrumQuery.isLoading ||
      binanceQuery.isLoading,
    isFetched:
      mainnetQuery.isFetched &&
      polygonQuery.isFetched &&
      fantomQuery.isFetched &&
      avalancheQuery.isFetched &&
      optimismQuery.isFetched &&
      arbitrumQuery.isFetched &&
      binanceQuery.isFetched,
  };
}

export function useTestnetsContractList(address: string | undefined) {
  const rinkebyQuery = useContractList(ChainId.Rinkeby, address);
  const goerliQuery = useContractList(ChainId.Goerli, address);
  const mumbaiQuery = useContractList(ChainId.Mumbai, address);
  const fantomTestnetQuery = useContractList(ChainId.FantomTestnet, address);
  const avalancheFujiTestnetQuery = useContractList(
    ChainId.AvalancheFujiTestnet,
    address,
  );
  const optimismTestnetQuery = useContractList(ChainId.OptimismKovan, address);
  const arbitrumTestnetQuery = useContractList(
    ChainId.ArbitrumRinkeby,
    address,
  );
  const binanceTestnetQuery = useContractList(
    ChainId.BinanceSmartChainTestnet,
    address,
  );

  const testnetList = useMemo(() => {
    return (
      rinkebyQuery.data?.map((d) => ({ ...d, chainId: ChainId.Rinkeby })) || []
    )
      .concat(
        goerliQuery.data?.map((d) => ({ ...d, chainId: ChainId.Goerli })) || [],
      )
      .concat(
        mumbaiQuery.data?.map((d) => ({ ...d, chainId: ChainId.Mumbai })) || [],
      )
      .concat(
        avalancheFujiTestnetQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.AvalancheFujiTestnet,
        })) || [],
      )
      .concat(
        fantomTestnetQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.FantomTestnet,
        })) || [],
      )
      .concat(
        optimismTestnetQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.OptimismKovan,
        })) || [],
      )
      .concat(
        arbitrumTestnetQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.ArbitrumRinkeby,
        })) || [],
      )
      .concat(
        binanceTestnetQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.BinanceSmartChainTestnet,
        })) || [],
      );
  }, [
    rinkebyQuery.data,
    goerliQuery.data,
    mumbaiQuery.data,
    fantomTestnetQuery.data,
    avalancheFujiTestnetQuery.data,
    optimismTestnetQuery.data,
    arbitrumTestnetQuery.data,
    binanceTestnetQuery.data,
  ]);

  return {
    data: testnetList,
    isLoading:
      rinkebyQuery.isLoading ||
      goerliQuery.isLoading ||
      mumbaiQuery.isLoading ||
      fantomTestnetQuery.isLoading ||
      avalancheFujiTestnetQuery.isLoading ||
      optimismTestnetQuery.isLoading ||
      arbitrumTestnetQuery.isLoading ||
      binanceTestnetQuery.isLoading,
    isFetched:
      rinkebyQuery.isFetched &&
      goerliQuery.isFetched &&
      mumbaiQuery.isFetched &&
      fantomTestnetQuery.isFetched &&
      avalancheFujiTestnetQuery.isFetched &&
      optimismTestnetQuery.isFetched &&
      arbitrumTestnetQuery.isFetched &&
      binanceTestnetQuery.isFetched,
  };
}

export function useAllContractList(address: string | undefined) {
  const mainnetQuery = useMainnetsContractList(address);
  const testnetQuery = useTestnetsContractList(address);

  const allList = useMemo(() => {
    return (mainnetQuery.data || []).concat(testnetQuery.data || []);
  }, [mainnetQuery.data, testnetQuery.data]);

  return {
    data: allList,
    isLoading: mainnetQuery.isLoading || testnetQuery.isLoading,
    isFetched: mainnetQuery.isFetched && testnetQuery.isFetched,
  };
}
