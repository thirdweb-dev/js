import { EditionDrop } from "@thirdweb-dev/sdk";
import { DropPhases } from "components/contract-tabs/phases/DropPhases";

interface IEditionDropTokenSettingsSection {
  tokenId: string;
  contract: EditionDrop;
}

export const EditionDropTokenSettingsSection: React.FC<
  IEditionDropTokenSettingsSection
> = ({ contract, tokenId }) => {
  return <DropPhases contract={contract} tokenId={tokenId} />;
};
