import { getAddress, getContract, isAddress } from "thirdweb";
import { localhost } from "thirdweb/chains";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { mapV4ChainToV5Chain } from "@/utils/map-chains";
import { getUserThirdwebClient } from "../../../../../../../@/api/auth-token";
import { fetchChainWithLocalOverrides } from "../../../../../../../@/utils/fetchChainWithLocalOverrides";

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

  // attempt to get the auth token

  const serverContract = getContract({
    address: contractAddress,
    // eslint-disable-next-line no-restricted-syntax
    chain: mapV4ChainToV5Chain(chainMetadata),
    client: serverThirdwebClient,
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
