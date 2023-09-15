import { Button } from "../../../components/buttons";
import { Text } from "../../../components/text";
import { Spacer } from "../../../components/Spacer";
import { FormFooter } from "../../../components/formElements";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { Container, ModalHeader } from "../../../components/basic";

export const OverrideConfirmation: React.FC<{
  onBackup: () => void;
  onBack: () => void;
  meta: WalletConfig["meta"];
}> = (props) => {
  return (
    <Container p="lg">
      <ModalHeader onBack={props.onBack} title="Warning" />
      <Spacer y="xl" />

      <Container>
        <Text multiline>
          Your current wallet will be deleted if you create a new wallet. Backup
          wallet to your device before creating a new wallet
        </Text>

        <Spacer y="xl" />

        <FormFooter>
          <Button variant="accent" fullWidth onClick={props.onBackup}>
            Backup wallet
          </Button>
        </FormFooter>
      </Container>
    </Container>
  );
};
