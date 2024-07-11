import { TipJar } from "@/components/tip-jar.client";
import { client } from "@/lib/thirdweb-client";
import { getContract, readContract } from "thirdweb";
import { ethereum } from "thirdweb/chains";

export default async function TipPage(props: { params: { slug: string[] } }) {
  // TODO: handle branches other than `main`
  const doesRepoExist = await fetch(
    `https://raw.githubusercontent.com/${props.params.slug.join("/")}/main/README.md`,
  ).then((res) => res.ok);

  if (!doesRepoExist) {
    return <div>Repo not found</div>;
  }
  const res = await fetch(
    `https://raw.githubusercontent.com/${props.params.slug.join("/")}/main/FUNDING.json`,
  );
  if (!res.ok) {
    return <div>Funding.json not found</div>;
  }
  const data = (await res.json()) as {
    drips?: {
      ethereum?: {
        ownedBy?: string;
      };
    };
  };

  if (!data.drips?.ethereum?.ownedBy) {
    return <div>Drips not set up</div>;
  }

  const contract = getContract({
    address: "0x1455d9bD6B98f95dd8FEB2b3D60ed825fcef0610",
    chain: ethereum,
    client,
  });

  const driverId = await readContract({
    contract,
    method:
      "function calcAccountId(address addr) view returns (uint256 accountId)",
    params: [data.drips.ethereum.ownedBy],
  });

  return (
    <div className="flex flex-col gap-8 items-center">
      <h1 className="text-3xl font-bold">
        tip <code>/{props.params.slug.join("/")}</code> repo
      </h1>

      <TipJar driverId={driverId} />
    </div>
  );
}
