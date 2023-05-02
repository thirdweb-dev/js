import { iconSize } from "../../../../design-system";
import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import { BackButton } from "../../../../components/modalElements";
import { Wallet } from "@thirdweb-dev/react-core";

export const LocalWalletModalHeader: React.FC<{
  onBack: () => void;
  meta: Wallet["meta"];
}> = (props) => {
  return (
    <>
      <BackButton onClick={props.onBack} />
      <Spacer y="md" />
      <Img src={props.meta.iconURL} width={iconSize.xl} height={iconSize.xl} />
      <Spacer y="sm" />
    </>
  );
};
