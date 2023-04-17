import styled from "@emotion/styled";
import { iconSize, media } from "../../../../design-system";
import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import { BackButton } from "../../../../components/modalElements";
import { useDeviceWalletInfo } from "./useDeviceWalletInfo";

const IconContainer = styled.div`
  display: flex;
  ${media.mobile} {
    justify-content: center;
    margin-top: 0;
  }
`;

export const DeviceWalletModalHeader: React.FC<{ onBack: () => void }> = (
  props,
) => {
  const { meta } = useDeviceWalletInfo();

  return (
    <>
      <BackButton onClick={props.onBack} />
      <Spacer y="md" />
      <IconContainer>
        <Img src={meta.iconURL} width={iconSize.xl} height={iconSize.xl} />
      </IconContainer>
      <Spacer y="sm" />
    </>
  );
};
