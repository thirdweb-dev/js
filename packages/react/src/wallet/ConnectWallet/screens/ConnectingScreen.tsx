import { Img } from "../../../components/Img";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import {
  BackButton,
  HelperLink,
  ModalDescription,
  ModalTitle,
} from "../../../components/modalElements";
import { iconSize, media, spacing } from "../../../design-system";
import { isMobile } from "../../../evm/utils/isMobile";
import styled from "@emotion/styled";

export const ConnectingScreen: React.FC<{
  onBack: () => void;
  walletIconURL: string;
  walletName: string;
  supportLink: string;
}> = (props) => {
  return (
    <>
      <BackButton onClick={props.onBack} />
      <IconContainer>
        <Img
          src={props.walletIconURL}
          width={iconSize.xl}
          height={iconSize.xl}
        />
      </IconContainer>
      <Spacer y="lg" />
      <TitleContainer>
        <ModalTitle>Connecting your wallet</ModalTitle>
        <Spinner size="md" color="link" />
      </TitleContainer>
      <Spacer y="md" />
      <Desc>
        Connect your wallet through the {props.walletName}{" "}
        {isMobile() ? "application" : "pop-up"}
      </Desc>
      <Spacer y="xl" />
      <HelperLink target="_blank" href={props.supportLink}>
        Having troubles connecting to {props.walletName}?
      </HelperLink>
    </>
  );
};

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  ${media.mobile} {
    flex-direction: column;
    align-items: center;
    gap: ${spacing.xl};
  }
`;

const IconContainer = styled.div`
  display: flex;
  margin-top: ${spacing.lg};
  ${media.mobile} {
    justify-content: center;
    margin-top: 0;
  }
`;

const Desc = styled(ModalDescription)`
  ${media.mobile} {
    padding: 0 ${spacing.lg};
  }
`;
