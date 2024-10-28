import { notFound } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractPermissionsPage } from "./ContractPermissionsPage";
import { ContractPermissionsPageClient } from "./ContractPermissionsPage.client";

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
  if (contract.chain.id === localhost.id) {
    return (
      <ContractPermissionsPageClient
        contract={contract}
        chainMetadata={info.chainMetadata}
      />
    );
  }

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
