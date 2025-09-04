import { ArrowLeftRightIcon } from "lucide-react";
import { OverviewPage } from "../../components/blocks/OverviewPage";
import { transactionsFeatureCards } from "../data/pages-metadata";

export default function Page() {
  return (
    <OverviewPage
      title="Transactions"
      description="Provide interfaces to transact onchain with features such as transaction monitoring, gas sponsorship, and more"
      featureCards={transactionsFeatureCards}
      icon={ArrowLeftRightIcon}
    />
  );
}
