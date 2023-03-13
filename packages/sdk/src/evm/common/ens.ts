import { DEFAULT_API_KEY } from "../../core/constants/urls";
import { Address, AddressOrEns, AddressOrEnsSchema } from "../schema";
import { providers } from "ethers";

type CachedEns = {
  address: string | null;
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
    // If they don't have an ENS, only cache for 30s
    ENS_CACHE.set(ens, {
      address: null,
      expirationTime: new Date(Date.now() + 1000 * 30),
    });
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
  const cachedEns = ENS_CACHE.get(ens);
  if (!!cachedEns && !!cachedEns.address) {
    // Trigger refresh if cache is expired, but don't block on it (SWR)
    if (cachedEns.expirationTime > new Date()) {
      refreshCache(ens);
    }

    return cachedEns.address;
  }

  return refreshCache(ens);
}

export async function resolveAddress(
  addressOrEns: AddressOrEns,
): Promise<Address> {
  return AddressOrEnsSchema.parseAsync(addressOrEns);
}
