import Link from "next/link";
import { getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { getFullProfile } from "thirdweb/extensions/lens";
import { download } from "thirdweb/storage";
import { THIRDWEB_CLIENT } from "@/lib/client";

const client = THIRDWEB_CLIENT;

export async function LensProfilePreview() {
  const profileId = 461662n;
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
  const profile = await getFullProfile({
    profileId,
    lensHubContract,
    lensHandleContract,
    tokenHandleRegistryContract,
    client,
    includeJoinDate: true,
  });

  // console.log(profile);
  const coverImage = profile?.lens.coverPicture
    ? (await download({ uri: profile?.lens.coverPicture, client })).url
    : "";
  console.log({ coverImage });
  const userImage = profile?.lens.picture;
  const userName = profile?.lens.name;
  const userBio = profile?.lens.bio;
  const joinDate = profile?.joinDate
    ? new Date(Number(profile.joinDate * 1000n))
    : "";
  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div
        className={`h-32 ${coverImage ? "bg-cover" : "bg-black"} ${coverImage && "bg-center"} rounded-b-3xl`}
        style={{ backgroundImage: coverImage ? `url(${coverImage})` : "" }}
      >
        <div className="relative h-32">
          <img
            src={userImage}
            alt="User"
            className="w-24 h-24 rounded-full border-4 border-white mx-auto absolute -bottom-12 left-1/2 transform -translate-x-1/2"
          />
        </div>
      </div>
      <div className="pt-16 p-6 text-center">
        <h2 className="text-xl font-semibold text-black">
          {userName ?? "Lens user"}
        </h2>
        <p className="text-gray-600">{userBio ?? "There's nothing here"}</p>
        {joinDate && (
          <p className="text-gray-600 text-xs mt-5">
            Joined{" "}
            <b>
              {joinDate.toLocaleDateString("en-US", {
                month: "long",
                day: "2-digit",
                year: "numeric",
              })}
            </b>
          </p>
        )}

        <Link
          target="_blank"
          className="text-gray-600 text-xs underline"
          href={`https://hey.xyz/u/${profile?.handle.replace("lens/@", "")}`}
        >
          Hey.xyz ↗
        </Link>
      </div>
    </div>
  );
}
