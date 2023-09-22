import { ModalTitle } from "../../components/modalElements";
import { useLogin, useSigner, useWalletConfig } from "@thirdweb-dev/react-core";
import { Spacer } from "../../components/Spacer";
import { Container } from "../../components/basic";
import { Text } from "../../components/text";
import { WalletLogoSpinner } from "./screens/WalletLogoSpinner";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ModalConfigCtx } from "../../evm/providers/wallet-ui-states-provider";
import { wait } from "../../utils/wait";

export const SignatureScreen: React.FC<{ onDone: () => void }> = ({
  onDone,
}) => {
  const walletConfig = useWalletConfig();
  const { auth } = useContext(ModalConfigCtx);
  const [status, setStatus] = useState<"signing" | "failed">("signing");
  const { login } = useLogin();
  const signer = useSigner();

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

  return (
    <Container p="lg" animate="fadein" fullHeight flex="column">
      <Spacer y="xxl" />

      <Container flex="column" center="both" expand>
        {walletConfig && (
          <WalletLogoSpinner
            error={status === "failed"}
            onRetry={signIn}
            iconUrl={walletConfig.meta.iconURL}
          />
        )}

        <Spacer y="xxl" />

        <ModalTitle>
          {status === "failed" ? "Failed to sign in" : "Signing in"}
        </ModalTitle>
        <Spacer y="md" />

        <Text multiline center>
          {status === "failed" ? (
            <>
              Click on Retry button above <br /> to try again
            </>
          ) : (
            <>
              {" "}
              Sign the signature request <br /> in your wallet{" "}
            </>
          )}
        </Text>

        <Spacer y="lg" />
      </Container>
    </Container>
  );
};
