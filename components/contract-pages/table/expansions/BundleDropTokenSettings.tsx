import { EditionDrop } from "@thirdweb-dev/sdk";
import { DropPhases } from "components/contract-tabs/phases/DropPhases";

interface IBundleDropTokenSettingsSection {
  tokenId: string;
  contract: EditionDrop;
}

export const BundleDropTokenSettingsSection: React.FC<
  IBundleDropTokenSettingsSection
> = ({ contract, tokenId }) => {
  return <DropPhases contract={contract} tokenId={tokenId} />;
};
