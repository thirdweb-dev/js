import { useQuery } from "@tanstack/react-query";
import {
  Arbitrum,
  ArbitrumGoerli,
  Avalanche,
  AvalancheFuji,
  Binance,
  BinanceTestnet,
  Ethereum,
  Fantom,
  FantomTestnet,
  Goerli,
  Mumbai,
  Optimism,
  OptimismGoerli,
  Polygon,
} from "@thirdweb-dev/chains";
import { ChainId, ContractWithMetadata } from "@thirdweb-dev/sdk";
import {
  useSupportedChains,
  useSupportedChainsRecord,
} from "hooks/chains/configureChains";
import { getDashboardChainRpc } from "lib/rpc";
import { getEVMThirdwebSDK } from "lib/sdk";
import { useMemo } from "react";
import invariant from "tiny-invariant";

export function useContractList(
  chainId: number,
  rpcUrl: string,
  walletAddress?: string,
) {
  return useQuery(
    ["dashboard-registry", walletAddress, "contract-list", { chainId }],
    async () => {
      if (!walletAddress || !chainId) {
        return [];
      }
      const sdk = getEVMThirdwebSDK(chainId, rpcUrl);
      const contractList = await sdk.getContractList(walletAddress);
      return [...contractList].reverse();
    },
    {
      enabled: !!walletAddress && !!chainId,
    },
  );
}

export function useMultiChainRegContractList(walletAddress?: string) {
  const configuredChains = useSupportedChains();
  return useQuery(
    ["dashboard-registry", walletAddress, "multichain-contract-list"],
    async () => {
      invariant(walletAddress, "walletAddress is required");
      const polygonSDK = getEVMThirdwebSDK(
        Polygon.chainId,
        getDashboardChainRpc(Polygon),
      );
      const contractList = await polygonSDK.getMultichainContractList(
        walletAddress,
        configuredChains,
      );

      return [...contractList].reverse();
    },
    {
      enabled: !!walletAddress,
    },
  );
}

export function useMainnetsContractList(walletAddress: string | undefined) {
  const mainnetQuery = useContractList(
    Ethereum.chainId,
    getDashboardChainRpc(Ethereum),
    walletAddress,
  );
  const polygonQuery = useContractList(
    Polygon.chainId,
    getDashboardChainRpc(Polygon),
    walletAddress,
  );
  const fantomQuery = useContractList(
    Fantom.chainId,
    getDashboardChainRpc(Fantom),
    walletAddress,
  );
  const avalancheQuery = useContractList(
    Avalanche.chainId,
    getDashboardChainRpc(Avalanche),
    walletAddress,
  );
  const optimismQuery = useContractList(
    Optimism.chainId,
    getDashboardChainRpc(Optimism),
    walletAddress,
  );

  const arbitrumQuery = useContractList(
    Arbitrum.chainId,
    getDashboardChainRpc(Arbitrum),
    walletAddress,
  );
  const binanceQuery = useContractList(
    Binance.chainId,
    getDashboardChainRpc(Binance),
    walletAddress,
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

function useTestnetsContractList(walletAddress: string | undefined) {
  const goerliQuery = useContractList(
    Goerli.chainId,
    getDashboardChainRpc(Goerli),
    walletAddress,
  );
  const mumbaiQuery = useContractList(
    Mumbai.chainId,
    getDashboardChainRpc(Mumbai),
    walletAddress,
  );
  const fantomTestnetQuery = useContractList(
    FantomTestnet.chainId,
    getDashboardChainRpc(FantomTestnet),
    walletAddress,
  );
  const avalancheFujiTestnetQuery = useContractList(
    AvalancheFuji.chainId,
    getDashboardChainRpc(AvalancheFuji),
    walletAddress,
  );
  const optimismGoerliQuery = useContractList(
    OptimismGoerli.chainId,
    getDashboardChainRpc(OptimismGoerli),
    walletAddress,
  );
  const arbitrumGoerliQuery = useContractList(
    ArbitrumGoerli.chainId,
    getDashboardChainRpc(ArbitrumGoerli),
    walletAddress,
  );
  const binanceTestnetQuery = useContractList(
    BinanceTestnet.chainId,
    getDashboardChainRpc(BinanceTestnet),
    walletAddress,
  );

  const testnetList = useMemo(() => {
    return (
      goerliQuery.data?.map((d) => ({ ...d, chainId: ChainId.Goerli })) || []
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
        optimismGoerliQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.OptimismGoerli,
        })) || [],
      )

      .concat(
        arbitrumGoerliQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.ArbitrumGoerli,
        })) || [],
      )
      .concat(
        binanceTestnetQuery.data?.map((d) => ({
          ...d,
          chainId: ChainId.BinanceSmartChainTestnet,
        })) || [],
      );
  }, [
    goerliQuery.data,
    mumbaiQuery.data,
    fantomTestnetQuery.data,
    avalancheFujiTestnetQuery.data,
    optimismGoerliQuery.data,
    arbitrumGoerliQuery.data,
    binanceTestnetQuery.data,
  ]);

  return {
    data: testnetList,
    isLoading:
      goerliQuery.isLoading ||
      mumbaiQuery.isLoading ||
      fantomTestnetQuery.isLoading ||
      avalancheFujiTestnetQuery.isLoading ||
      optimismGoerliQuery.isLoading ||
      arbitrumGoerliQuery.isLoading ||
      binanceTestnetQuery.isLoading,
    isFetched:
      goerliQuery.isFetched &&
      mumbaiQuery.isFetched &&
      fantomTestnetQuery.isFetched &&
      avalancheFujiTestnetQuery.isFetched &&
      optimismGoerliQuery.isFetched &&
      arbitrumGoerliQuery.isFetched &&
      binanceTestnetQuery.isFetched,
  };
}

export function useAllContractList(walletAddress: string | undefined) {
  const mainnetQuery = useMainnetsContractList(walletAddress);
  const testnetQuery = useTestnetsContractList(walletAddress);
  const multiChainQuery = useMultiChainRegContractList(walletAddress);

  const configuredChainsRecord = useSupportedChainsRecord();
  const allList = useMemo(() => {
    const mainnets: ContractWithMetadata[] = [];
    const testnets: ContractWithMetadata[] = [];
    const unknownNets: ContractWithMetadata[] = [];

    if (multiChainQuery.data) {
      multiChainQuery.data.forEach((net) => {
        (net as any)._isMultiChain = true;
        // if network is configured, we can determine if it is a testnet or not
        if (net.chainId in configuredChainsRecord) {
          const netInfo = configuredChainsRecord[net.chainId];
          if (netInfo.testnet) {
            testnets.push(net);
          } else {
            mainnets.push(net);
          }
        }
        // if not configured, we can't determine if it is a testnet or not
        else {
          unknownNets.push(net);
        }
      });
    }

    // only for legacy reasons - can be removed once migration to multi-chain registry is complete
    const mergedMainnets = [...mainnets, ...mainnetQuery.data].sort(
      (a, b) => a.chainId - b.chainId,
    );
    const mergedTestnets = [...testnets, ...testnetQuery.data].sort(
      (a, b) => a.chainId - b.chainId,
    );

    let all = [...mergedMainnets, ...mergedTestnets, ...unknownNets];

    // remove duplicates (by address + chain) - can happen if a contract is on both muichain registry and legacy registries
    const seen: { [key: string]: boolean } = {};
    all = all.filter((item) => {
      const key = `${item.chainId}-${item.address}`;
      const seenBefore = seen[key];
      seen[key] = true;
      return !seenBefore;
    });

    return all;
  }, [
    mainnetQuery.data,
    testnetQuery.data,
    multiChainQuery.data,
    configuredChainsRecord,
  ]);

  return {
    data: allList,
    isLoading: mainnetQuery.isLoading || testnetQuery.isLoading,
    isFetched: mainnetQuery.isFetched && testnetQuery.isFetched,
  };
}
