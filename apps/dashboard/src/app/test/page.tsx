import { thirdwebClient } from "@/constants/client";
import { createThirdwebClient, getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { getNFT } from "thirdweb/extensions/erc721";
import { getProfileFromTokenId } from "thirdweb/extensions/lens";
import { stringify } from "thirdweb/utils";

const client = createThirdwebClient({
  // clientId: "f2fed783d8b14ab2772611a2ce949f72",
  secretKey:
    "MchNRd-lXKibqtRWVuwP4Ar2B4_GPtT8XIWYuJqF0dcZJKmSWtmj0R9MzxxwdfnvxeEQixdLuNkvWIx1pZaN0g",
});

export default async function Page() {
  const tokenId = 406845n;
  const lensHubContract = getContract({
    address: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
    chain: polygon,
    client,
  });
  const lensHandleContract = getContract({
    address: "0xe7E7EaD361f3AaCD73A61A9bD6C10cA17F38E945",
    chain: polygon,
    client,
  });
  const tokenHandleRegistryContract = getContract({
    address: "0xD4F2F33680FCCb36748FA9831851643781608844",
    chain: polygon,
    client,
  });

  const profile = await getProfileFromTokenId({
    tokenId,
    lensHubContract,
    lensHandleContract,
    tokenHandleRegistryContract,
    includeJoinDate: true,
  });

  const profileSafe = JSON.parse(stringify(profile));

  const data = { profileSafe };
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
