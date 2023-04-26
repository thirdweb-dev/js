import { iconSize } from "../../../../design-system";
import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import { BackButton } from "../../../../components/modalElements";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import { Wallet } from "@thirdweb-dev/react-core";

export const LocalWalletModalHeader: React.FC<{
  onBack: () => void;
  meta?: Wallet["meta"];
}> = (props) => {
  const { meta } = useLocalWalletInfo();
  const _meta = props.meta || meta;

  return (
    <>
      <BackButton onClick={props.onBack} />
      <Spacer y="md" />
      <Img src={_meta.iconURL} width={iconSize.xl} height={iconSize.xl} />
      <Spacer y="sm" />
    </>
  );
};
