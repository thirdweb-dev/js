import { DEFAULT_API_KEY } from "../../core/constants/urls";
import { providers } from "ethers";

type CachedEns = {
  address: string;
  expirationTime: Date;
};

const ENS_CACHE = new Map<string, CachedEns>();

// TODO: Respect SDK RPC configuration and don't pull straight from ethers
const provider = new providers.JsonRpcProvider(
  `https://ethereum.rpc.thirdweb.com/${DEFAULT_API_KEY}`,
);

async function refreshCache(ens: string): Promise<string | null> {
  const address = await provider.resolveName(ens);

  if (!address) {
    return null;
  }

  // Cache ENS for 1 hour
  ENS_CACHE.set(ens, {
    address,
    expirationTime: new Date(Date.now() + 1000 * 60 * 5),
  });

  return address;
}

export async function resolveEns(ens: string): Promise<string | null> {
  if (ENS_CACHE.has(ens)) {
    const cachedEns = ENS_CACHE.get(ens) as CachedEns;

    // Trigger refresh if cache is expired, but don't block on it (SWR)
    if (cachedEns.expirationTime > new Date()) {
      refreshCache(ens);
    }

    return cachedEns.address;
  }

  return refreshCache(ens);
}
