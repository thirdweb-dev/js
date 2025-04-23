import { getUserThirdwebClient } from "../../../../../api/lib/getAuthToken";
import { DeployFormForPublishInfo } from "../../../components/publish-based-deploy";
import { moduleFromBase64 } from "../../../utils/module-base-64";

type Props = {
  params: Promise<{
    publisher: string;
    contract_id: string;
  }>;
  searchParams: Promise<{
    module?: string[] | string;
  }>;
};

export default async function PublishedContractDeployPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const moduleParam =
    typeof searchParams.module === "string"
      ? [searchParams.module]
      : searchParams.module;

  const modules =
    moduleParam?.map((m) => moduleFromBase64(m)).filter((m) => m !== null) ||
    [];

  const client = await getUserThirdwebClient();

  return (
    <DeployFormForPublishInfo {...params} modules={modules} client={client} />
  );
}
