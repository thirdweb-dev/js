import { Button } from "../../../components/buttons";
import { SecondaryText } from "../../../components/text";
import { Spacer } from "../../../components/Spacer";
import { ModalTitle } from "../../../components/modalElements";
import { LocalWalletModalHeader } from "./common";
import { FormFooter } from "../../../components/formElements";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { ScreenContainer } from "../../../components/basic";

export const OverrideConfirmation: React.FC<{
  onBackup: () => void;
  onBack: () => void;
  meta: WalletConfig["meta"];
}> = (props) => {
  return (
    <ScreenContainer>
      <LocalWalletModalHeader onBack={props.onBack} meta={props.meta} />
      <ModalTitle>Backup your wallet</ModalTitle>

      <Spacer y="md" />
      <div
        style={{
          lineHeight: 1.5,
        }}
      >
        <SecondaryText>
          Your current wallet will be deleted if you create a new wallet. Backup
          wallet to your device before creating a new wallet
        </SecondaryText>

        <Spacer y="xl" />

        <FormFooter>
          <Button variant="inverted" onClick={props.onBackup}>
            Backup wallet
          </Button>
        </FormFooter>
      </div>
    </ScreenContainer>
  );
};
