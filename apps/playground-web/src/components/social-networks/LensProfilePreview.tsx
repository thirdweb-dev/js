import { THIRDWEB_CLIENT } from "@/lib/client";
import Image from "next/image";
import Link from "next/link";
import { getFullProfile } from "thirdweb/extensions/lens";
import { download } from "thirdweb/storage";

export async function LensProfilePreview() {
  const profileId = 461662n;
  const profile = await getFullProfile({
    profileId,
    client: THIRDWEB_CLIENT,
    includeJoinDate: true,
  });

  // console.log(profile);
  const coverImage = profile?.profileData?.lens.coverPicture
    ? (
        await download({
          uri: profile?.profileData?.lens.coverPicture,
          client: THIRDWEB_CLIENT,
        })
      ).url
    : "";
  console.log({ coverImage });
  const userImage = profile?.profileData?.lens.picture;
  const userName = profile?.profileData?.lens.name;
  const userBio = profile?.profileData?.lens.bio;
  const joinDate = profile?.profileData?.joinDate
    ? new Date(Number(profile.profileData?.joinDate * 1000n))
    : "";
  return (
    <div className="max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md">
      <div
        className={`h-32 ${coverImage ? "bg-cover" : "bg-black"} ${coverImage && "bg-center"} rounded-b-3xl`}
        style={{ backgroundImage: coverImage ? `url(${coverImage})` : "" }}
      >
        <div className="relative h-32">
          <img
            width={96}
            height={96}
            src={userImage ?? ""}
            alt="User"
            className="absolute w-24 h-24 mx-auto transform -translate-x-1/2 border-4 border-white rounded-full -bottom-12 left-1/2"
          />
        </div>
      </div>
      <div className="p-6 pt-16 text-center">
        <h2 className="text-xl font-semibold text-black">
          {userName ?? "Lens user"}
        </h2>
        <p className="text-gray-600">{userBio ?? "There's nothing here"}</p>
        {joinDate && (
          <p className="mt-5 text-xs text-gray-600">
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
          className="text-xs text-gray-600 underline"
          href={`https://hey.xyz/u/${profile?.handle.replace("lens/@", "")}`}
        >
          Hey.xyz ↗
        </Link>
      </div>
    </div>
  );
}
