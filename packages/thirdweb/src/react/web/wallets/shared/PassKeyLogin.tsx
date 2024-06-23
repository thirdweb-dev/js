import { useEffect, useRef, useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../exports/wallets.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import { isEcosystemWallet } from "../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import { hasStoredPasskey } from "../../../../wallets/in-app/web/lib/auth/passkeys.js";
import { iconSize } from "../../../core/design-system/index.js";
import { AccentFailIcon } from "../../ui/ConnectWallet/icons/AccentFailIcon.js";
import { FingerPrintIcon } from "../../ui/ConnectWallet/icons/FingerPrintIcon.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Spinner } from "../../ui/components/Spinner.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { Text } from "../../ui/components/text.js";
import { LoadingScreen } from "./LoadingScreen.js";
import { setLastAuthProvider } from "./storage.js";

// is passkey stored?
// - login
// else
// - show login or signup options

export function PassKeyLogin(props: {
  wallet: Wallet;
  done: () => void;
  onBack?: () => void;
  client: ThirdwebClient;
  chain: Chain | undefined;
  size: "compact" | "wide";
}) {
  const { wallet, done, client, chain, size } = props;
  const [screen, setScreen] = useState<
    "select" | "login" | "loading" | "signup"
  >("loading");

  const triggered = useRef(false);
  useEffect(() => {
    if (triggered.current) {
      return;
    }

    triggered.current = true;
    hasStoredPasskey(
      client,
      isEcosystemWallet(wallet.id) ? wallet.id : undefined,
    )
      .then((isStored) => {
        if (isStored) {
          setScreen("login");
        } else {
          setScreen("select");
        }
      })
      .catch(() => {
        setScreen("select");
      });
  }, [client, wallet.id]);

  return (
    <Container animate="fadein" fullHeight flex="column">
      <Container p="lg">
        <ModalHeader title="Passkey" onBack={props.onBack} />
      </Container>

      <Container
        px={size === "wide" ? "xxl" : "lg"}
        expand
        flex="column"
        center="y"
      >
        <div>
          {screen === "loading" && (
            <>
              <LoadingScreen />
              <Spacer y="xxl" />
            </>
          )}

          {screen === "select" && (
            <SelectLoginMethod
              onSignin={() => {
                setScreen("login");
              }}
              onSignup={() => {
                setScreen("signup");
              }}
            />
          )}

          {screen === "login" && (
            <LoginScreen
              wallet={wallet}
              client={client}
              done={done}
              onCreate={() => {
                setScreen("signup");
              }}
              chain={chain}
            />
          )}

          {screen === "signup" && (
            <SignupScreen
              wallet={wallet}
              client={client}
              done={done}
              chain={chain}
            />
          )}
        </div>
      </Container>
    </Container>
  );
}

function LoginScreen(props: {
  wallet: Wallet;
  done: () => void;
  client: ThirdwebClient;
  onCreate: () => void;
  chain?: Chain;
}) {
  const { wallet, done, client, chain } = props;
  const [status, setStatus] = useState<"loading" | "error">("loading");

  async function login() {
    setStatus("loading");
    try {
      await wallet.connect({
        client: client,
        strategy: "passkey",
        type: "sign-in",
        chain,
      });
      await setLastAuthProvider("passkey", webLocalStorage);
      done();
    } catch {
      setStatus("error");
    }
  }

  const triggered = useRef(false);
  useEffect(() => {
    if (triggered.current) {
      return;
    }

    triggered.current = true;
    login();
  });

  if (status === "loading") {
    return (
      <LoadingState
        title="Requesting Passkey"
        subtitle="A pop-up prompt will appear to sign-in and verify your passkey"
      />
    );
  }

  if (status === "error") {
    return (
      <>
        <ErrorState onTryAgain={login} title="Failed to Login" />
        <Spacer y="sm" />
        <Button variant="outline" fullWidth onClick={props.onCreate}>
          Create a new Passkey
        </Button>
        <Spacer y="lg" />
      </>
    );
  }

  return null;
}

function SignupScreen(props: {
  wallet: Wallet;
  done: () => void;
  client: ThirdwebClient;
  chain?: Chain;
}) {
  const { wallet, done, client, chain } = props;
  const [status, setStatus] = useState<"loading" | "error">("loading");

  async function signup() {
    setStatus("loading");
    try {
      await wallet.connect({
        client: client,
        strategy: "passkey",
        type: "sign-up",
        chain,
      });
      await setLastAuthProvider("passkey", webLocalStorage);
      done();
    } catch {
      setStatus("error");
    }
  }

  const triggered = useRef(false);
  useEffect(() => {
    if (triggered.current) {
      return;
    }

    triggered.current = true;
    signup();
  });

  if (status === "loading") {
    return (
      <LoadingState
        title="Creating Passkey"
        subtitle="A pop-up prompt will appear to sign-in and verify your passkey"
      />
    );
  }

  if (status === "error") {
    return (
      <>
        <ErrorState onTryAgain={signup} title="Failed to create passkey" />
        <Spacer y="lg" />
      </>
    );
  }

  return null;
}

function SelectLoginMethod(props: {
  onSignin: () => void;
  onSignup: () => void;
}) {
  return (
    <Container>
      <Spacer y="xxl" />
      <Container flex="row" center="x" color="accentText">
        <FingerPrintIcon size={iconSize["4xl"]} />
      </Container>
      <Spacer y="xl" />
      <Spacer y="xxl" />

      <Button variant="accent" onClick={props.onSignup} fullWidth>
        Create a Passkey
      </Button>

      <Spacer y="sm" />
      <Button variant="outline" onClick={props.onSignin} fullWidth>
        I have a Passkey
      </Button>

      <Spacer y="lg" />
    </Container>
  );
}

function ErrorState(props: {
  onTryAgain: () => void;
  title: string;
}) {
  return (
    <Container animate="fadein">
      <Spacer y="xxl" />
      <Container flex="row" center="x">
        <AccentFailIcon size={iconSize["3xl"]} />
      </Container>
      <Spacer y="lg" />
      <Text center color="primaryText" size="lg">
        {props.title}
      </Text>
      <Spacer y="xl" />
      <Spacer y="xxl" />
      <Button variant="accent" fullWidth onClick={props.onTryAgain}>
        Try Again
      </Button>
    </Container>
  );
}

function LoadingState(props: {
  title: string;
  subtitle: string;
}) {
  return (
    <Container animate="fadein">
      <Spacer y="xxl" />
      <Container
        flex="row"
        center="x"
        style={{
          position: "relative",
        }}
      >
        <Spinner size="4xl" color="accentText" />
        <Container
          color="accentText"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <FingerPrintIcon size={iconSize.xxl} />
        </Container>
      </Container>
      <Spacer y="xl" />
      <Text center color="primaryText" size="lg">
        {props.title}
      </Text>
      <Spacer y="md" />
      <Text multiline center>
        {props.subtitle}
      </Text>
      <Spacer y="xxl" />
      <Spacer y="xxl" />
    </Container>
  );
}
