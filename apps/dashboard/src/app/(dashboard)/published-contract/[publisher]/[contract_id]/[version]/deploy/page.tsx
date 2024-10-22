import { DeployFormForPublishInfo } from "../../../../components/publish-based-deploy";
import { moduleFromBase64 } from "../../../../utils/module-base-64";

export default async function PublishedContractVersionDeployPage(
  props: {
    params: Promise<{
      publisher: string;
      contract_id: string;
      version: string;
    }>;
    searchParams: Promise<{
      module?: string[];
    }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const modules = searchParams.module
    ?.map((m) => moduleFromBase64(m))
    .filter((m) => m !== null);
  return <DeployFormForPublishInfo {...params} modules={modules} />;
}
