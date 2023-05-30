import { Spacer } from "../../../components/Spacer";
import { Button } from "../../../components/buttons";
import { FormFieldWithIconButton } from "../../../components/formFields";
import {
  ModalDescription,
  ModalTitle,
} from "../../../components/modalElements";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { WalletConfig, useWalletContext } from "@thirdweb-dev/react-core";
import { useState } from "react";
import { FormFooter, Label } from "../../../components/formElements";
import { spacing } from "../../../design-system";
import { Spinner } from "../../../components/Spinner";
import { shortenAddress } from "../../../evm/utils/addresses";
import { LocalWalletModalHeader } from "./common";
import { SecondaryText } from "../../../components/text";
import { CreateLocalWallet_Password } from "./CreateLocalWallet";
import { OverrideConfirmation } from "./overrideConfirmation";
import { ExportLocalWallet } from "./ExportLocalWallet";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import { LocalWalletConfig } from "./types";

type ReconnectLocalWalletProps = {
  onConnect: () => void;
  goBack: () => void;
  localWallet: LocalWalletConfig;
  supportedWallets: WalletConfig[];
  renderBackButton: boolean;
};

/**
 * For No-Credential scenario
 */
export const ReconnectLocalWallet: React.FC<ReconnectLocalWalletProps> = (
  props,
) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const { setConnectedWallet } = useWalletContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showBackupConfirmation, setShowBackupConfirmation] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const { localWallet, meta, walletData } = useLocalWalletInfo(
    props.localWallet,
  );

  const savedAddress = walletData
    ? walletData === "loading"
      ? ""
      : walletData.address
    : "";

  if (showExport) {
    if (!localWallet) {
      throw new Error("Invalid state");
    }

    return (
      <ExportLocalWallet
        localWallet={localWallet}
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
        meta={meta}
        onBackup={() => {
          setShowExport(true);
        }}
        onSkip={() => {
          setShowBackupConfirmation(false);
          setShowCreate(true);
        }}
        onBack={() => {
          setShowBackupConfirmation(false);
        }}
      />
    );
  }

  if (showCreate) {
    return (
      <CreateLocalWallet_Password
        renderBackButton={props.supportedWallets.length > 1}
        localWalletConf={props.localWallet}
        goBack={() => {
          setShowCreate(false);
        }}
        onConnect={props.onConnect}
      />
    );
  }

  const handleReconnect = async () => {
    if (!localWallet) {
      throw new Error("Invalid state");
    }
    setIsConnecting(true);
    try {
      await localWallet.load({
        strategy: "encryptedJson",
        password,
      });

      await localWallet.connect();
      setConnectedWallet(localWallet);

      props.onConnect();
    } catch (e) {
      setIsWrongPassword(true);
    }
    setIsConnecting(false);
  };

  return (
    <>
      <LocalWalletModalHeader
        onBack={props.goBack}
        meta={meta}
        hideBack={!props.renderBackButton}
      />
      <ModalTitle
        style={{
          textAlign: "left",
        }}
      >
        Guest Wallet
      </ModalTitle>
      <Spacer y="xs" />
      <ModalDescription>
        Connect to saved wallet on your device
      </ModalDescription>

      <Spacer y="lg" />

      <Label>Saved Wallet</Label>

      <Spacer y="sm" />

      <SecondaryText>
        {savedAddress === "" ? "Loading..." : shortenAddress(savedAddress)}
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
          value={savedAddress}
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
