import {
  WalletInstance,
  useAddress,
  useChainId,
  useLogin,
  useWallet,
  useWalletConfig,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { Spacer } from "../../components/Spacer";
import { Container, ModalHeader } from "../../components/basic";
import { Text } from "../../components/text";
import { WalletLogoSpinner } from "./screens/WalletLogoSpinner";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ModalConfigCtx } from "../../evm/providers/wallet-ui-states-provider";
import { wait } from "../../utils/wait";
import { Button } from "../../components/buttons";
import { Theme, iconSize, radius, spacing } from "../../design-system";
import {
  CrossCircledIcon,
  ExternalLinkIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { Img } from "../../components/Img";
import styled from "@emotion/styled";
import { walletIds } from "@thirdweb-dev/wallets";
import { safeChainIdToSlug } from "../wallets/safe/safeChainSlug";
import { TOS } from "./Modal/TOS";
import { keyframes } from "@emotion/react";
import { Spinner } from "../../components/Spinner";
import { useTWLocale } from "../../evm/providers/locale-provider";

type Status = "signing" | "failed" | "idle";

export const SignatureScreen: React.FC<{
  onDone: () => void;
  modalSize: "compact" | "wide";
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
}> = ({ onDone, modalSize, termsOfServiceUrl, privacyPolicyUrl }) => {
  const locale = useTWLocale().connectWallet.signatureScreen;
  const walletConfig = useWalletConfig();
  const wallet = useWallet();
  const { auth } = useContext(ModalConfigCtx);
  const [status, setStatus] = useState<Status>("idle");
  const { login } = useLogin();
  const [tryId, setTryId] = useState(0);

  const isSafeWallet = wallet?.walletId === walletIds.safe;

  const chainId = useChainId();

  const address = useAddress();
  const safeChainSlug =
    chainId && chainId in safeChainIdToSlug
      ? safeChainIdToSlug[chainId as keyof typeof safeChainIdToSlug]
      : undefined;

  const signIn = useCallback(async () => {
    try {
      setStatus("signing");
      await wait(1000);
      const token = await login();
      auth?.onLogin?.(token);
      onDone();
    } catch (err) {
      setStatus("failed");
      console.error("failed to log in", err);
    }
  }, [auth, login, onDone]);

  // if wallet is not connected - just show spinner
  if (!walletConfig || !wallet) {
    return (
      <Container
        flex="row"
        center="both"
        style={{
          minHeight: "300px",
        }}
      >
        <Spinner size="xl" color="accentText" />
      </Container>
    );
  }

  if (walletConfig?.isHeadless) {
    return <HeadlessSignIn signIn={signIn} status={status} />;
  }

  const handleRetry = () => {
    signIn();
    setTryId(tryId + 1);
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
            {walletConfig && (
              <Container flex="row" center="x" animate="fadein" py="3xl">
                <PulsatingContainer>
                  <Img
                    src={walletConfig.meta.iconURL}
                    width={"80"}
                    height={"80"}
                  />
                </PulsatingContainer>
              </Container>
            )}

            <Text center multiline balance>
              {locale.instructionScreen.instruction}
            </Text>
            <Spacer y="md" />
            <Button
              fullWidth
              variant="accent"
              onClick={signIn}
              style={{
                gap: spacing.xs,
                alignItems: "center",
                padding: spacing.md,
              }}
            >
              {locale.instructionScreen.signInButton}
            </Button>
          </>
        ) : (
          <>
            {walletConfig && (
              <Container py="3xl">
                <WalletLogoSpinner
                  key={String(tryId)}
                  error={status === "failed"}
                  iconUrl={walletConfig.meta.iconURL}
                />
              </Container>
            )}

            <Container flex="column" gap="md" animate="fadein" key={status}>
              <Text size="lg" center color="primaryText">
                {status === "failed"
                  ? locale.signingScreen.failedToSignIn
                  : "Awaiting Confirmation"}
              </Text>

              {status === "signing" && (
                <Text center multiline balance>
                  {isSafeWallet ? (
                    <SafeWalletInstruction />
                  ) : (
                    <>{locale.signingScreen.prompt}</>
                  )}
                </Text>
              )}

              {isSafeWallet && status === "signing" && (
                <Container>
                  <Spacer y="sm" />
                  <Button
                    fullWidth
                    variant="accent"
                    onClick={() => {
                      window.open(
                        `https://app.safe.global/transactions/queue?safe=${safeChainSlug}:${address}`,
                        "_blank",
                      );
                    }}
                    style={{
                      gap: spacing.xs,
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    {locale.signingScreen.approveTransactionInSafe}
                    <ExternalLinkIcon
                      width={iconSize.sm}
                      height={iconSize.sm}
                    />
                  </Button>
                </Container>
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
          />
        </Container>
      )}
    </Container>
  );
};

function SafeWalletInstruction() {
  const locale = useTWLocale().connectWallet.signatureScreen.signingScreen;
  const { getWalletConfig } = useWalletContext();
  const wallet = useWallet();
  const personalWallet = wallet?.getPersonalWallet() as
    | WalletInstance
    | undefined;
  const isSafePersonalWalletHeadless =
    personalWallet && getWalletConfig(personalWallet)?.isHeadless;

  return (
    <>
      {isSafePersonalWalletHeadless ? (
        <>{locale.approveTransactionInSafe}</>
      ) : (
        <>{locale.promptForSafe}</>
      )}
    </>
  );
}

function HeadlessSignIn({
  signIn,
  status,
}: {
  signIn: () => void;
  status: Status;
}) {
  const locale = useTWLocale().connectWallet.signatureScreen.signingScreen;
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) {
      return;
    }
    mounted.current = true;
    signIn();
  }, [signIn]);

  return (
    <Container p="lg" fullHeight flex="column" animate="fadein">
      <ModalHeader title={locale.title} />
      <Container
        expand
        flex="row"
        center="both"
        style={{
          minHeight: "250px",
        }}
      >
        {status === "failed" ? (
          <Container
            flex="column"
            gap="lg"
            color="danger"
            center="both"
            animate="fadein"
          >
            <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
            <Text color="danger"> {locale.failedToSignIn} </Text>
          </Container>
        ) : (
          <Spinner size="xl" color="accentText" />
        )}
      </Container>
    </Container>
  );
}

const plusAnimation = keyframes`
0% {
  transform: scale(0.9);
}
100% {
  opacity: 0;
  transform: scale(1.4);
}
`;

const PulsatingContainer = styled.div<{ theme?: Theme }>`
  position: relative;

  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: ${(p) => p.theme.colors.accentText};
    animation: ${plusAnimation} 2s cubic-bezier(0.175, 0.885, 0.32, 1.1)
      infinite;
    z-index: -1;
    border-radius: ${radius.xl};
  }
`;
