import { OverviewPage } from "@/components/blocks/OverviewPage";
import { TokenIcon } from "../../icons/TokenIcon";
import { tokensFeatureCards } from "../data/pages-metadata";

export default function Page() {
  return (
    <OverviewPage
      icon={TokenIcon}
      title="Tokens"
      description={<>Headless UI components for rendering tokens and NFTs</>}
      featureCards={tokensFeatureCards}
    />
  );
}
