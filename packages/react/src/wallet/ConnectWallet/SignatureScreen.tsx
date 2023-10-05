import {
  useAddress,
  useChainId,
  useLogin,
  useWallet,
  useWalletConfig,
} from "@thirdweb-dev/react-core";
import { Spacer } from "../../components/Spacer";
import { Container, Line, ModalHeader } from "../../components/basic";
import { Link, Text } from "../../components/text";
import { WalletLogoSpinner } from "./screens/WalletLogoSpinner";
import { useCallback, useContext, useState } from "react";
import { ModalConfigCtx } from "../../evm/providers/wallet-ui-states-provider";
import { wait } from "../../utils/wait";
import { Button } from "../../components/buttons";
import { Theme, iconSize, radius, spacing } from "../../design-system";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Img } from "../../components/Img";
import styled from "@emotion/styled";
import { walletIds } from "@thirdweb-dev/wallets";
import { safeChainIdToSlug } from "../wallets/safe/safeChainSlug";

export const SignatureScreen: React.FC<{ onDone: () => void }> = ({
  onDone,
}) => {
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
      await wait(1000000); // TODO: remove this line
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

      <Spacer y="sm" />

      <Container flex="column" p="lg" center="both" expand>
        {status === "idle" && (
          <>
            {walletConfig && (
              <PulsatingContainer>
                <Img
                  src={walletConfig.meta.iconURL}
                  width={"80"}
                  height={"80"}
                />
              </PulsatingContainer>
            )}

            <Spacer y="xxl" />

            <Text center multiline>
              Please sign the message request <br />
              in your wallet to continue
            </Text>
          </>
        )}

        {status !== "idle" && (
          <>
            {walletConfig && (
              <WalletLogoSpinner
                key={String(tryId)} // to replay enter animation
                error={status === "failed"}
                iconUrl={walletConfig.meta.iconURL}
              />
            )}

            <Spacer y="xxl" />
            <Spacer y="sm" />

            <Text size="lg" center color="primaryText">
              {status === "failed"
                ? "Failed to sign in"
                : "Awaiting Confirmation"}
            </Text>

            {status !== "failed" && (
              <>
                <Spacer y="lg" />
                <Text center multiline>
                  Sign the signature request <br /> in your wallet{" "}
                  {isSafeWallet && <>& approve transaction</>}
                </Text>
                <Spacer y="md" />
              </>
            )}
          </>
        )}
      </Container>

      {status !== "signing" && (
        <>
          <Container animate="fadein" px="lg">
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
              {status === "idle" && <>Sign in</>}

              {status === "failed" && (
                <>
                  <ReloadIcon width={iconSize.sm} height={iconSize.sm} />
                  Try again
                </>
              )}
            </Button>
          </Container>
          <Spacer y="lg" />
        </>
      )}

      {isSafeWallet && status === "signing" && (
        <>
          <Line />
          <Container p="lg" animate="fadein">
            <Link
              center
              target="_blank"
              href={`
              https://app.safe.global/transactions/queue?safe=${safeChainSlug}:${address}
            `}
            >
              {" "}
              Approve transaction in Safe{" "}
            </Link>
          </Container>
        </>
      )}
    </Container>
  );
};

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
    animation: pulse 2s cubic-bezier(0.175, 0.885, 0.32, 1.1) infinite;
    z-index: -1;
    border-radius: ${radius.xl};
  }

  @keyframes pulse {
    0% {
      transform: scale(0.9);
    }
    100% {
      opacity: 0;
      transform: scale(1.4);
    }
  }
`;
