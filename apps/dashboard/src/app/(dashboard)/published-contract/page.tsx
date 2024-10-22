import { getThirdwebClient } from "@/constants/thirdweb.server";
import { redirect } from "next/navigation";
import { fetchDeployMetadata } from "thirdweb/contract";

export default async function Page(props: {
  searchParams: Promise<{
    uri?: string;
  }>;
}) {
  if (!(await props.searchParams)?.uri) {
    // redirect back out if we do not have a uri
    return redirect("/dashboard");
  }

  const contractMetadata = await fetchDeployMetadata({
    client: getThirdwebClient(),
    // force `ipfs://` prefix
    uri: (await props.searchParams).uri.startsWith("ipfs://")
      ? (await props.searchParams).uri
      : `ipfs://${(await props.searchParams).uri}`,
  }).catch(() => null);

  return (
    <div className="container">
      <pre>{JSON.stringify(contractMetadata, null, 2)}</pre>
    </div>
  );
}
