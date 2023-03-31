import { Modal } from "../../components/Modal";
import { iconSize, media, spacing } from "../../design-system";
import {
  HelperLink,
  ModalDescription,
  ModalTitle,
} from "../../components/modalElements";
import { useWallet } from "@thirdweb-dev/react-core";
import { Img } from "../../components/Img";
import { Spacer } from "../../components/Spacer";
import { Spinner } from "../../components/Spinner";
import styled from "@emotion/styled";

export const SignatureModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = (props) => {
  const wallet = useWallet();

  return (
    <Modal
      open={props.open}
      style={{
        maxWidth: "450px",
      }}
      setOpen={props.setOpen}
    >
      <Container>
        <Img
          height={iconSize.xl}
          src={wallet?.getMeta().iconURL as string}
          width={iconSize.xl}
        />

        <Spacer y="xl" />

        <TitleContainer>
          <ModalTitle>Signature Request</ModalTitle>
          <Spinner size="md" color="link" />
        </TitleContainer>

        <Spacer y="md" />

        <Desc>Sign the signature request pop-up in your wallet</Desc>

        <Spacer y="xxl" />

        <HelperLink target="_blank" href="https://support.thirdweb.com/contact">
          Having troubles connecting to wallet
        </HelperLink>
      </Container>
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

const Desc = styled(ModalDescription)`
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
