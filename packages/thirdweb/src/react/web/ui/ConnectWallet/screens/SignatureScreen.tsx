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
import { Container, ModalHeader } from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Text } from "../../components/text.js";
import { WalletImage } from "../../components/WalletImage.js";
import { StyledDiv } from "../../design-system/elements.js";
import type { ConnectLocale } from "../locale/types.js";
import { TOS } from "../Modal/TOS.js";
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

  if (!wallet || siweAuth.isPending) {
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
        connectLocale={connectLocale}
        error={error}
        signIn={signIn}
        status={status}
        wallet={wallet}
      />
    );
  }

  const handleRetry = () => {
    signIn();
  };

  return (
    <Container animate="fadein" flex="column" fullHeight>
      <Container
        p="lg"
        style={{
          paddingBottom: 0,
        }}
      >
        <ModalHeader title={locale.instructionScreen.title} />
      </Container>

      <Container
        center="y"
        expand
        flex="column"
        px={modalSize === "compact" ? "lg" : "xxl"}
        style={{
          paddingBottom: spacing.xl,
          paddingTop: 0,
        }}
      >
        {status === "idle" ? (
          <>
            <Container animate="fadein" center="x" flex="row" py="3xl">
              <PulsatingContainer>
                <WalletImage client={props.client} id={wallet.id} size="80" />
              </PulsatingContainer>
            </Container>

            <Text balance center multiline>
              {locale.instructionScreen.instruction}
            </Text>
            <Spacer y="lg" />
            <Button
              data-testid="sign-in-button"
              fullWidth
              onClick={signIn}
              style={{
                alignItems: "center",
                padding: spacing.md,
              }}
              variant="accent"
            >
              {connectLocale.signatureScreen.instructionScreen.signInButton}
            </Button>
            <Spacer y="sm" />
            <Button
              data-testid="disconnect-button"
              fullWidth
              onClick={() => {
                onClose?.();
                disconnect(wallet);
              }}
              style={{
                alignItems: "center",
                padding: spacing.md,
              }}
              variant="secondary"
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

            <Container animate="fadein" flex="column" gap="md" key={status}>
              <Text center color="primaryText" size="lg">
                {status === "failed"
                  ? error || locale.signingScreen.failedToSignIn
                  : locale.signingScreen.inProgress}
              </Text>

              {status === "signing" && (
                <Text balance center multiline>
                  {connectLocale.signatureScreen.signingScreen.prompt}
                </Text>
              )}

              {status === "failed" && (
                <Container>
                  <Spacer y="sm" />
                  <Button
                    fullWidth
                    onClick={handleRetry}
                    style={{
                      alignItems: "center",
                      gap: spacing.xs,
                      padding: spacing.md,
                    }}
                    variant="accent"
                  >
                    <ReloadIcon height={iconSize.sm} width={iconSize.sm} />
                    {locale.signingScreen.tryAgain}
                  </Button>
                  <Spacer y="sm" />
                  <Button
                    fullWidth
                    onClick={() => {
                      disconnect(wallet);
                    }}
                    style={{
                      alignItems: "center",
                      padding: spacing.md,
                    }}
                    variant="secondary"
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
        <Container animate="fadein" p="md">
          <TOS
            locale={connectLocale.agreement}
            privacyPolicyUrl={privacyPolicyUrl}
            termsOfServiceUrl={termsOfServiceUrl}
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
    <Container animate="fadein" flex="column" fullHeight p="lg">
      <ModalHeader title={locale.signingScreen.title} />
      <Container
        center="both"
        expand
        flex="row"
        style={{
          minHeight: "250px",
        }}
      >
        {status === "signing" && <Spinner color="accentText" size="xl" />}

        {status === "failed" && (
          <Container>
            <Spacer y="lg" />
            <Text center color="danger" size="lg">
              {error || locale.signingScreen.failedToSignIn}
            </Text>

            <Spacer y="lg" />
            <Button
              fullWidth
              onClick={() => {
                signIn();
              }}
              style={{
                alignItems: "center",
                gap: spacing.xs,
                padding: spacing.md,
              }}
              variant="accent"
            >
              <ReloadIcon height={iconSize.sm} width={iconSize.sm} />
              {locale.signingScreen.tryAgain}
            </Button>
            <Spacer y="sm" />
            <Button
              data-testid="disconnect-button"
              fullWidth
              onClick={() => {
                disconnect(wallet);
              }}
              style={{
                alignItems: "center",
                padding: spacing.md,
              }}
              variant="secondary"
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
    "&::before": {
      animation: `${pulseAnimation} 2s cubic-bezier(0.175, 0.885, 0.32, 1.1) infinite`,
      background: theme.colors.accentText,
      borderRadius: radius.xl,
      bottom: 0,
      content: '""',
      display: "block",
      left: 0,
      position: "absolute",
      right: 0,
      top: 0,
      zIndex: -1,
    },
    position: "relative",
  };
});
