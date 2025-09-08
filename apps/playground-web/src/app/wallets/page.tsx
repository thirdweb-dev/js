import { OverviewPage } from "@/components/blocks/OverviewPage";
import { WalletProductIcon } from "../../icons/WalletProductIcon";
import { walletsFeatureCards } from "../data/pages-metadata";

export default function Page() {
  return (
    <OverviewPage
      icon={WalletProductIcon}
      title="Wallets"
      description={
        <>
          Create, onboard, and manage user identities in applications through
          in-app wallets and server wallets.
        </>
      }
      featureCards={walletsFeatureCards}
    />
  );
}
