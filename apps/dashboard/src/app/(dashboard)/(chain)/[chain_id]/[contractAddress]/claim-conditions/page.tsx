import { notFound, redirect } from "next/navigation";
import { ClaimConditions } from "../_components/claim-conditions/claim-conditions";
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
  const {
    isERC20ClaimConditionsSupported,
    isERC721ClaimConditionsSupported,
    supportedERCs,
  } = await getContractPageMetadata(contract);

  if (!isERC20ClaimConditionsSupported && !isERC721ClaimConditionsSupported) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return (
    <ClaimConditions contract={contract} isERC20={supportedERCs.isERC20} />
  );
}
