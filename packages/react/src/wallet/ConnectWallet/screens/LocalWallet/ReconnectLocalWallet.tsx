import { Spacer } from "../../../../components/Spacer";
import { Button } from "../../../../components/buttons";
import { FormFieldWithIconButton } from "../../../../components/formFields";
import {
  ModalDescription,
  ModalTitle,
} from "../../../../components/modalElements";
import {
  ChevronRightIcon,
  EyeClosedIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import { useThirdwebWallet } from "@thirdweb-dev/react-core";
import { useState } from "react";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import { FormFooter, Label } from "../../../../components/formElements";
import styled from "@emotion/styled";
import { Theme, fontSize, spacing } from "../../../../design-system";
import { Spinner } from "../../../../components/Spinner";
import { shortenAddress } from "../../../../evm/utils/addresses";
import { LocalWalletModalHeader } from "./common";
import { UserCredentials } from "@thirdweb-dev/react-core/dist/declarations/src";
import { SecondaryText } from "../../../../components/text";
import { CreateLocalWallet_NoCreds } from "./SetupLocalWallet_NoCredentials";
import { OverrideConfirmation } from "./overrideConfirmation";
import { ExportLocalWallet } from "./ExportLocalWallet";
import { CreateLocalWallet_Creds } from "./SetupLocalWallet_Credentials";

type ReconnectLocalWalletProps = {
  onConnected: () => void;
  onBack: () => void;
};

/**
 * For No-Credential scenario
 */
export const ReconnectLocalWalletNoCredentials: React.FC<
  ReconnectLocalWalletProps
> = (props) => {
  const { walletData, localWallet } = useLocalWalletInfo();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const thirdwebWalletContext = useThirdwebWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showBackupConfirmation, setShowBackupConfirmation] = useState(false);
  const [showExport, setShowExport] = useState(false);

  if (showExport) {
    return (
      <ExportLocalWallet
        onBack={() => {
          setShowExport(false);
        }}
        onExport={() => {
          setShowExport(false);
          setShowBackupConfirmation(false);
          setShowCreate(true);
        }}
      />
    );
  }

  if (showBackupConfirmation) {
    return (
      <OverrideConfirmation
        onBackup={() => {
          setShowExport(true);
        }}
        onBack={() => {
          setShowBackupConfirmation(false);
        }}
      />
    );
  }

  if (showCreate) {
    return (
      <CreateLocalWallet_NoCreds
        onBack={() => {
          setShowCreate(false);
        }}
        onConnected={props.onConnected}
      />
    );
  }

  const handleReconnect = async () => {
    if (!localWallet || !thirdwebWalletContext) {
      throw new Error("Invalid state");
    }
    setIsConnecting(true);
    try {
      await localWallet.load({
        strategy: "encryptedJson",
        password,
      });

      await localWallet.connect();
      thirdwebWalletContext.handleWalletConnect(localWallet);

      props.onConnected();
    } catch (e) {
      setIsWrongPassword(true);
    }
    setIsConnecting(false);
  };

  return (
    <>
      <LocalWalletModalHeader onBack={props.onBack} />
      <ModalTitle
        style={{
          textAlign: "left",
        }}
      >
        Local Wallet
      </ModalTitle>
      <Spacer y="xs" />
      <ModalDescription>
        Connect to saved wallet on your device
      </ModalDescription>

      <Spacer y="lg" />

      <Label>Saved Wallet</Label>

      <Spacer y="sm" />

      <SecondaryText>
        {shortenAddress(walletData?.address || "") || "Fetching..."}
      </SecondaryText>

      <Spacer y="lg" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleReconnect();
        }}
      >
        {/* Hidden Account Address as Username */}
        <input
          type="text"
          name="username"
          autoComplete="off"
          value={walletData?.address || ""}
          disabled
          style={{ display: "none" }}
        />

        {/* Password */}
        <FormFieldWithIconButton
          required
          name="current-password"
          autocomplete="current-password"
          id="current-password"
          onChange={(value) => {
            setPassword(value);
            setIsWrongPassword(false);
          }}
          right={{
            onClick: () => setShowPassword(!showPassword),
            icon: showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />,
          }}
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          error={isWrongPassword ? "Wrong Password" : ""}
        />

        <Spacer y="lg" />

        {/* Connect Button */}
        <FormFooter>
          <Button
            variant="inverted"
            type="submit"
            style={{
              display: "flex",
              gap: spacing.sm,
            }}
          >
            Connect
            {isConnecting && <Spinner size="sm" color="inverted" />}
          </Button>
        </FormFooter>
      </form>

      <Spacer y="xxl" />

      <Button
        variant="link"
        style={{
          textAlign: "center",
          width: "100%",
          padding: "2px",
        }}
        onClick={() => {
          setShowBackupConfirmation(true);
        }}
      >
        Create a new wallet
      </Button>
    </>
  );
};

export const ReconnectLocalWalletCredentials: React.FC<
  ReconnectLocalWalletProps & {
    creds: UserCredentials;
  }
> = (props) => {
  const { localWallet } = useLocalWalletInfo();
  const thirdwebWalletContext = useThirdwebWallet();
  const [showBackupConfirmation, setShowBackupConfirmation] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  if (showExport) {
    return (
      <ExportLocalWallet
        onBack={() => {
          setShowExport(false);
        }}
        onExport={() => {
          setShowExport(false);
          setShowBackupConfirmation(false);
          setShowCreate(true);
        }}
      />
    );
  }

  if (showBackupConfirmation) {
    return (
      <OverrideConfirmation
        onBackup={() => {
          setShowExport(true);
        }}
        onBack={() => {
          setShowBackupConfirmation(false);
        }}
      />
    );
  }

  if (showCreate) {
    return (
      <CreateLocalWallet_Creds
        savedCreds={props.creds}
        onBack={() => {
          setShowCreate(false);
        }}
        onConnected={props.onConnected}
      />
    );
  }

  const handleConnect = async () => {
    if (!localWallet || !thirdwebWalletContext) {
      throw new Error("Invalid state");
    }

    await localWallet.import({
      privateKey: props.creds.password,
      encryption: false,
    });

    await localWallet.connect();
    thirdwebWalletContext.handleWalletConnect(localWallet);
    props.onConnected();
  };

  return (
    <>
      <LocalWalletModalHeader onBack={props.onBack} />
      <ModalTitle
        style={{
          textAlign: "left",
        }}
      >
        Local Wallet
      </ModalTitle>
      <Spacer y="xs" />
      <ModalDescription>
        Connect to saved wallet on your device
      </ModalDescription>

      <Spacer y="lg" />

      <Label>Saved Wallet</Label>

      <Spacer y="sm" />

      <AddressButton variant="secondary" onClick={handleConnect}>
        {shortenAddress(props.creds.id || "") || "Fetching..."}
        <ChevronRightIcon
          style={{
            marginLeft: "auto",
          }}
        />
      </AddressButton>

      <Spacer y="xl" />

      <Button
        variant="link"
        style={{
          textAlign: "center",
          width: "100%",
          padding: "2px",
        }}
        onClick={() => {
          setShowBackupConfirmation(true);
        }}
      >
        Create a new wallet
      </Button>
    </>
  );
};

const AddressButton = styled(Button)<{ theme?: Theme }>`
  font-size: ${fontSize.md};
  margin: 0;
  width: 100%;
  justify-content: flex-start;
  &:hover {
    background-color: ${(props) => props.theme.bg.elevatedHover};
  }
`;
