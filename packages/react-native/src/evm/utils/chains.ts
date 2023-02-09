import { Chain as WagmiChain } from "wagmi";
import { Chain } from "@thirdweb-dev/chains";

export function transformChainToMinimalWagmiChain(chain: Chain): WagmiChain {
    return {
        id: chain.chainId,
        name: chain.name,
        rpcUrls: chain.rpc as string[],
        nativeCurrency: {
            name: chain.nativeCurrency.name,
            symbol: chain.nativeCurrency.symbol,
            decimals: chain.nativeCurrency.decimals as 18,
        },
        testnet: chain.testnet,
        blockExplorers: chain.explorers as Array<{
            name: string;
            url: string;
            standard: string;
        }>,
    };
}

export function getWagmiChain(chain: Chain): WagmiChain {
    return {
        ...chain,
        network: chain.name,
        rpcUrls: {
            default: {
                http: chain.rpcUrls,
            },
            public: {
                http: chain.rpcUrls,
            },
        },
    } as WagmiChain;
}