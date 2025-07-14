import { getAddress, getContract, isAddress } from "thirdweb";
import { localhost } from "thirdweb/chains";
import { getUserThirdwebClient } from "@/api/auth-token";
import { DASHBOARD_THIRDWEB_SECRET_KEY } from "@/constants/server-envs";
import { getConfiguredThirdwebClient } from "@/constants/thirdweb.server";
import { fetchChainWithLocalOverrides } from "@/utils/fetchChainWithLocalOverrides";
import { mapV4ChainToV5Chain } from "@/utils/map-chains";

export async function getContractPageParamsInfo(params: {
  contractAddress: string;
  chainIdOrSlug: string;
  teamId: string | undefined;
}) {
  const contractAddress = getCheckSummedAddress(params.contractAddress);
  const chainSlugOrId = params.chainIdOrSlug;
  const chainMetadata = await fetchChainWithLocalOverrides(chainSlugOrId);

  if (!chainMetadata) {
    return undefined;
  }

  // Create server client only if secret key is available
  if (!DASHBOARD_THIRDWEB_SECRET_KEY) {
    return undefined;
  }

  const serverClient = getConfiguredThirdwebClient({
    secretKey: DASHBOARD_THIRDWEB_SECRET_KEY,
    teamId: undefined,
  });

  const serverContract = getContract({
    address: contractAddress,
    // eslint-disable-next-line no-restricted-syntax
    chain: mapV4ChainToV5Chain(chainMetadata),
    client: serverClient,
  });

  const clientContract = getContract({
    address: contractAddress,
    // eslint-disable-next-line no-restricted-syntax
    chain: mapV4ChainToV5Chain(chainMetadata),
    // if we have the auth token pass it into the client
    client: await getUserThirdwebClient({
      teamId: params.teamId,
    }),
  });

  return {
    chainMetadata,
    clientContract,
    isLocalhostChain: chainMetadata.chainId === localhost.id,
    serverContract,
  };
}

function getCheckSummedAddress(address: string) {
  return isAddress(address) ? getAddress(address) : address;
}
