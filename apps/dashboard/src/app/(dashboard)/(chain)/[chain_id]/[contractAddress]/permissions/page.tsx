import { notFound } from "next/navigation";
import { ContractPermissionsPage } from "../../../../../../contract-ui/tabs/permissions/page";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";

export default async function Page(props: {
  params: {
    contractAddress: string;
    chain_id: string;
  };
}) {
  const info = await getContractPageParamsInfo(props.params);

  if (!info) {
    notFound();
  }

  const { contract } = info;
  const { isPermissionsEnumerableSupported } =
    await getContractPageMetadata(contract);

  return (
    <ContractPermissionsPage
      contract={contract}
      chainSlug={info.chainMetadata.slug}
      detectedPermissionEnumerable={isPermissionsEnumerableSupported}
    />
  );
}
