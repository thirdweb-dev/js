import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import type { SidebarLink } from "@/components/blocks/Sidebar";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import type { DashboardContractMetadata } from "@3rdweb-sdk/react/hooks/useDashboardContractMetadata";
import type { MinimalTeamsAndProjects } from "components/contract-components/contract-deploy-form/add-to-project-card";
import { DeprecatedAlert } from "components/shared/DeprecatedAlert";
import type { ThirdwebClient, ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { ContractMetadata } from "./contract-metadata";
import { PrimaryDashboardButton } from "./primary-dashboard-button";

export function ContractPageLayout(props: {
  chainMetadata: ChainMetadata;
  contract: ThirdwebContract;
  children: React.ReactNode;
  sidebarLinks: SidebarLink[];
  dashboardContractMetadata: DashboardContractMetadata | undefined;
  client: ThirdwebClient;
  teamsAndProjects: MinimalTeamsAndProjects | undefined;
  externalLinks:
    | {
        name: string;
        url: string;
      }[]
    | undefined;
}) {
  const {
    chainMetadata,
    contract,
    sidebarLinks,
    dashboardContractMetadata,
    externalLinks,
    teamsAndProjects,
    client,
  } = props;

  return (
    <ChakraProviderSetup>
      <div className="border-border border-b py-8">
        <div className="container flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <ContractMetadata
              contract={contract}
              chain={chainMetadata}
              contractMetadata={dashboardContractMetadata}
              externalLinks={externalLinks}
            />
            <PrimaryDashboardButton
              contractAddress={contract.address}
              chain={contract.chain}
              contractInfo={{
                chain: chainMetadata,
                chainSlug: chainMetadata.slug,
                contractAddress: contract.address,
              }}
              teamsAndProjects={teamsAndProjects}
              client={client}
            />
          </div>
          <DeprecatedAlert chain={chainMetadata} />
        </div>
      </div>

      <SidebarLayout sidebarLinks={sidebarLinks}>
        {props.children}
        <div className="h-20" />
      </SidebarLayout>
    </ChakraProviderSetup>
  );
}
