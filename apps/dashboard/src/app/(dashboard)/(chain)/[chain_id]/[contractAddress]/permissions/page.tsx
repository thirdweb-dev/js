import { notFound } from "next/navigation";
import { localhost } from "thirdweb/chains";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ContractPermissionsPage } from "./ContractPermissionsPage";
import { ContractPermissionsPageClient } from "./ContractPermissionsPage.client";

export default async function Page(props: {
  params: Promise<{
    contractAddress: string;
    chain_id: string;
  }>;
}) {
  const params = await props.params;
  const info = await getContractPageParamsInfo(params);

  if (!info) {
    notFound();
  }

  const account = await getRawAccount();

  const { contract } = info;
  if (contract.chain.id === localhost.id) {
    return (
      <ContractPermissionsPageClient
        contract={contract}
        chainMetadata={info.chainMetadata}
        twAccount={account}
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
      twAccount={account}
    />
  );
}
