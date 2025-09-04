import { OverviewPage } from "@/components/blocks/OverviewPage";
import { PayIcon } from "../../icons/PayIcon";
import { paymentsFeatureCards } from "../data/pages-metadata";

export default function Page() {
  return (
    <OverviewPage
      icon={PayIcon}
      title="Payments"
      description={
        <>
          Allow developers and users to receive and spend any token on any EVM
          chain
        </>
      }
      featureCards={paymentsFeatureCards}
    />
  );
}
