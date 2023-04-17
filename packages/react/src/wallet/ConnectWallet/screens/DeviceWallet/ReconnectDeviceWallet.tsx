import { Spacer } from "../../../../components/Spacer";
import { Button, IconButton } from "../../../../components/buttons";
import { FormFieldWithIconButton } from "../../../../components/formFields";
import {
  ModalDescription,
  ModalTitle,
} from "../../../../components/modalElements";
import {
  EyeClosedIcon,
  EyeOpenIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { useThirdwebWallet } from "@thirdweb-dev/react-core";
import { useState } from "react";
import { useDeviceWalletInfo } from "./useDeviceWalletInfo";
import { FormFooter, Label } from "../../../../components/formElements";
import styled from "@emotion/styled";
import { Theme, fontSize, iconSize, spacing } from "../../../../design-system";
import { Flex } from "../../../../components/basic";
import { ToolTip } from "../../../../components/Tooltip";
import { Spinner } from "../../../../components/Spinner";
import { shortenAddress } from "../../../../evm/utils/addresses";
import { RemoveWallet } from "./RemoveWallet";
import { DeviceWalletModalHeader } from "./common";
import { isMobile } from "../../../../evm/utils/isMobile";

export const ReconnectDeviceWallet: React.FC<{
  onConnected: () => void;
  onRemove: () => void;
  onBack: () => void;
}> = (props) => {
  const { walletData, deviceWallet } = useDeviceWalletInfo();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const thirdwebWalletContext = useThirdwebWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);

  const handleRemove = async () => {
    if (!deviceWallet) {
      throw new Error("Invalid state");
    }
    await deviceWallet?.deleteSaved();
    props.onRemove();
  };

  if (showRemoveConfirmation) {
    return (
      <RemoveWallet
        onRemove={handleRemove}
        address={shortenAddress(walletData?.address || "")}
        onBack={() => {
          setShowRemoveConfirmation(false);
        }}
      />
    );
  }

  const handleReconnect = async () => {
    if (!deviceWallet || !thirdwebWalletContext) {
      throw new Error("Invalid state");
    }
    setIsConnecting(true);
    try {
      await deviceWallet.load({
        strategy: "encryptedJson",
        password,
      });

      await deviceWallet.connect();
      thirdwebWalletContext.handleWalletConnect(deviceWallet);

      props.onConnected();
    } catch (e) {
      setIsWrongPassword(true);
    }
    setIsConnecting(false);
  };

  return (
    <>
      <DeviceWalletModalHeader onBack={props.onBack} />
      <ModalTitle>Device Wallet</ModalTitle>
      <Spacer y="xs" />
      <ModalDescription>
        Connect to saved wallet on your device
      </ModalDescription>
      <Spacer y="xl" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleReconnect();
        }}
      >
        <Flex alignItems="center" gap="xs">
          <Label>Saved Wallet</Label>
          <ToolTip tip="Remove Wallet" sideOffset={7}>
            <IconButton
              variant="secondary"
              type="button"
              onClick={() => {
                setShowRemoveConfirmation(true);
              }}
            >
              <RedCircle width={iconSize.sm} height={iconSize.sm} />
            </IconButton>
          </ToolTip>
        </Flex>
        <Spacer y="sm" />

        <SavedWalletAddress>
          {(isMobile()
            ? shortenAddress(walletData?.address || "")
            : walletData?.address) || "Fetching..."}
        </SavedWalletAddress>

        <Spacer y="lg" />

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

        <Spacer y="xl" />

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
    </>
  );
};

const SavedWalletAddress = styled.p<{ theme?: Theme }>`
  font-size: ${fontSize.md};
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
`;

const RedCircle = styled(CrossCircledIcon)<{ theme?: Theme }>`
  color: ${(props) => props.theme.input.errorRing};
`;
