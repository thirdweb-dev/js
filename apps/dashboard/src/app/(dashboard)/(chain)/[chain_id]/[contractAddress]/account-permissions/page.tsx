import { notFound, redirect } from "next/navigation";
import { getContractPageParamsInfo } from "../_utils/getContractFromParams";
import { getContractPageMetadata } from "../_utils/getContractPageMetadata";
import { AccountSigners } from "./components/account-signers";

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
  const { isAccountPermissionsSupported } =
    await getContractPageMetadata(contract);

  if (!isAccountPermissionsSupported) {
    redirect(`/${props.params.chain_id}/${props.params.contractAddress}`);
  }

  return (
    <div>
      <h1 className="mb-4 font-semibold text-2xl tracking-tight">
        Account Signers
      </h1>
      <AccountSigners contract={contract} />
    </div>
  );
}
