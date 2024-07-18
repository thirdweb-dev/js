import { THIRDWEB_SERVER_CLIENT } from "@/lib/serverClient";
import Link from "next/link";
import { getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { getHandleFromProfileId } from "thirdweb/extensions/lens";

export async function LensHandlePreview() {
  const client = THIRDWEB_SERVER_CLIENT;
  const profileId = 461662n;
  const handle = await getHandleFromProfileId({
    profileId,
    client,
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
