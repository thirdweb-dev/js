import { Spacer } from "../../../../components/Spacer";
import { Button } from "../../../../components/buttons";
import { FormFieldWithIconButton } from "../../../../components/formFields";
import {
  HelperLink,
  ModalDescription,
  ModalTitle,
} from "../../../../components/modalElements";
import { Theme, fontSize } from "../../../../design-system";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useThirdwebWallet } from "@thirdweb-dev/react-core";
import { useState } from "react";
import { useDeviceWalletInfo } from "./useDeviceWalletInfo";
import { ImportDeviceWalet } from "./ImportDeviceWallet";
import styled from "@emotion/styled";
import { DeviceWalletModalHeader } from "./common";

export const CreateDeviceWallet: React.FC<{
  onConnected: () => void;
  onBack: () => void;
}> = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordMismatch = confirmPassword && password !== confirmPassword;
  const { deviceWallet } = useDeviceWalletInfo();
  const thirdwebWalletContext = useThirdwebWallet();
  const [showImportScreen, setShowImportScreen] = useState(false);

  if (showImportScreen) {
    return (
      <ImportDeviceWalet
        onConnected={props.onConnected}
        onBack={() => {
          setShowImportScreen(false);
        }}
      />
    );
  }

  const handleConnect = async () => {
    if (passwordMismatch || !deviceWallet || !thirdwebWalletContext) {
      throw new Error("Invalid state");
    }

    await deviceWallet.generate();
    deviceWallet.connect();

    await deviceWallet.save({
      strategy: "encryptedJson",
      password,
    });

    thirdwebWalletContext.handleWalletConnect(deviceWallet);
    props.onConnected();
  };

  return (
    <>
      <DeviceWalletModalHeader onBack={props.onBack} />

      <ModalTitle>Choose a password</ModalTitle>
      <Spacer y="sm" />

      <ModalDescription
        style={{
          fontSize: fontSize.sm,
        }}
      >
        Enter a password and we{`'`}ll create a wallet for you. You{`'`}ll be
        able to access and export this wallet with the same password.
      </ModalDescription>
      <Spacer y="lg" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleConnect();
        }}
      >
        {/* Password */}
        <FormFieldWithIconButton
          name="password"
          required
          autocomplete="new-password"
          id="new-password"
          onChange={(value) => setPassword(value)}
          right={{
            icon: showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />,
            onClick: () => setShowPassword(!showPassword),
          }}
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
        />

        <Spacer y="lg" />

        {/* Confirm Password */}
        <FormFieldWithIconButton
          name="confirm-password"
          required
          autocomplete="current-password"
          id="current-password"
          onChange={(value) => setConfirmPassword(value)}
          right={{
            icon: showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />,
            onClick: () => setShowPassword(!showPassword),
          }}
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          error={passwordMismatch ? "Passwords don't match" : ""}
        />

        <Spacer y="xl" />

        <Button
          variant="inverted"
          type="submit"
          style={{
            width: "100%",
          }}
        >
          Create Wallet
        </Button>
      </form>

      <Spacer y="xxl" />

      <TextDivider>
        <span>OR</span>
      </TextDivider>

      <Spacer y="lg" />

      <HelperLink
        as="button"
        onClick={() => {
          setShowImportScreen(true);
        }}
        style={{
          textAlign: "center",
          width: "100%",
        }}
      >
        Import a JSON wallet
      </HelperLink>
    </>
  );
};

const TextDivider = styled.div<{ theme?: Theme }>`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.text.secondary};
  font-size: ${fontSize.sm};
  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid ${(p) => p.theme.bg.highlighted};
  }

  span {
    margin: 0 1rem;
  }
`;
