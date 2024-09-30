import { getThirdwebClient } from "@/constants/thirdweb.server";
import { cookies } from "next/headers";
import { getAddress, getContract, isAddress } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { mapV4ChainToV5Chain } from "../../../../../../contexts/map-chains";
import { TW_LOCAL_CHAIN_STORE } from "../../../../../../stores/storageKeys";
import { fetchChain } from "../../../../../../utils/fetchChain";

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
    const cookieStore = cookies();
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

  const contract = getContract({
    address: contractAddress,
    // eslint-disable-next-line no-restricted-syntax
    chain: mapV4ChainToV5Chain(chainMetadata),
    client: getThirdwebClient(),
  });

  return {
    chainMetadata,
    contract,
  };
}

function getCheckSummedAddress(address: string) {
  return isAddress(address) ? getAddress(address) : address;
}
