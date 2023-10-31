import styled from "@emotion/styled";
import {
  WalletConfig,
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
} from "@thirdweb-dev/react-core";
import { EmbeddedWallet } from "@thirdweb-dev/wallets";
import { Spacer } from "../../../components/Spacer";
import { Container, ModalHeader } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { Theme, iconSize, spacing } from "../../../design-system";
import { GoogleIcon } from "../../ConnectWallet/icons/GoogleIcon";
import { InputSelectionUI } from "../InputSelectionUI";
import type { EmbeddedWalletLoginType } from "./types";
import { TextDivider } from "../../../components/TextDivider";
import { openGoogleSignInWindow } from "../../utils/openGoogleSignInWindow";
import { useTheme } from "@emotion/react";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const EmbeddedWalletFormUI = (props: {
  onSelect: (loginType: EmbeddedWalletLoginType) => void;
  walletConfig: WalletConfig<EmbeddedWallet>;
}) => {
  const locale = useTWLocale().wallets.embeddedWallet;
  const createWalletInstance = useCreateWalletInstance();
  const setConnectionStatus = useSetConnectionStatus();
  const setConnectedWallet = useSetConnectedWallet();
  const themeObj = useTheme() as Theme;

  // Need to trigger google login on button click to avoid popup from being blocked
  const googleLogin = async () => {
    try {
      const embeddedWallet = createWalletInstance(props.walletConfig);
      setConnectionStatus("connecting");

      const googleWindow = openGoogleSignInWindow(themeObj);
      if (!googleWindow) {
        throw new Error("Failed to open google login window");
      }
      await embeddedWallet.connect({
        loginType: "headless_google_oauth",
        openedWindow: googleWindow,
        closeOpenedWindow: (openedWindow) => {
          openedWindow.close();
        },
      });

      setConnectedWallet(embeddedWallet);
    } catch (e) {
      setConnectionStatus("disconnected");
      console.error(e);
    }
  };

  return (
    <div>
      <SocialButton
        variant="secondary"
        fullWidth
        onClick={() => {
          googleLogin();
          props.onSelect({ google: true });
        }}
      >
        <GoogleIcon size={iconSize.md} />
        {locale.signInWithGoogle}
      </SocialButton>
      <TextDivider text="OR" py="lg" />
      <InputSelectionUI
        submitButtonText={locale.submitEmail}
        onSelect={(email) => props.onSelect({ email })}
        placeholder={locale.emailPlaceholder}
        name="email"
        type="email"
        errorMessage={(_input) => {
          const input = _input.replace(/\+/g, "");
          const emailRegex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,})$/g;
          const isValidEmail = emailRegex.test(input);
          if (!isValidEmail) {
            return locale.invalidEmail;
          }
        }}
        emptyErrorMessage={locale.emailRequired}
      />
    </div>
  );
};

export const EmbeddedWalletFormUIScreen: React.FC<{
  onSelect: (loginType: EmbeddedWalletLoginType) => void;
  onBack: () => void;
  modalSize: "compact" | "wide";
  walletConfig: WalletConfig<EmbeddedWallet>;
}> = (props) => {
  const isCompact = props.modalSize === "compact";
  const locale = useTWLocale().wallets.embeddedWallet;
  return (
    <Container
      fullHeight
      flex="column"
      p="lg"
      animate="fadein"
      style={{
        minHeight: "250px",
      }}
    >
      <ModalHeader onBack={props.onBack} title={locale.signIn} />
      {isCompact ? <Spacer y="xl" /> : null}

      <Container
        expand
        flex="column"
        center="y"
        p={isCompact ? undefined : "lg"}
      >
        <EmbeddedWalletFormUI
          walletConfig={props.walletConfig}
          onSelect={props.onSelect}
        />
      </Container>
    </Container>
  );
};

const SocialButton = /* @__PURE__ */ styled(Button)<{ theme?: Theme }>`
  display: flex;
  justify-content: center;
  gap: ${spacing.sm};
`;
