import { getThirdwebClient } from "@/constants/thirdweb.server";
import { mapV4ChainToV5Chain } from "contexts/map-chains";
import { cookies } from "next/headers";
import { getAddress, getContract, isAddress } from "thirdweb";
import { LAST_USED_TEAM_ID } from "../../../../../../../constants/cookies";
import { fetchChainWithLocalOverrides } from "../../../../../../../utils/fetchChainWithLocalOverrides";
import { getAuthToken } from "../../../../../api/lib/getAuthToken";

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
  const token = await getAuthToken();
  const cookiesObj = await cookies();
  const teamId = cookiesObj.get(LAST_USED_TEAM_ID)?.value;

  const contract = getContract({
    address: contractAddress,
    // eslint-disable-next-line no-restricted-syntax
    chain: mapV4ChainToV5Chain(chainMetadata),
    // if we have the auth token pass it into the client
    client: getThirdwebClient({
      jwt: token || undefined,
      teamId,
    }),
  });

  return {
    chainMetadata,
    contract,
  };
}

function getCheckSummedAddress(address: string) {
  return isAddress(address) ? getAddress(address) : address;
}
