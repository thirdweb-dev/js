import type { PublicContractPageParams } from "../types";
import { SharedContractAccountPermissionsPage } from "./shared-account-permissions-page";

export default async function Page(props: {
  params: Promise<PublicContractPageParams>;
}) {
  const params = await props.params;
  return (
    <SharedContractAccountPermissionsPage
      chainIdOrSlug={params.chain_id}
      contractAddress={params.contractAddress}
      projectMeta={undefined}
    />
  );
}
