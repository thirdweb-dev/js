import { DeployFormForPublishInfo } from "../../../../components/publish-based-deploy";
import { moduleFromBase64 } from "../../../../utils/module-base-64";

export default async function PublishedContractVersionDeployPage(props: {
  params: Promise<{
    publisher: string;
    contract_id: string;
    version: string;
  }>;
  searchParams: Promise<{
    module?: string[] | string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const moduleParam =
    typeof searchParams.module === "string"
      ? [searchParams.module]
      : searchParams.module;

  const modules =
    moduleParam?.map((m) => moduleFromBase64(m)).filter((m) => m !== null) ||
    [];
  return <DeployFormForPublishInfo {...params} modules={modules} />;
}
