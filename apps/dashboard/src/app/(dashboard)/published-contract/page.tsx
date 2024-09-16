import { thirdwebClient } from "@/constants/client";
import { redirect } from "next/navigation";
import { fetchDeployMetadata } from "thirdweb/contract";

export default async function Page(props: {
  searchParams: {
    uri?: string;
  };
}) {
  if (!props.searchParams?.uri) {
    // redirect back out if we do not have a uri
    return redirect("/dashboard");
  }

  const contractMetadata = await fetchDeployMetadata({
    client: thirdwebClient,
    // force `ipfs://` prefix
    uri: props.searchParams.uri.startsWith("ipfs://")
      ? props.searchParams.uri
      : `ipfs://${props.searchParams.uri}`,
  }).catch(() => null);

  return (
    <div className="container">
      <pre>{JSON.stringify(contractMetadata, null, 2)}</pre>
    </div>
  );
}
