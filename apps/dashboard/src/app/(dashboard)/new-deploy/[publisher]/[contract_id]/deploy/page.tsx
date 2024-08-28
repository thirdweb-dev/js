import { setOverrides } from "lib/vercel-utils";
import { DeployFormForPublishInfo } from "../../../components/publish-based-deploy";

setOverrides();

type PublishedContractDeployPageProps = {
  params: {
    publisher: string;
    contract_id: string;
  };
};

export default function PublishedContractDeployPage(
  props: PublishedContractDeployPageProps,
) {
  return (
    <div className="container">
      <DeployFormForPublishInfo
        contract_id={props.params.contract_id}
        publisher={props.params.publisher}
      />
    </div>
  );
}
