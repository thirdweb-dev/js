import { setOverrides } from "lib/vercel-utils";
import { DeployFormForUri } from "../../../published-contract/components/uri-based-deploy";

setOverrides();

type DirectDeployPageProps = {
  params: {
    compiler_uri: string;
  };
};

export default function DirectDeployPage(props: DirectDeployPageProps) {
  return (
    <div className="container py-8">
      {/* TODO: bring back the name here */}
      <DeployFormForUri uri={props.params.compiler_uri} />
    </div>
  );
}
