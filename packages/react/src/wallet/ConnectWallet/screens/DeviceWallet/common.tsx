import { iconSize } from "../../../../design-system";
import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import { BackButton } from "../../../../components/modalElements";
import { useDeviceWalletInfo } from "./useDeviceWalletInfo";

export const DeviceWalletModalHeader: React.FC<{ onBack: () => void }> = (
  props,
) => {
  const { meta } = useDeviceWalletInfo();

  return (
    <>
      <BackButton onClick={props.onBack} />
      <Spacer y="md" />
      <Img src={meta.iconURL} width={iconSize.xl} height={iconSize.xl} />
      <Spacer y="sm" />
    </>
  );
};
