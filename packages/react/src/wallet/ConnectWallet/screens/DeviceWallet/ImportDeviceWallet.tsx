import { Spacer } from "../../../../components/Spacer";
import { Button } from "../../../../components/buttons";
import { FormFieldWithIconButton } from "../../../../components/formFields";
import {
  ModalDescription,
  ModalTitle,
} from "../../../../components/modalElements";
import { Theme, iconSize } from "../../../../design-system";
import {
  EyeClosedIcon,
  EyeOpenIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { useThirdwebWallet } from "@thirdweb-dev/react-core";
import { useState } from "react";
import { DragNDrop } from "../../../../components/DragNDrop";
import { useDeviceWalletInfo } from "./useDeviceWalletInfo";
import { FormFooter } from "../../../../components/formElements";
import styled from "@emotion/styled";
import { Flex } from "../../../../components/basic";
import { DeviceWalletModalHeader } from "./common";
import { isMobile } from "../../../../evm/utils/isMobile";

export const ImportDeviceWalet: React.FC<{
  onConnected: () => void;
  onBack: () => void;
}> = (props) => {
  const [jsonString, setJsonString] = useState<string | undefined>();
  const { deviceWallet } = useDeviceWalletInfo();
  const [password, setPassword] = useState("");
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const thirdwebWalletContext = useThirdwebWallet();

  const handleImport = async () => {
    if (!deviceWallet || !jsonString || !thirdwebWalletContext) {
      throw new Error("Invalid state");
    }

    try {
      await deviceWallet.import({
        encryptedJson: jsonString,
        password,
      });

      await deviceWallet.save({
        strategy: "encryptedJson",
        password,
      });

      thirdwebWalletContext.handleWalletConnect(deviceWallet);
      props.onConnected();
    } catch (e) {
      setIsWrongPassword(true);
      return;
    }
  };

  return (
    <>
      <DeviceWalletModalHeader onBack={props.onBack} />
      <ModalTitle
        style={{
          textAlign: "left",
        }}
      >
        Import JSON Wallet
      </ModalTitle>
      <Spacer y="md" />

      <Flex alignItems="center" gap="sm">
        {!isMobile() && (
          <WarningIcon
            width={iconSize.md}
            height={iconSize.md}
            style={{
              flexShrink: 0,
            }}
          />
        )}
        <ModalDescription sm>
          The application can authorize any transactions on behalf of the wallet
          without any approvals. We recommend only connecting to trusted
          applications.
        </ModalDescription>
      </Flex>

      <Spacer y="md" />

      <DragNDrop
        extension="JSON"
        accept="application/json"
        onUpload={(file) => {
          const reader = new FileReader();
          reader.onload = (event) =>
            setJsonString(event.target?.result as string);
          reader.readAsText(file, "utf-8");
        }}
      />

      <Spacer y="lg" />

      {/* Password */}
      {jsonString && (
        <>
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
        </>
      )}

      <FormFooter>
        <Button
          variant="inverted"
          disabled={!jsonString}
          style={{
            minWidth: "110px",
            opacity: jsonString ? 1 : 0.5,
          }}
          onClick={handleImport}
        >
          Import
        </Button>
      </FormFooter>
    </>
  );
};

const WarningIcon = styled(InfoCircledIcon)<{ theme?: Theme }>`
  color: ${(p) => p.theme.icon.danger};
`;
