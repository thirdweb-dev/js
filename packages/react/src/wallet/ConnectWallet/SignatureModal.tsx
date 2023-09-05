import { Modal } from "../../components/Modal";
import { iconSize, media, spacing } from "../../design-system";
import {
  HelperLink,
  ModalDescription,
  ModalTitle,
} from "../../components/modalElements";
import { useWalletConfig } from "@thirdweb-dev/react-core";
import { Img } from "../../components/Img";
import { Spacer } from "../../components/Spacer";
import { Spinner } from "../../components/Spinner";
import styled from "@emotion/styled";
import { modalMaxWidthCompact } from "./constants";
import { ScreenContainer } from "../../components/basic";

export const SignatureModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  modalSize: "compact" | "wide";
}> = (props) => {
  const walletConfig = useWalletConfig();

  return (
    <Modal
      size={props.modalSize}
      open={props.open}
      style={{
        maxWidth: modalMaxWidthCompact,
      }}
      setOpen={props.setOpen}
    >
      <ScreenContainer>
        <Container>
          {walletConfig && (
            <Img
              height={iconSize.xl}
              src={walletConfig.meta.iconURL}
              width={iconSize.xl}
            />
          )}

          <Spacer y="xl" />

          <TitleContainer>
            <ModalTitle>Signature Request</ModalTitle>
            <Spinner size="md" color="accent" />
          </TitleContainer>

          <Spacer y="md" />

          <Desc>Sign the signature request pop-up in your wallet</Desc>

          <Spacer y="xxl" />

          <HelperLink
            target="_blank"
            href="https://support.thirdweb.com/contact"
          >
            Having troubles connecting to wallet
          </HelperLink>
        </Container>
      </ScreenContainer>
    </Modal>
  );
};

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};

  ${media.mobile} {
    justify-content: center;
    flex-direction: column;
    gap: ${spacing.md};
  }
`;

const Desc = /* @__PURE__ */ styled(ModalDescription)`
  ${media.mobile} {
    max-width: 240px;
    margin: 0 auto;
  }
`;

const Container = styled.div`
  ${media.mobile} {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
