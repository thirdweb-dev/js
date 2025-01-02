import { ChakraProviderSetup } from "@/components/ChakraProviderSetup";
import type { SidebarLink } from "@/components/blocks/Sidebar";
import { SidebarLayout } from "@/components/blocks/SidebarLayout";
import type { DashboardContractMetadata } from "@3rdweb-sdk/react/hooks/useDashboardContractMetadata";
import { DeprecatedAlert } from "components/shared/DeprecatedAlert";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { ContractMetadata } from "./contract-metadata";
import { PrimaryDashboardButton } from "./primary-dashboard-button";

export function ContractPageLayout(props: {
  chainMetadata: ChainMetadata;
  contract: ThirdwebContract;
  children: React.ReactNode;
  sidebarLinks: SidebarLink[];
  dashboardContractMetadata: DashboardContractMetadata | undefined;
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
  } = props;

  return (
    <ChakraProviderSetup>
      <SidebarLayout sidebarLinks={sidebarLinks}>
        <div className="border-border border-b pb-8">
          <div className="flex flex-col gap-4 ">
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
              />
            </div>
            <DeprecatedAlert chain={chainMetadata} />
          </div>
        </div>
        <div className="h-8" />
        <div className="pb-10">{props.children}</div>
      </SidebarLayout>
    </ChakraProviderSetup>
  );
}
