import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { CustomContractForm } from "components/contract-components/contract-deploy-form/custom-contract";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAddress } from "thirdweb";
import type { FetchDeployMetadataResult } from "thirdweb/contract";

type DeployFormForUriProps = {
  contractMetadata: FetchDeployMetadataResult | null;
  modules: FetchDeployMetadataResult[] | null;
  pathname: string;
};

export async function DeployFormForUri(props: DeployFormForUriProps) {
  const { contractMetadata, modules, pathname } = props;

  if (!contractMetadata) {
    return <div>Could not fetch metadata</div>;
  }

  const cookieStore = await cookies();
  const address = cookieStore.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  if (!address) {
    redirect(`/login?next=${encodeURIComponent(pathname)}`);
  }
  const authCookieName = COOKIE_PREFIX_TOKEN + getAddress(address);
  const token = cookieStore.get(authCookieName)?.value;
  if (!token) {
    redirect(`/login?next=${encodeURIComponent(pathname)}`);
  }

  // TODO: remove the `ChakraProviderSetup` wrapper once the form is updated to no longer use chakra
  return (
    <ChakraProviderSetup>
      <CustomContractForm
        metadata={contractMetadata}
        modules={modules?.filter((m) => m !== null)}
        jwt={token}
      />
    </ChakraProviderSetup>
  );
}
