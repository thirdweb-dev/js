import { Button } from "../../../components/buttons";
import { SecondaryText } from "../../../components/text";
import { Spacer } from "../../../components/Spacer";
import { ModalTitle } from "../../../components/modalElements";
import { LocalWalletModalHeader } from "./common";
import { FormFooter } from "../../../components/formElements";
import { ConfiguredWallet } from "@thirdweb-dev/react-core";

export const OverrideConfirmation: React.FC<{
  onBackup: () => void;
  onBack: () => void;
  onSkip: () => void;
  meta: ConfiguredWallet["meta"];
}> = (props) => {
  return (
    <>
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
          <Button variant="danger" onClick={props.onSkip}>
            Skip
          </Button>
        </FormFooter>
      </div>
    </>
  );
};
