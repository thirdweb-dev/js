import { getThirdwebClient } from "@/constants/thirdweb.server";
import { redirect } from "next/navigation";
import { fetchDeployMetadata } from "thirdweb/contract";

export default async function Page(props: {
  searchParams: Promise<{
    uri?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  if (!searchParams?.uri) {
    // redirect back out if we do not have a uri
    return redirect("/team");
  }

  const contractMetadata = await fetchDeployMetadata({
    client: getThirdwebClient(),
    // force `ipfs://` prefix
    uri: searchParams.uri.startsWith("ipfs://")
      ? searchParams.uri
      : `ipfs://${searchParams.uri}`,
  }).catch(() => null);

  return (
    <div className="container">
      <pre>{JSON.stringify(contractMetadata, null, 2)}</pre>
    </div>
  );
}
