import { OverviewPage } from "@/components/blocks/OverviewPage";
import { SmartAccountIcon } from "../../icons/SmartAccountIcon";
import { accountAbstractionsFeatureCards } from "../data/pages-metadata";

export default function Page() {
  return (
    <OverviewPage
      icon={SmartAccountIcon}
      title="Account Abstraction"
      description={
        <>
          Transaction infrastructure for gasless or permissioned transactions
          utilizing EIP-4337 and 7702 specs
        </>
      }
      featureCards={accountAbstractionsFeatureCards}
    />
  );
}
