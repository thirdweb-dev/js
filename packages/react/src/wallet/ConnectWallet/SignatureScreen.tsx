import {
  useAddress,
  useChainId,
  useLogin,
  useWallet,
  useWalletConfig,
} from "@thirdweb-dev/react-core";
import { Spacer } from "../../components/Spacer";
import { Container, ModalHeader } from "../../components/basic";
import { Text } from "../../components/text";
import { WalletLogoSpinner } from "./screens/WalletLogoSpinner";
import { useCallback, useContext, useState } from "react";
import { ModalConfigCtx } from "../../evm/providers/wallet-ui-states-provider";
import { wait } from "../../utils/wait";
import { Button } from "../../components/buttons";
import { Theme, iconSize, radius, spacing } from "../../design-system";
import { ExternalLinkIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Img } from "../../components/Img";
import styled from "@emotion/styled";
import { walletIds } from "@thirdweb-dev/wallets";
import { safeChainIdToSlug } from "../wallets/safe/safeChainSlug";
import { TOS } from "./Modal/TOS";
import { keyframes } from "@emotion/react";

export const SignatureScreen: React.FC<{
  onDone: () => void;
  modalSize: "compact" | "wide";
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
}> = ({ onDone, modalSize, termsOfServiceUrl, privacyPolicyUrl }) => {
  const walletConfig = useWalletConfig();
  const wallet = useWallet();
  const { auth } = useContext(ModalConfigCtx);
  const [status, setStatus] = useState<"signing" | "failed" | "idle">("idle");
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

  const handleRetry = () => {
    signIn();
    setTryId(tryId + 1);
  };

  return (
    <Container animate="fadein" fullHeight flex="column">
      <Container p="lg">
        <ModalHeader title="Sign in" />
      </Container>

      <Container
        style={{
          minHeight: "250px",
        }}
        flex="column"
        px={modalSize === "compact" ? "lg" : "xxl"}
        py="lg"
        center="y"
        expand
      >
        {status === "idle" ? (
          <>
            <Spacer y="sm" />
            {walletConfig && (
              <Container flex="row" center="x" animate="fadein">
                <PulsatingContainer>
                  <Img
                    src={walletConfig.meta.iconURL}
                    width={"80"}
                    height={"80"}
                  />
                </PulsatingContainer>
              </Container>
            )}

            <Spacer y="xxl" />

            <Text center multiline>
              Please sign the message request <br />
              in your wallet to continue
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
              Sign in
            </Button>
          </>
        ) : (
          <>
            {walletConfig && (
              <WalletLogoSpinner
                key={String(tryId)}
                error={status === "failed"}
                iconUrl={walletConfig.meta.iconURL}
              />
            )}

            <Spacer y="xxl" />

            <Container flex="column" gap="md">
              <Text size="lg" center color="primaryText">
                {status === "failed"
                  ? "Failed to sign in"
                  : "Awaiting Confirmation"}
              </Text>

              <Text center multiline>
                Sign the signature request <br /> in your wallet{" "}
                {isSafeWallet && <>& approve transaction</>}
              </Text>

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
                    Approve transaction in Safe{" "}
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
                    Try Again
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
