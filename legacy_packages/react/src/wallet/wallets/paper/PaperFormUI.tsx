import styled from "@emotion/styled";
import { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
import { PaperWallet } from "@thirdweb-dev/wallets";
import { Spacer } from "../../../components/Spacer";
import { TextDivider } from "../../../components/TextDivider";
import { Container, ModalHeader } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { iconSize, spacing } from "../../../design-system";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { openOauthSignInWindow } from "../../utils/openOauthSignInWindow";
import { InputSelectionUI } from "../InputSelectionUI";
import { PaperLoginType } from "./types";
import { Img } from "../../../components/Img";
import { googleIconUri } from "../../ConnectWallet/icons/socialLogins";
import { useCustomTheme } from "../../../design-system/CustomThemeProvider";
import { useContext } from "react";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";
import { TOS } from "../../ConnectWallet/Modal/TOS";
import { useScreenContext } from "../../ConnectWallet/Modal/screen";
import { PoweredByThirdweb } from "../../ConnectWallet/PoweredByTW";

export const PaperFormUI = (props: {
  onSelect: (loginType: PaperLoginType) => void;
  googleLoginSupported: boolean;
  walletConfig: WalletConfig<PaperWallet>;
  setConnectionStatus: ConnectUIProps<PaperWallet>["setConnectionStatus"];
  setConnectedWallet: ConnectUIProps<PaperWallet>["setConnectedWallet"];
  createWalletInstance: ConnectUIProps<PaperWallet>["createWalletInstance"];
}) => {
  const cwLocale = useTWLocale().connectWallet;
  const locale = useTWLocale().wallets.paperWallet;
  const { createWalletInstance, setConnectionStatus, setConnectedWallet } =
    props;

  const themeObj = useCustomTheme();

  // Need to trigger google login on button click to avoid popup from being blocked
  const googleLogin = async () => {
    try {
      const paperWallet = createWalletInstance();
      setConnectionStatus("connecting");
      const googleWindow = openOauthSignInWindow("google", themeObj);
      if (!googleWindow) {
        throw new Error("Failed to open google login window");
      }
      await paperWallet.connect({
        googleLogin: {
          openedWindow: googleWindow,
          closeOpenedWindow: (openedWindow) => {
            openedWindow.close();
          },
        },
      });
      setConnectedWallet(paperWallet);
    } catch (e) {
      setConnectionStatus("disconnected");
      console.error(e);
    }
  };

  return (
    <div>
      {props.googleLoginSupported && (
        <>
          <SocialButton
            variant="secondary"
            fullWidth
            onClick={() => {
              googleLogin();
              props.onSelect({ google: true });
            }}
          >
            <Img src={googleIconUri} width={iconSize.md} height={iconSize.md} />
            {locale.signInWithGoogle}
          </SocialButton>

          <TextDivider text={cwLocale.or} py="lg" />
        </>
      )}

      <InputSelectionUI
        onSelect={(email) => props.onSelect({ email })}
        placeholder={locale.emailPlaceholder}
        name="email"
        type="email"
        errorMessage={(_input) => {
          const input = _input.replace(/\+/g, "").toLowerCase();
          const emailRegex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,})$/g;
          const isValidEmail = emailRegex.test(input);
          if (!isValidEmail) {
            return locale.invalidEmail;
          }
        }}
        emptyErrorMessage={locale.emailRequired}
        submitButtonText={locale.submitEmail}
      />
    </div>
  );
};

export const PaperFormUIScreen: React.FC<{
  onSelect: (loginType: PaperLoginType) => void;
  onBack: () => void;
  modalSize: "compact" | "wide";
  googleLoginSupported: boolean;
  walletConfig: WalletConfig<PaperWallet>;
  setConnectionStatus: ConnectUIProps<PaperWallet>["setConnectionStatus"];
  setConnectedWallet: ConnectUIProps<PaperWallet>["setConnectedWallet"];
  createWalletInstance: ConnectUIProps<PaperWallet>["createWalletInstance"];
}> = (props) => {
  const isCompact = props.modalSize === "compact";
  const locale = useTWLocale().wallets.paperWallet;
  const { initialScreen, screen } = useScreenContext();
  const modalConfig = useContext(ModalConfigCtx);
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
      <ModalHeader
        onBack={
          screen === props.walletConfig && initialScreen === props.walletConfig
            ? undefined
            : props.onBack
        }
        title={locale.signIn}
      />
      {isCompact ? <Spacer y="xl" /> : null}

      <Container
        expand
        flex="column"
        center="y"
        p={isCompact ? undefined : "lg"}
      >
        <PaperFormUI
          walletConfig={props.walletConfig}
          googleLoginSupported={props.googleLoginSupported}
          onSelect={props.onSelect}
          setConnectionStatus={props.setConnectionStatus}
          setConnectedWallet={props.setConnectedWallet}
          createWalletInstance={props.createWalletInstance}
        />
      </Container>

      {isCompact &&
        (modalConfig.showThirdwebBranding !== false ||
          modalConfig.termsOfServiceUrl ||
          modalConfig.privacyPolicyUrl) && <Spacer y="xl" />}

      <Container flex="column" gap="lg">
        <TOS
          termsOfServiceUrl={modalConfig.termsOfServiceUrl}
          privacyPolicyUrl={modalConfig.privacyPolicyUrl}
        />

        {modalConfig.showThirdwebBranding !== false && <PoweredByThirdweb />}
      </Container>
    </Container>
  );
};

const SocialButton = /* @__PURE__ */ styled(Button)({
  display: "flex",
  justifyContent: "center",
  gap: spacing.sm,
});
