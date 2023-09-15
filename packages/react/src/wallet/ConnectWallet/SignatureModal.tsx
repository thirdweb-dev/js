import { Modal } from "../../components/Modal";
import { ModalTitle } from "../../components/modalElements";
import { useWalletConfig } from "@thirdweb-dev/react-core";
import { Spacer } from "../../components/Spacer";
import { Container } from "../../components/basic";
import { Text } from "../../components/text";
import { WalletLogoSpinner } from "./screens/WalletLogoSpinner";

export const SignatureModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = (props) => {
  const walletConfig = useWalletConfig();

  return (
    <Modal size="compact" open={props.open} setOpen={props.setOpen}>
      <Container p="lg">
        <Spacer y="xl" />
        <Container flex="column" center="x">
          {walletConfig && (
            <WalletLogoSpinner
              error={false}
              onRetry={() => {}}
              iconUrl={walletConfig.meta.iconURL}
            />
          )}

          <Spacer y="xxl" />

          <ModalTitle>Signature Request</ModalTitle>
          <Spacer y="md" />

          <Text multiline center>
            Sign the signature request <br /> in your wallet
          </Text>

          <Spacer y="lg" />
        </Container>
      </Container>
    </Modal>
  );
};
