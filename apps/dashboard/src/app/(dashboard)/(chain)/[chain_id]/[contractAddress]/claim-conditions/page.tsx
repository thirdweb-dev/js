import { notFound, redirect } from "next/navigation";
import { localhost } from "thirdweb/chains";
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
  const { contract, chainMetadata } = info;

  const account = await getRawAccount();

  if (chainMetadata.chainId === localhost.id) {
    return <ClaimConditionsClient contract={contract} twAccount={account} />;
  }

  const {
    isERC20ClaimConditionsSupported,
    isERC721ClaimConditionsSupported,
    supportedERCs,
  } = await getContractPageMetadata(contract);

  if (!isERC20ClaimConditionsSupported && !isERC721ClaimConditionsSupported) {
    redirect(`/${params.chain_id}/${params.contractAddress}`);
  }

  return (
    <ClaimConditions
      contract={contract}
      isERC20={supportedERCs.isERC20}
      twAccount={account}
    />
  );
}
