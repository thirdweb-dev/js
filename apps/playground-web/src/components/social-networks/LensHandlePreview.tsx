import { THIRDWEB_CLIENT } from "@/lib/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { getHandleFromProfileId } from "thirdweb/extensions/lens";

const client = THIRDWEB_CLIENT;

export async function LensHandlePreview() {
  const profileId = 461662n;
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
  const handle = await getHandleFromProfileId({
    profileId,
    lensHandleContract,
    tokenHandleRegistryContract,
  });

  return (
    <div className="bg-white text-black text-4xl flex flex-row p-4 rounded-lg">
      <div className="border-r border-black pr-3 mr-3">@</div>
      <Link
        target="_blank"
        href={`https://hey.xyz/u/${handle.replace("lens/@", "")}`}
      >
        {handle.replace("lens/@", "")}
      </Link>
    </div>
  );
}
