import { OverviewPage } from "@/components/blocks/OverviewPage";
import { PayIcon } from "@/icons/PayIcon";
import { paymentsFeatureCards } from "../data/pages-metadata";

export default function Page() {
  return (
    <OverviewPage
      title="Payments"
      description="thirdweb Payments allow developers to create advanced payment flows to monetize their apps through product sales, peer to peer payments, token sales, and more"
      featureCards={paymentsFeatureCards}
      icon={PayIcon}
    />
  );
}
