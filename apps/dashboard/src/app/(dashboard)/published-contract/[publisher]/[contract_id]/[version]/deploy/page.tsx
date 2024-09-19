import { DeployFormForPublishInfo } from "../../../../components/publish-based-deploy";
import { moduleFromBase64 } from "../../../../utils/module-base-64";

export default function PublishedContractVersionDeployPage({
  params,
  searchParams,
}: {
  params: {
    publisher: string;
    contract_id: string;
    version: string;
  };
  searchParams: {
    module?: string[];
  };
}) {
  const modules = searchParams.module
    ?.map((m) => moduleFromBase64(m))
    .filter((m) => m !== null);
  return <DeployFormForPublishInfo {...params} modules={modules} />;
}
