import { BoxIcon } from "lucide-react";
import { OverviewPage } from "@/components/blocks/OverviewPage";
import { headlessComponentsFeatureCards } from "../../data/pages-metadata";

export default function Page() {
  return (
    <OverviewPage
      title="Headless Components"
      description="Components for rendering Wallet, Chain, and Account information"
      featureCards={headlessComponentsFeatureCards}
      icon={BoxIcon}
    />
  );
}
