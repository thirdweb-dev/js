import { BotIcon } from "lucide-react";
import { OverviewPage } from "@/components/blocks/OverviewPage";
import { aiFeatureCards } from "../data/pages-metadata";

export default function Page() {
  return (
    <OverviewPage
      icon={BotIcon}
      title="thirdweb AI"
      description={
        <>
          Query onchain data, analyze transactions, prepare contract calls, and
          do swaps with AI
        </>
      }
      featureCards={aiFeatureCards}
    />
  );
}
