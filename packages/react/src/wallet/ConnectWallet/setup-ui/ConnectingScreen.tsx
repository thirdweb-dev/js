import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { media, spacing } from "../../../design-system";
import { isMobile } from "../../../evm/utils/isMobile";
import {
  BackButton,
  ModalTitle,
  ModalDescription,
  HelperLink,
} from "../shared/modalElements";
import styled from "@emotion/styled";
import { blue } from "@radix-ui/colors";

export const ConnectingScreen: React.FC<{
  onBack: () => void;
  icon: React.ReactNode;
  walletName: string;
  supportLink: string;
}> = (props) => {
  return (
    <>
      <BackButton onClick={props.onBack} />
      <Spacer y="lg" />
      <IconContainer>{props.icon}</IconContainer>
      <Spacer y="lg" />
      <TitleContainer>
        <ModalTitle>Connecting your wallet</ModalTitle>
        <Spinner size="md" color={blue.blue10} />
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
    gap: ${spacing.lg};
  }
`;

const IconContainer = styled.div`
  display: flex;
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
