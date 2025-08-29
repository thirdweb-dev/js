import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import type { SidebarLink } from "@/components/blocks/Sidebar";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import { DeprecatedAlert } from "@/components/contracts/DeprecatedAlert";
import type { MinimalTeamsAndProjects } from "@/components/contracts/import-contract/types";
import type { DashboardContractMetadata } from "@/hooks/useDashboardContractMetadata";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { ContractMetadata } from "./contract-metadata";
import { PrimaryDashboardButton } from "./primary-dashboard-button";

export function ContractPageLayout(props: {
  chainMetadata: ChainMetadata;
  contract: ThirdwebContract;
  children: React.ReactNode;
  sidebarLinks: SidebarLink[];
  dashboardContractMetadata: DashboardContractMetadata | undefined;
  teamsAndProjects: MinimalTeamsAndProjects | undefined;
  projectMeta: ProjectMeta | undefined;
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
    projectMeta,
  } = props;

  return (
    <div className="flex flex-col grow">
      <div className="border-border border-b py-8">
        <div className="container flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <ContractMetadata
              chain={chainMetadata}
              contract={contract}
              contractMetadata={dashboardContractMetadata}
              externalLinks={externalLinks}
            />
            <PrimaryDashboardButton
              chain={contract.chain}
              client={contract.client}
              contractAddress={contract.address}
              contractInfo={{
                chain: chainMetadata,
                chainSlug: chainMetadata.slug,
                contractAddress: contract.address,
              }}
              projectMeta={projectMeta}
              teamsAndProjects={teamsAndProjects}
            />
          </div>
          <DeprecatedAlert chain={chainMetadata} />
        </div>
      </div>

      <SidebarLayout sidebarLinks={sidebarLinks}>
        {props.children}
        <div className="h-20" />
      </SidebarLayout>
    </div>
  );
}
