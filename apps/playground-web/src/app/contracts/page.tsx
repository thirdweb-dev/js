import { OverviewPage } from "@/components/blocks/OverviewPage";
import { ContractIcon } from "../../icons/ContractIcon";
import { contractsFeatureCards } from "../data/pages-metadata";

export default function Page() {
  return (
    <OverviewPage
      title="Contracts"
      description="Comprehensive toolkit to create, deploy, and manage smart contracts"
      featureCards={contractsFeatureCards}
      icon={ContractIcon}
    />
  );
}
