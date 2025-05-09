import { notFound, redirect } from "next/navigation";
import { getRawAccount } from "../../../../../account/settings/getAccount";
import { ClaimConditions } from "../_components/claim-conditions/claim-conditions";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { ClaimConditionsClient } from "./ClaimConditions.client";

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
  const { clientContract, serverContract, isLocalhostChain } = info;

  const [
    account,
    {
      isERC20ClaimConditionsSupported,
      isERC721ClaimConditionsSupported,
      supportedERCs,
    },
  ] = await Promise.all([
    getRawAccount(),
    isLocalhostChain
      ? {
          isERC20ClaimConditionsSupported: undefined,
          isERC721ClaimConditionsSupported: undefined,
          supportedERCs: undefined,
        }
      : getContractPageMetadata(serverContract),
  ]);

  if (isLocalhostChain) {
    return (
      <ClaimConditionsClient contract={clientContract} isLoggedIn={!!account} />
    );
  }

  if (!isERC20ClaimConditionsSupported && !isERC721ClaimConditionsSupported) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <ClaimConditions
      contract={clientContract}
      isERC20={supportedERCs.isERC20}
      isLoggedIn={!!account}
      isMultiphase={true}
    />
  );
}
