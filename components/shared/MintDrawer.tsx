import { Erc721, ValidContractInstance } from "@thirdweb-dev/sdk";
import { MintForm } from "components/contract-pages/forms/mint";
import { Drawer } from "tw-components";

interface IMintDrawer {
  contract?: ValidContractInstance | Erc721;
  isOpen: boolean;
  onClose: () => void;
}

export const MintDrawer: React.FC<IMintDrawer> = ({
  isOpen,
  onClose,
  contract,
}) => {
  return (
    <Drawer
      allowPinchZoom
      preserveScrollBarGap
      size="lg"
      onClose={onClose}
      isOpen={isOpen}
    >
      <MintForm contract={contract} />
    </Drawer>
  );
};
