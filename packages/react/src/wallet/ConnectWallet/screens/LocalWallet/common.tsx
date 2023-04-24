import { iconSize } from "../../../../design-system";
import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import { BackButton } from "../../../../components/modalElements";
import { useLocalWalletInfo } from "./useLocalWalletInfo";

export const LocalWalletModalHeader: React.FC<{ onBack: () => void }> = (
  props,
) => {
  const { meta } = useLocalWalletInfo();

  return (
    <>
      <BackButton onClick={props.onBack} />
      <Spacer y="md" />
      <Img src={meta.iconURL} width={iconSize.xl} height={iconSize.xl} />
      <Spacer y="sm" />
    </>
  );
};
