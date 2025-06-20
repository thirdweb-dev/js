import { useEffect, useRef, useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { webLocalStorage } from "../../../../utils/storage/webStorage.js";
import { isEcosystemWallet } from "../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import { linkProfile } from "../../../../wallets/in-app/web/lib/auth/index.js";
import { hasStoredPasskey } from "../../../../wallets/in-app/web/lib/auth/passkeys.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { iconSize } from "../../../core/design-system/index.js";
import { setLastAuthProvider } from "../../../core/utils/storage.js";
import { FingerPrintIcon } from "../../ui/ConnectWallet/icons/FingerPrintIcon.js";
import type { ConnectLocale } from "../../ui/ConnectWallet/locale/types.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { ErrorState } from "./ErrorState.js";
import { LoadingScreen } from "./LoadingScreen.js";
import { LoadingState } from "./LoadingState.js";

// is passkey stored?
// - login
// else
// - show login or signup options

export function PassKeyLogin(props: {
  wallet: Wallet;
  locale: ConnectLocale;
  done: () => void;
  onBack?: () => void;
  client: ThirdwebClient;
  chain: Chain | undefined;
  size: "compact" | "wide";
  isLinking?: boolean;
}) {
  const { wallet, done, client, chain, size, locale } = props;
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
    <Container animate="fadein" flex="column" fullHeight>
      <Container p="lg">
        <ModalHeader
          onBack={props.onBack}
          title={
            props.isLinking
              ? locale.passkeys.linkPasskey
              : locale.passkeys.title
          }
        />
      </Container>

      <Container
        center="y"
        expand
        flex="column"
        px={size === "wide" ? "xxl" : "lg"}
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
              chain={chain}
              client={client}
              done={done}
              isLinking={props.isLinking}
              onCreate={() => {
                setScreen("signup");
              }}
              wallet={wallet}
            />
          )}

          {screen === "signup" && (
            <SignupScreen
              chain={chain}
              client={client}
              done={done}
              isLinking={props.isLinking}
              wallet={wallet}
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
  isLinking?: boolean;
}) {
  const { wallet, done, client, chain } = props;
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [error, setError] = useState<string | undefined>();

  async function login() {
    setStatus("loading");
    try {
      if (props.isLinking) {
        await linkProfile({
          client,
          strategy: "passkey",
          type: "sign-in",
        }).catch((e) => {
          setError(e.message);
          throw e;
        });
      } else {
        await wallet.connect({
          chain,
          client: client,
          strategy: "passkey",
          type: "sign-in",
        });
        await setLastAuthProvider("passkey", webLocalStorage);
      }
      done();
    } catch (e) {
      console.error("Failed to login with passkey", e);
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
        icon={<FingerPrintIcon size={iconSize.xxl} />}
        subtitle="A pop-up prompt will appear to sign-in and verify your passkey"
        title="Requesting Passkey"
      />
    );
  }

  if (status === "error") {
    return (
      <>
        <ErrorState onTryAgain={login} title={error || "Failed to Login"} />
        <Spacer y="sm" />
        <Button fullWidth onClick={props.onCreate} variant="outline">
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
  isLinking?: boolean;
}) {
  const { wallet, done, client, chain } = props;
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const ecosystem = isEcosystemWallet(wallet)
    ? {
        id: wallet.id,
        partnerId: wallet.getConfig()?.partnerId,
      }
    : undefined;

  async function signup() {
    setStatus("loading");
    try {
      if (props.isLinking) {
        await linkProfile({
          client,
          ecosystem,
          strategy: "passkey",
          type: "sign-up",
        });
      } else {
        await wallet.connect({
          chain,
          client: client,
          strategy: "passkey",
          type: "sign-up",
        });
        await setLastAuthProvider("passkey", webLocalStorage);
      }
      done();
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError(`Error creating passkey: ${e.message}`);
      }
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
        icon={<FingerPrintIcon size={iconSize.xxl} />}
        subtitle="A pop-up prompt will appear to sign-in and verify your passkey"
        title="Creating Passkey"
      />
    );
  }

  if (status === "error") {
    return (
      <>
        <ErrorState
          onTryAgain={signup}
          title={error || "Failed to create passkey"}
        />
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
      <Container center="x" color="accentText" flex="row">
        <FingerPrintIcon size={iconSize["4xl"]} />
      </Container>
      <Spacer y="xl" />
      <Spacer y="xxl" />

      <Button fullWidth onClick={props.onSignup} variant="accent">
        Create a Passkey
      </Button>

      <Spacer y="sm" />
      <Button fullWidth onClick={props.onSignin} variant="outline">
        I have a Passkey
      </Button>

      <Spacer y="lg" />
    </Container>
  );
}
