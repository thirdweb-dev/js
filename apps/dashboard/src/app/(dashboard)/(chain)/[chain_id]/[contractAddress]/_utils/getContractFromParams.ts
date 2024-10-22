import { getThirdwebClient } from "@/constants/thirdweb.server";
import { mapV4ChainToV5Chain } from "contexts/map-chains";
import { cookies } from "next/headers";
import { TW_LOCAL_CHAIN_STORE } from "stores/storageKeys";
import { getAddress, getContract, isAddress } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { fetchChain } from "utils/fetchChain";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";

export async function getContractPageParamsInfo(params: {
  contractAddress: string;
  chain_id: string;
}) {
  const contractAddress = getCheckSummedAddress(params.contractAddress);
  const chainSlugOrId = params.chain_id;
  let chainMetadata: ChainMetadata | null = null;
  try {
    chainMetadata = await fetchChain(chainSlugOrId);
  } catch {
    // move on
  }

  if (!chainMetadata) {
    const cookieStore = await cookies();
    const localChainStoreValue = cookieStore.get(TW_LOCAL_CHAIN_STORE)?.value;

    if (localChainStoreValue) {
      try {
        const chains = JSON.parse(decodeURIComponent(localChainStoreValue));
        if (typeof chains === "object" && Array.isArray(chains)) {
          const chainOverrides = chains as ChainMetadata[];
          const chain = chainOverrides.find(
            (c) =>
              c.slug === chainSlugOrId ||
              c.chainId === Number.parseInt(chainSlugOrId),
          );
          if (chain) {
            chainMetadata = chain;
          }
        }
      } catch {
        // noop
      }
    }
  }

  if (!chainMetadata) {
    return undefined;
  }

  // attempt to get the auth token
  const token = getAuthToken();

  const contract = getContract({
    address: contractAddress,
    // eslint-disable-next-line no-restricted-syntax
    chain: mapV4ChainToV5Chain(chainMetadata),
    // if we have the auth token pass it into the client
    client: getThirdwebClient(token || undefined),
  });

  return {
    chainMetadata,
    contract,
  };
}

function getCheckSummedAddress(address: string) {
  return isAddress(address) ? getAddress(address) : address;
}
