import { THIRDWEB_CLIENT } from "@/lib/client";
import Link from "next/link";
import { getHandleFromProfileId } from "thirdweb/extensions/lens";

export async function LensHandlePreview() {
  const profileId = 461662n;
  const handle = await getHandleFromProfileId({
    profileId,
    client: THIRDWEB_CLIENT,
  });

  return (
    <div className="flex flex-row p-4 text-4xl text-black bg-white rounded-lg">
      <div className="pr-3 mr-3 border-r border-black">@</div>
      <Link
        target="_blank"
        href={`https://hey.xyz/u/${handle.replace("lens/@", "")}`}
      >
        {handle.replace("lens/@", "")}
      </Link>
    </div>
  );
}
