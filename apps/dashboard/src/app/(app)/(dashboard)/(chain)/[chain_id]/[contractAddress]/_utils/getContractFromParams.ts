import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { mapV4ChainToV5Chain } from "contexts/map-chains";
import { getAddress, getContract, isAddress } from "thirdweb";
import { localhost } from "thirdweb/chains";
import { fetchChainWithLocalOverrides } from "../../../../../../../utils/fetchChainWithLocalOverrides";
import { getUserThirdwebClient } from "../../../../../api/lib/getAuthToken";

export async function getContractPageParamsInfo(params: {
  contractAddress: string;
  chain_id: string;
}) {
  const contractAddress = getCheckSummedAddress(params.contractAddress);
  const chainSlugOrId = params.chain_id;
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
    client: await getUserThirdwebClient(),
  });

  return {
    chainMetadata,
    serverContract,
    clientContract,
    isLocalhostChain: chainMetadata.chainId === localhost.id,
  };
}

function getCheckSummedAddress(address: string) {
  return isAddress(address) ? getAddress(address) : address;
}
