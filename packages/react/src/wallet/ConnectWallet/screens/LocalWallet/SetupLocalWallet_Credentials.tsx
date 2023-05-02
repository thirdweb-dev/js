import { Spacer } from "../../../../components/Spacer";
import { Button } from "../../../../components/buttons";
import {
  ModalDescription,
  ModalTitle,
} from "../../../../components/modalElements";
import { useThirdwebWallet } from "@thirdweb-dev/react-core";
import { useState } from "react";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import { ImportLocalWallet } from "./ImportLocalWallet";
import { LocalWalletModalHeader } from "./common";
import { ExportLocalWallet } from "./ExportLocalWallet";
import { UserCredentials, saveCredentials } from "./credentials";
import { TextDivider } from "../../../../components/TextDivider";

export const CreateLocalWallet_Creds: React.FC<{
  onConnected: () => void;
  onBack: () => void;
  savedCreds: UserCredentials | null;
}> = (props) => {
  const { localWallet } = useLocalWalletInfo();
  const thirdwebWalletContext = useThirdwebWallet();
  const [showImportScreen, setShowImportScreen] = useState(false);
  const [showExport, setShowExport] = useState(false);

  if (showImportScreen) {
    return (
      <ImportLocalWallet
        onConnected={props.onConnected}
        onBack={() => {
          setShowImportScreen(false);
        }}
      />
    );
  }

  if (showExport) {
    return (
      <ExportLocalWallet
        onBack={() => {
          setShowExport(false);
        }}
        onExport={() => {
          setShowExport(false);
        }}
      />
    );
  }

  const createNewWallet = async () => {
    if (!localWallet) {
      throw new Error("Invalid state");
    }

    const address = await localWallet.generate();
    localWallet.connect();

    const privateKey = await localWallet.export({
      strategy: "privateKey",
      encryption: false,
    });

    await saveCredentials({
      id: address,
      name: "Wallet",
      password: privateKey,
    });

    thirdwebWalletContext.handleWalletConnect(localWallet);
    props.onConnected();
  };

  return (
    <>
      <LocalWalletModalHeader onBack={props.onBack} />
      <ModalTitle>Guest Wallet</ModalTitle>

      <Spacer y="md" />

      <ModalDescription>
        Create a new wallet or import an existing one.
      </ModalDescription>

      <Spacer y="lg" />

      <Button
        variant="inverted"
        onClick={createNewWallet}
        style={{
          width: "100%",
        }}
      >
        Create new wallet
      </Button>

      <Spacer y="xl" />

      <TextDivider>
        <span>OR</span>
      </TextDivider>

      <Spacer y="lg" />

      <Button
        variant="link"
        onClick={() => {
          setShowImportScreen(true);
        }}
        style={{
          width: "100%",
          padding: 0,
        }}
      >
        Import wallet
      </Button>
    </>
  );
};
