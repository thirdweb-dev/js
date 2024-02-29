import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useTWLocale } from "../../../../providers/locale-provider.js";
import type { ConnectUIProps } from "../../../../types/wallets.js";
import { Spacer } from "../../../../ui/components/Spacer.js";
import { Spinner } from "../../../../ui/components/Spinner.js";
import {
  Container,
  ModalHeader,
  Line,
} from "../../../../ui/components/basic.js";
import { Button } from "../../../../ui/components/buttons.js";
import { FormFieldWithIconButton } from "../../../../ui/components/formFields.js";
import { spacing } from "../../../../ui/design-system/index.js";
import { Text } from "../../../../ui/components/text.js";
import { usePassword } from "../../utils/usePassword.js";
import type { LocalWallet } from "../../../../../wallets/local/index.js";

/**
 * - Create random local wallet
 * - Get a password from the user
 * - Encrypt private key with password and save it to local storage
 * @internal
 */
export const LocalWallet_Persist_Create: React.FC<{
  connectUIProps: ConnectUIProps;
  persist: boolean;
  onBack?: () => void;
  onShowImportScreen: () => void;
}> = (props) => {
  const locale = useTWLocale().wallets.localWallet;
  const [isConnecting, setIsConnecting] = useState(false);
  const { done, createInstance, chain } = props.connectUIProps.connection;

  // form state
  const {
    password,
    setPassword,
    showPassword,
    setShowPassword,
    confirmPassword,
    setConfirmPassword,
    passwordMismatch,
  } = usePassword();

  async function handleConnect() {
    setIsConnecting(true);

    const wallet = createInstance() as LocalWallet;
    await wallet.generate();
    await wallet.connect({ chain });
    await wallet.save({
      strategy: "privateKey",
      encryption: {
        password,
      },
    });

    setIsConnecting(false);
    done(wallet);
  }

  return (
    <Container fullHeight flex="column" animate="fadein">
      <Container p="lg">
        <ModalHeader
          onBack={props.onBack}
          title={props.connectUIProps.walletConfig.metadata.name}
        />
      </Container>

      <Line />
      <Container expand p="lg">
        <Text multiline>{locale.createScreen.instruction}</Text>
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
            label={locale.passwordLabel}
            type={showPassword ? "text" : "password"}
            value={password}
            dataTest="new-password"
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
            label={locale.confirmPasswordLabel}
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            error={passwordMismatch ? "Passwords don't match" : ""}
            dataTest="confirm-password"
            noErrorShift
          />

          <Spacer y="md" />

          {/* Create */}
          <Button
            variant="accent"
            type="submit"
            disabled={isConnecting || passwordMismatch}
            fullWidth
            style={{
              gap: spacing.xs,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            data-test="create-new-wallet-button"
          >
            {isConnecting
              ? locale.createScreen.connecting
              : locale.createScreen.createNewWallet}
            {isConnecting && <Spinner size="sm" color="accentButtonText" />}
          </Button>
        </form>
      </Container>

      <Spacer y="sm" />
      <Line />
      <Container p="lg">
        {/* Import */}
        <Button
          fullWidth
          type="button"
          variant="link"
          onClick={props.onShowImportScreen}
          style={{
            display: "flex",
            gap: spacing.sm,
            alignItems: "center",
          }}
        >
          {locale.createScreen.importWallet}
        </Button>
      </Container>
    </Container>
  );
};
