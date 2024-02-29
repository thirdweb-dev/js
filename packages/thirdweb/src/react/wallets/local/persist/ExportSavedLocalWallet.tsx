import {
  EyeClosedIcon,
  EyeOpenIcon,
  PinBottomIcon,
} from "@radix-ui/react-icons";
import { useTWLocale } from "../../../providers/locale-provider.js";
import type { ConnectUIProps } from "../../../types/wallets.js";
import { Spacer } from "../../../ui/components/Spacer.js";
import {
  Container,
  ModalHeader,
  Line,
  ScreenBottomContainer,
} from "../../../ui/components/basic.js";
import { Button } from "../../../ui/components/buttons.js";
import { Label } from "../../../ui/components/formElements.js";
import { FormFieldWithIconButton } from "../../../ui/components/formFields.js";
import { spacing, iconSize } from "../../../ui/design-system/index.js";
import { Text } from "../../../ui/components/text.js";
import { shortenString } from "../../../utils/addresses.js";
import { getDecryptionFunction } from "../../../../wallets/local/utils.js";
import type { LocalWalletStorageData } from "../../../../wallets/local/types.js";
import { downloadTextFile } from "../utils/downloadTextFile.js";
import { usePassword } from "../utils/usePassword.js";

/**
 * UI for exporting the saved local wallet data
 * - get password from user to decrypt the encrypted private key
 * - download the private key as a text file
 * @internal
 */
export const ExportSavedLocalWallet: React.FC<{
  onBack?: () => void;
  onExport: () => void;
  connectUIProps: ConnectUIProps;
  savedData: LocalWalletStorageData;
}> = (props) => {
  const locale = useTWLocale().wallets.localWallet;
  const isWideScreen = props.connectUIProps.screenConfig.size === "wide";

  // form state
  const {
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isWrongPassword,
    setIsWrongPassword,
  } = usePassword();

  const handleExport = async () => {
    const decryptFn = getDecryptionFunction({
      password,
    });

    try {
      const privateKey = await decryptFn(props.savedData.data);
      downloadTextFile(privateKey, "privateKey.txt");
      props.onExport();
    } catch {
      setIsWrongPassword(true);
    }
  };

  return (
    <Container fullHeight animate="fadein">
      <form
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleExport();
        }}
      >
        <Container p="lg">
          <ModalHeader
            onBack={props.onBack}
            title={locale.exportScreen.title}
          />
        </Container>
        <Line />
        <Container expand p="lg">
          <Text multiline>{locale.exportScreen.downloadMessage}</Text>
          <Spacer y="sm" />
          <Text multiline>{locale.exportScreen.decryptMessage}</Text>
          <Spacer y="xl" />
          <Label>{locale.exportScreen.walletAddress}</Label>
          <Spacer y="sm" />

          <Text>{shortenString(props.savedData.address)}</Text>

          <Spacer y="lg" />
          {/* Hidden Account Address as Username for autofill */}
          <input
            type="text"
            name="username"
            autoComplete="off"
            value={props.savedData.address}
            disabled
            style={{ display: "none" }}
          />

          {/* password */}
          <FormFieldWithIconButton
            noSave
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
            label={locale.passwordLabel}
            type={showPassword ? "text" : "password"}
            value={password}
            error={isWrongPassword ? "Wrong Password" : ""}
            dataTest="current-password"
          />
          <Spacer y="md" />
        </Container>

        <ScreenBottomContainer
          style={{
            borderTop: isWideScreen ? "none" : undefined,
          }}
        >
          <Button
            disabled={isWrongPassword}
            variant="accent"
            fullWidth
            style={{
              opacity: isWrongPassword ? 0.5 : 1,
              display: "flex",
              gap: spacing.sm,
            }}
            type="submit"
          >
            <PinBottomIcon width={iconSize.sm} height={iconSize.sm} />
            {locale.exportScreen.download}
          </Button>
        </ScreenBottomContainer>
      </form>
    </Container>
  );
};
