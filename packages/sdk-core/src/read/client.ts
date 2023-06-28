import {
  createPublicClient,
  PublicClient,
  http,
  Chain as ViemChain,
} from "viem";
import type { Chain } from "@thirdweb-dev/chains";

function convertChainToViemChain(chain: Chain): ViemChain {
  return {
    id: chain.chainId,
    name: chain.name,
    nativeCurrency: chain.nativeCurrency,
    testnet: chain.testnet,
    network: chain.shortName,
    rpcUrls: {
      default: { http: [chain.rpc[0]] },
      public: { http: [chain.rpc[0]] },
    },
  };
}

const cachedClients = new Map<string, PublicClient>();

export function createClient(chain: Chain): PublicClient {
  // TODO obviously not a real cache key, but it's good enough for now
  const cacheKey = JSON.stringify(chain);
  const cachedClient = cachedClients.get(cacheKey);
  if (cachedClient) {
    return cachedClient;
  }
  // TODO allow overriding of this duh
  const transport = http(`https://${chain.chainId}.rpc.thirdweb.com`);
  const client = createPublicClient({
    transport,
    chain: convertChainToViemChain(chain),
  });
  cachedClients.set(cacheKey, client);
  return client;
}
