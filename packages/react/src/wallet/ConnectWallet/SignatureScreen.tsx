import { useLogin, useSigner, useWalletConfig } from "@thirdweb-dev/react-core";
import { Spacer } from "../../components/Spacer";
import { Container, Line, ModalHeader } from "../../components/basic";
import { Text } from "../../components/text";
import { WalletLogoSpinner } from "./screens/WalletLogoSpinner";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ModalConfigCtx } from "../../evm/providers/wallet-ui-states-provider";
import { wait } from "../../utils/wait";
import { Button } from "../../components/buttons";
import { fontSize, iconSize, spacing } from "../../design-system";
import { ReloadIcon } from "@radix-ui/react-icons";

export const SignatureScreen: React.FC<{ onDone: () => void }> = ({
  onDone,
}) => {
  const modalSize = useContext(ModalConfigCtx).modalSize;
  const walletConfig = useWalletConfig();
  const { auth } = useContext(ModalConfigCtx);
  const [status, setStatus] = useState<"signing" | "failed">("signing");
  const { login } = useLogin();
  const signer = useSigner();
  const [tryId, setTryId] = useState(0);

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

  const mounted = useRef(false);
  useEffect(() => {
    if (!signer) {
      return;
    }
    if (mounted.current) {
      return;
    }
    signIn();
    mounted.current = true;
  }, [signer, signIn]);

  const handleRetry = () => {
    signIn();
    setTryId(tryId + 1);
  };

  return (
    <Container animate="fadein" fullHeight flex="column">
      <Container p="lg">
        <ModalHeader title="Sign in" />
      </Container>

      <Container flex="column" p="lg" center="both" expand>
        <Spacer y="md" />

        {walletConfig && (
          <WalletLogoSpinner
            key={String(tryId)} // to replay enter animation
            error={status === "failed"}
            iconUrl={walletConfig.meta.iconURL}
          />
        )}

        <Spacer y="xxl" />

        <Text size="lg" center color="primaryText">
          {status === "failed" ? "Failed to sign in" : "Signing in"}
        </Text>

        <Spacer y="lg" />

        {status === "failed" ? (
          <Container flex="row" center="x" animate="fadein">
            <Button
              variant="outline"
              onClick={handleRetry}
              style={{
                gap: spacing.sm,
                alignItems: "center",
              }}
            >
              <ReloadIcon width={iconSize.sm} height={iconSize.sm} /> Retry{" "}
            </Button>
          </Container>
        ) : (
          <Text center multiline>
            Sign the signature request <br /> in your wallet{" "}
          </Text>
        )}
      </Container>

      <Spacer y="md" />

      {modalSize === "compact" && <Line />}

      <Container p="lg" flex="row" center="x">
        <Button
          variant="link"
          onClick={handleRetry}
          style={{
            fontSize: fontSize.sm,
            textAlign: "center",
          }}
        >
          {" "}
          {`Don't see signature request in wallet?`}{" "}
        </Button>
      </Container>
    </Container>
  );
};
