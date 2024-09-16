import { setOverrides } from "lib/vercel-utils";
import { DeployFormForPublishInfo } from "../../../components/publish-based-deploy";
import { moduleFromBase64 } from "../../../utils/module-base-64";

setOverrides();

type Props = {
  params: {
    publisher: string;
    contract_id: string;
  };
  searchParams: {
    module?: string[];
  };
};

export default function PublishedContractDeployPage({
  params,
  searchParams,
}: Props) {
  const modules = searchParams.module
    ?.map((m) => moduleFromBase64(m))
    .filter((m) => m !== null);
  return <DeployFormForPublishInfo {...params} modules={modules} />;
}
