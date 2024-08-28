import { thirdwebClient } from "@/constants/client";
import { fetchDeployMetadata } from "thirdweb/contract";

export type DeployFormProps = {
  uri: string;
};

export async function DeployForm(props: DeployFormProps) {
  const deployMetadata = await fetchDeployMetadata({
    client: thirdwebClient,
    uri: props.uri,
  });

  console.log(deployMetadata);

  return <div>foo</div>;
}

// DEPLOY
// 1. CLI Output = metadataURI -> compiler metadata
// 2. CLI Output = bytecodeURI -> bytecode

// PUBLISH
// 3. Publish -> wrap that inside "publish metadata" (adds version, author, etc, publish settings)
