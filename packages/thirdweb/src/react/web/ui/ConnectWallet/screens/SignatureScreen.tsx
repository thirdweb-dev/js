import { keyframes } from "@emotion/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { useSiweAuth } from "../../../../core/hooks/auth/useSiweAuth.js";
import type { ConnectButtonProps } from "../../../../core/hooks/connection/ConnectButtonProps.js";
import { useActiveAccount } from "../../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../../core/hooks/wallets/useActiveWallet.js";
import { useAdminWallet } from "../../../../core/hooks/wallets/useAdminWallet.js";
import { useDisconnect } from "../../../../core/hooks/wallets/useDisconnect.js";
import { wait } from "../../../../core/utils/wait.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { WalletImage } from "../../components/WalletImage.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Text } from "../../components/text.js";
import { StyledDiv } from "../../design-system/elements.js";
import { TOS } from "../Modal/TOS.js";
import type { ConnectLocale } from "../locale/types.js";
import { WalletLogoSpinner } from "./WalletLogoSpinner.js";

type Status = "signing" | "failed" | "idle";

export const SignatureScreen: React.FC<{
  onDone: (() => void) | undefined;
  onClose?: (() => void) | undefined;
  modalSize: "compact" | "wide";
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
  auth: ConnectButtonProps["auth"];
}> = (props) => {
  const {
    onDone,
    modalSize,
    onClose,
    termsOfServiceUrl,
    privacyPolicyUrl,
    connectLocale,
  } = props;

  const wallet = useActiveWallet();
  const adminWallet = useAdminWallet();
  const activeAccount = useActiveAccount();
  const siweAuth = useSiweAuth(wallet, activeAccount, props.auth);
  const [error, setError] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<Status>(error ? "failed" : "idle");
  const { disconnect } = useDisconnect();
  const locale = connectLocale.signatureScreen;

  const signIn = useCallback(async () => {
    try {
      setError(undefined);
      setStatus("signing");
      await siweAuth.doLogin();
      onDone?.();
    } catch (err) {
      await wait(1000);
      setError((err as Error).message);
      setStatus("failed");
    }
  }, [onDone, siweAuth]);

  if (!wallet || siweAuth.isLoading) {
    return <LoadingScreen data-testid="loading-screen" />;
  }

  if (
    isHeadlessSignSupported(wallet.id) ||
    (wallet.id === "smart" &&
      adminWallet &&
      isHeadlessSignSupported(adminWallet.id))
  ) {
    return (
      <HeadlessSignIn
        error={error}
        signIn={signIn}
        status={status}
        connectLocale={connectLocale}
        wallet={wallet}
      />
    );
  }

  const handleRetry = () => {
    signIn();
  };

  return (
    <Container animate="fadein" fullHeight flex="column">
      <Container
        p="lg"
        style={{
          paddingBottom: 0,
        }}
      >
        <ModalHeader title={locale.instructionScreen.title} />
      </Container>

      <Container
        style={{
          paddingTop: 0,
          paddingBottom: spacing.xl,
        }}
        flex="column"
        px={modalSize === "compact" ? "lg" : "xxl"}
        center="y"
        expand
      >
        {status === "idle" ? (
          <>
            <Container flex="row" center="x" animate="fadein" py="3xl">
              <PulsatingContainer>
                <WalletImage id={wallet.id} client={props.client} size="80" />
              </PulsatingContainer>
            </Container>

            <Text center multiline balance>
              {locale.instructionScreen.instruction}
            </Text>
            <Spacer y="lg" />
            <Button
              fullWidth
              variant="accent"
              data-testid="sign-in-button"
              onClick={signIn}
              style={{
                alignItems: "center",
                padding: spacing.md,
              }}
            >
              {connectLocale.signatureScreen.instructionScreen.signInButton}
            </Button>
            <Spacer y="sm" />
            <Button
              fullWidth
              variant="secondary"
              data-testid="disconnect-button"
              onClick={() => {
                onClose?.();
                disconnect(wallet);
              }}
              style={{
                alignItems: "center",
                padding: spacing.md,
              }}
            >
              {connectLocale.signatureScreen.instructionScreen.disconnectWallet}
            </Button>
          </>
        ) : (
          <>
            <Container py="3xl">
              <WalletLogoSpinner
                client={props.client}
                error={status === "failed"}
                id={wallet.id}
              />
            </Container>

            <Container flex="column" gap="md" animate="fadein" key={status}>
              <Text size="lg" center color="primaryText">
                {status === "failed"
                  ? error || locale.signingScreen.failedToSignIn
                  : locale.signingScreen.inProgress}
              </Text>

              {status === "signing" && (
                <Text center multiline balance>
                  {connectLocale.signatureScreen.signingScreen.prompt}
                </Text>
              )}

              {status === "failed" && (
                <Container>
                  <Spacer y="sm" />
                  <Button
                    fullWidth
                    variant="accent"
                    onClick={handleRetry}
                    style={{
                      gap: spacing.xs,
                      alignItems: "center",
                      padding: spacing.md,
                    }}
                  >
                    <ReloadIcon width={iconSize.sm} height={iconSize.sm} />
                    {locale.signingScreen.tryAgain}
                  </Button>
                  <Spacer y="sm" />
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={() => {
                      disconnect(wallet);
                    }}
                    style={{
                      alignItems: "center",
                      padding: spacing.md,
                    }}
                  >
                    {locale.instructionScreen.disconnectWallet}
                  </Button>
                </Container>
              )}
            </Container>
          </>
        )}
      </Container>

      {(termsOfServiceUrl || privacyPolicyUrl) && (
        <Container p="md" animate="fadein">
          <TOS
            termsOfServiceUrl={termsOfServiceUrl}
            privacyPolicyUrl={privacyPolicyUrl}
            locale={connectLocale.agreement}
          />
        </Container>
      )}
    </Container>
  );
};

function isHeadlessSignSupported(walletId: Wallet["id"]) {
  return (
    walletId === "inApp" ||
    walletId === "embedded" ||
    walletId.startsWith("ecosystem")
  );
}

function HeadlessSignIn({
  signIn,
  error,
  status,
  connectLocale,
  wallet,
}: {
  signIn: () => void;
  status: Status;
  error: string | undefined;
  connectLocale: ConnectLocale;
  wallet: Wallet;
}) {
  const locale = connectLocale.signatureScreen;
  const mounted = useRef(false);
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (mounted.current) {
      return;
    }
    mounted.current = true;
    signIn();
  }, [signIn]);

  return (
    <Container p="lg" fullHeight flex="column" animate="fadein">
      <ModalHeader title={locale.signingScreen.title} />
      <Container
        expand
        flex="row"
        center="both"
        style={{
          minHeight: "250px",
        }}
      >
        {status === "signing" && <Spinner size="xl" color="accentText" />}

        {status === "failed" && (
          <Container>
            <Spacer y="lg" />
            <Text size="lg" center color="danger">
              {error || locale.signingScreen.failedToSignIn}
            </Text>

            <Spacer y="lg" />
            <Button
              fullWidth
              variant="accent"
              onClick={() => {
                signIn();
              }}
              style={{
                gap: spacing.xs,
                alignItems: "center",
                padding: spacing.md,
              }}
            >
              <ReloadIcon width={iconSize.sm} height={iconSize.sm} />
              {locale.signingScreen.tryAgain}
            </Button>
            <Spacer y="sm" />
            <Button
              fullWidth
              variant="secondary"
              onClick={() => {
                disconnect(wallet);
              }}
              data-testid="disconnect-button"
              style={{
                alignItems: "center",
                padding: spacing.md,
              }}
            >
              {locale.instructionScreen.disconnectWallet}
            </Button>
          </Container>
        )}
      </Container>
    </Container>
  );
}

const pulseAnimation = keyframes`
0% {
  transform: scale(0.9);
}
100% {
  opacity: 0;
  transform: scale(1.4);
}
`;

const PulsatingContainer = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  return {
    position: "relative",
    "&::before": {
      content: '""',
      display: "block",
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      background: theme.colors.accentText,
      animation: `${pulseAnimation} 2s cubic-bezier(0.175, 0.885, 0.32, 1.1) infinite`,
      zIndex: -1,
      borderRadius: radius.xl,
    },
  };
});
