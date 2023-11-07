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
import type { EmbeddedWalletLoginType, AuthOption } from "./types";
import { TextDivider } from "../../../components/TextDivider";
import { openGoogleSignInWindow } from "../../utils/openGoogleSignInWindow";
import { useTheme } from "@emotion/react";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const EmbeddedWalletFormUI = (props: {
  onSelect: (loginType: EmbeddedWalletLoginType) => void;
  walletConfig: WalletConfig<EmbeddedWallet>;
  authOptions: AuthOption[];
}) => {
  const twLocale = useTWLocale();
  const locale = twLocale.wallets.embeddedWallet;
  const createWalletInstance = useCreateWalletInstance();
  const setConnectionStatus = useSetConnectionStatus();
  const setConnectedWallet = useSetConnectedWallet();
  const themeObj = useTheme() as Theme;

  const enableGoogleLogin = props.authOptions.includes("google");
  const enableEmailLogin = props.authOptions.includes("email");

  // Need to trigger google login on button click to avoid popup from being blocked
  const googleLogin = async () => {
    try {
      const embeddedWallet = createWalletInstance(props.walletConfig);
      setConnectionStatus("connecting");

      const googleWindow = openGoogleSignInWindow(themeObj);
      if (!googleWindow) {
        throw new Error("Failed to open google login window");
      }
      const authResult = await embeddedWallet.authenticate({
        strategy: "google",
        openedWindow: googleWindow,
        closeOpenedWindow: (openedWindow) => {
          openedWindow.close();
        },
      });
      await embeddedWallet.connect({
        authResult,
      });
      setConnectedWallet(embeddedWallet);
    } catch (e) {
      setConnectionStatus("disconnected");
      console.error(e);
    }
  };

  return (
    <div>
      {enableGoogleLogin && (
        <>
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
        </>
      )}
      {enableGoogleLogin && enableEmailLogin && (
        <TextDivider text={twLocale.connectWallet.or} py="lg" />
      )}
      {enableEmailLogin && (
        <InputSelectionUI
          onSelect={(email) => props.onSelect({ email })}
          placeholder={locale.emailPlaceholder}
          name="email"
          type="email"
          errorMessage={(_input) => {
            const input = _input.replace(/\+/g, "");
            const emailRegex =
              /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,})$/g;
            const isValidEmail = emailRegex.test(input);
            if (!isValidEmail) {
              return locale.invalidEmail;
            }
          }}
          emptyErrorMessage={locale.emailRequired}
          submitButtonText={locale.submitEmail}
        />
      )}
    </div>
  );
};

export const EmbeddedWalletFormUIScreen: React.FC<{
  onSelect: (loginType: EmbeddedWalletLoginType) => void;
  onBack: () => void;
  modalSize: "compact" | "wide";
  walletConfig: WalletConfig<EmbeddedWallet>;
  authOptions: AuthOption[];
}> = (props) => {
  const locale = useTWLocale().wallets.embeddedWallet.emailLoginScreen;
  const isCompact = props.modalSize === "compact";
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
      <ModalHeader onBack={props.onBack} title={locale.title} />
      {isCompact ? <Spacer y="xl" /> : null}

      <Container
        expand
        flex="column"
        center="y"
        p={isCompact ? undefined : "lg"}
      >
        <EmbeddedWalletFormUI
          authOptions={props.authOptions}
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
