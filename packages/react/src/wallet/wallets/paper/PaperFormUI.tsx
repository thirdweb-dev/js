import styled from "@emotion/styled";
import {
  WalletConfig,
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
} from "@thirdweb-dev/react-core";
import { PaperWallet } from "@thirdweb-dev/wallets";
import { Spacer } from "../../../components/Spacer";
import { Container, ModalHeader } from "../../../components/basic";
import { Button } from "../../../components/buttons";
import { Theme, iconSize, spacing } from "../../../design-system";
import { GoogleIcon } from "../../ConnectWallet/icons/GoogleIcon";
import { InputSelectionUI } from "../InputSelectionUI";
import { PaperLoginType } from "./types";

export const PaperFormUI = (props: {
  onSelect: (loginType: PaperLoginType) => void;
  showOrSeparator?: boolean;
  googleLoginSupported: boolean;
  walletConfig: WalletConfig<PaperWallet>;
}) => {
  const createWalletInstance = useCreateWalletInstance();
  const setConnectionStatus = useSetConnectionStatus();
  const setConnectedWallet = useSetConnectedWallet();

  // Need to trigger google login on button click to avoid popup from being blocked
  const googleLogin = async () => {
    try {
      const paperWallet = createWalletInstance(props.walletConfig);
      setConnectionStatus("connecting");
      const googleWindow = window.open("", "Login", "width=350, height=500");
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
            <GoogleIcon size={iconSize.md} />
            Sign in with Google
          </SocialButton>

          <Spacer y="lg" />
        </>
      )}

      <InputSelectionUI
        onSelect={(email) => props.onSelect({ email })}
        placeholder="Enter your email address"
        name="email"
        type="email"
        errorMessage={(_input) => {
          const input = _input.replace(/\+/g, "");
          const emailRegex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,})$/g;
          const isValidEmail = emailRegex.test(input);
          if (!isValidEmail) {
            return "Invalid email address";
          }
        }}
        emptyErrorMessage="email address is required"
        showOrSeparator={props.showOrSeparator}
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
}> = (props) => {
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
      <ModalHeader onBack={props.onBack} title="Sign in" />
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
          showOrSeparator={false}
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
