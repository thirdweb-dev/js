import { THIRDWEB_CLIENT } from "@/lib/client";
import { resolveAvatar } from "thirdweb/extensions/ens";

const client = THIRDWEB_CLIENT;

export async function EnsProfilePreview() {
  const name = "vitalik.eth";
  const avatar = await resolveAvatar({
    client,
    name,
  });

  return (
    <div className="max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md pt-6 px-8">
      <img
        width={96}
        height={96}
        src={avatar ?? ""}
        alt="User"
        className="w-24 h-24 mx-auto border-4 border-white rounded-full"
      />
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-black">{name}</h2>
      </div>
    </div>
  );
}
