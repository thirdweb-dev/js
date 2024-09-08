import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useAllContractList } from "@3rdweb-sdk/react/hooks/useRegistry";
import { AppLayout } from "components/app-layouts/app";
import { DeployedContracts } from "components/contract-components/tables/deployed-contracts";
import { ContractsSidebar } from "core-ui/sidebar/contracts";
import { PageId } from "page-id";
import { useActiveAccount } from "thirdweb/react";
import { GetStartedWithContractsDeploy } from "../../../app/team/[team_slug]/[project_slug]/contracts/_components/GetStartedWithContractsDeploy";
import type { ThirdwebNextPage } from "../../../utils/types";

const Contracts: ThirdwebNextPage = () => {
  const address = useActiveAccount()?.address;
  const deployedContracts = useAllContractList(address);

  if (deployedContracts.isLoading) {
    return (
      <div className="min-h-[500px] flex justify-center items-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  const hasContracts =
    deployedContracts.data && deployedContracts.data?.length > 0;

  if (!hasContracts) {
    return <GetStartedWithContractsDeploy />;
  }

  return <DeployedContracts contractListQuery={deployedContracts} limit={50} />;
};

Contracts.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <ContractsSidebar activePage="deploy" />
    {page}
  </AppLayout>
);
Contracts.pageId = PageId.Contracts;

export default Contracts;
