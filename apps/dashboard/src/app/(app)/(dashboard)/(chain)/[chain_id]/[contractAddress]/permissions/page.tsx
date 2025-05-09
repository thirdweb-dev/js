import { notFound } from "next/navigation";
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

  const { clientContract, serverContract, isLocalhostChain } = info;
  if (isLocalhostChain) {
    return (
      <ContractPermissionsPageClient
        contract={clientContract}
        chainMetadata={info.chainMetadata}
        isLoggedIn={!!account}
      />
    );
  }

  const { isPermissionsEnumerableSupported } =
    await getContractPageMetadata(serverContract);

  return (
    <ContractPermissionsPage
      contract={clientContract}
      chainSlug={info.chainMetadata.slug}
      detectedPermissionEnumerable={isPermissionsEnumerableSupported}
      isLoggedIn={!!account}
    />
  );
}
