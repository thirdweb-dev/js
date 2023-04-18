import { Spacer } from "../../../../components/Spacer";
import { Button } from "../../../../components/buttons";
import { FormFieldWithIconButton } from "../../../../components/formFields";
import {
  HelperLink,
  ModalDescription,
  ModalTitle,
} from "../../../../components/modalElements";
import { Theme, fontSize, iconSize } from "../../../../design-system";
import {
  EyeClosedIcon,
  EyeOpenIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { useThirdwebWallet } from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import { useDeviceWalletInfo } from "./useDeviceWalletInfo";
import { ImportDeviceWalet } from "./ImportDeviceWallet";
import styled from "@emotion/styled";
import { DeviceWalletModalHeader } from "./common";
import { Flex } from "../../../../components/basic";
import { ToolTip } from "../../../../components/Tooltip";
import { isMobile } from "../../../../evm/utils/isMobile";

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

  const [generatedAddress, setGeneratedAddress] = useState<string | null>(null);
  const isGenerated = useRef(false);

  useEffect(() => {
    if (!deviceWallet || showImportScreen) {
      return;
    }
    isGenerated.current = true;
    deviceWallet.generate().then((_address) => {
      setGeneratedAddress(_address);
    });
  }, [deviceWallet, showImportScreen]);

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

      <Flex alignItems="center" gap="xs">
        <ModalTitle>Choose a password</ModalTitle>
        {!isMobile() && (
          <ToolTip
            tip="The application can authorize any transactions on behalf of the wallet
          without any approvals. We recommend only connecting to trusted
          applications."
          >
            <InfoCircledIconSecondary
              width={iconSize.md}
              height={iconSize.md}
            />
          </ToolTip>
        )}
      </Flex>

      <Spacer y="sm" />

      <ModalDescription sm>
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
        {/* Hidden Account Address as Username */}
        <input
          type="text"
          name="username"
          autoComplete="off"
          value={generatedAddress || ""}
          disabled
          style={{ display: "none" }}
        />

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
          autocomplete="new-password"
          id="confirm-password"
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

const InfoCircledIconSecondary = styled(InfoCircledIcon)<{ theme?: Theme }>`
  color: ${(p) => p.theme.text.secondary};
`;
