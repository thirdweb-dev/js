import { OverviewPage } from "@/components/blocks/OverviewPage";
import { PayIcon } from "@/icons/PayIcon";
import { bridgeFeatureCards } from "../data/pages-metadata";

export default function Page() {
  return (
    <OverviewPage
      title="Bridge"
      description="thirdweb Bridge lets developers swap and transfer any token across any chain instantly"
      featureCards={bridgeFeatureCards}
      icon={PayIcon}
    />
  );
}
