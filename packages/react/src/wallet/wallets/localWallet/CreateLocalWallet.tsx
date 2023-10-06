import { Spacer } from "../../../components/Spacer";
import { Button } from "../../../components/buttons";
import { FormFieldWithIconButton } from "../../../components/formFields";
import { ModalDescription } from "../../../components/modalElements";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useWalletContext } from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import { ImportLocalWallet } from "./ImportLocalWallet";
import { Container, Line, ModalHeader } from "../../../components/basic";
import { Spinner } from "../../../components/Spinner";
import { spacing } from "../../../design-system";
import type { LocalWalletConfig } from "./types";
import { wait } from "../../../utils/wait";

export const CreateLocalWallet_Password: React.FC<{
  onConnect: () => void;
  goBack: () => void;
  localWalletConf: LocalWalletConfig;
  renderBackButton: boolean;
  persist: boolean;
}> = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordMismatch = confirmPassword && password !== confirmPassword;
  const [isConnecting, setIsConnecting] = useState(false);

  const { localWallet } = useLocalWalletInfo(
    props.localWalletConf,
    props.persist,
  );

  const { setConnectedWallet, setConnectionStatus } = useWalletContext();
  const [showImportScreen, setShowImportScreen] = useState(false);

  const [generatedAddress, setGeneratedAddress] = useState<string | null>(null);

  // generating wallet before it's required to render a form with hidden address as username for better autofill
  useEffect(() => {
    if (!localWallet || showImportScreen || localWallet.ethersWallet) {
      return;
    }

    localWallet.generate().then((_address) => {
      setGeneratedAddress(_address);
    });
  }, [localWallet, showImportScreen]);

  if (showImportScreen) {
    return (
      <ImportLocalWallet
        localWalletConf={props.localWalletConf}
        onConnect={props.onConnect}
        goBack={() => {
          setShowImportScreen(false);
        }}
        persist={props.persist}
      />
    );
  }

  const handleConnect = async () => {
    if (passwordMismatch || !localWallet) {
      throw new Error("Invalid state");
    }

    setIsConnecting(true);
    setConnectionStatus("connecting");
    await localWallet.connect();

    await localWallet.save({
      strategy: "encryptedJson",
      password,
    });

    setConnectedWallet(localWallet);
    setIsConnecting(false);
    props.onConnect();
  };

  return (
    <Container fullHeight flex="column">
      <Container p="lg">
        <ModalHeader
          onBack={props.renderBackButton ? props.goBack : undefined}
          title={props.localWalletConf.meta.name}
          imgSrc={props.localWalletConf.meta.iconURL}
        />
      </Container>

      <Line />
      <Container expand p="lg">
        <ModalDescription sm>
          Choose a password for your wallet. <br /> You{`'`}ll be able to access
          and export this wallet with the same password.
        </ModalDescription>

        <Spacer y="lg" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleConnect();
          }}
        >
          {/* Hidden Account Address as Username */}
          <input
            type="text"
            name="username"
            autoComplete="off"
            value={generatedAddress || ""}
            disabled
            style={{ display: "none" }}
          />

          {/* Password */}
          <FormFieldWithIconButton
            name="password"
            required
            autocomplete="new-password"
            id="new-password"
            onChange={(value) => setPassword(value)}
            right={{
              icon: showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />,
              onClick: () => setShowPassword(!showPassword),
            }}
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            dataTest="new-password"
          />

          <Spacer y="lg" />

          {/* Confirm Password */}
          <FormFieldWithIconButton
            name="confirm-password"
            required
            autocomplete="new-password"
            id="confirm-password"
            onChange={(value) => setConfirmPassword(value)}
            right={{
              icon: showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />,
              onClick: () => setShowPassword(!showPassword),
            }}
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            error={passwordMismatch ? "Passwords don't match" : ""}
            dataTest="confirm-password"
            noErrorShift
          />

          <Spacer y="md" />

          {/* Create */}
          <Button
            variant="accent"
            type="submit"
            disabled={isConnecting}
            fullWidth
            style={{
              gap: spacing.xs,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            data-test="create-new-wallet-button"
          >
            {isConnecting ? "Connecting" : "Create new wallet"}
            {isConnecting && <Spinner size="sm" color="accentButtonText" />}
          </Button>
        </form>
      </Container>

      <Spacer y="sm" />
      <Line />
      <Container p="lg">
        {/* Import */}
        <Button
          fullWidth
          variant="link"
          onClick={() => {
            setShowImportScreen(true);
          }}
          style={{
            display: "flex",
            gap: spacing.sm,
            alignItems: "center",
          }}
        >
          Import wallet
        </Button>
      </Container>
    </Container>
  );
};

export const CreateLocalWallet_Guest: React.FC<{
  onConnect: () => void;
  goBack: () => void;
  localWallet: LocalWalletConfig;
  persist: boolean;
}> = (props) => {
  const { localWallet } = useLocalWalletInfo(props.localWallet, props.persist);
  const { setConnectedWallet, setConnectionStatus } = useWalletContext();
  const { onConnect } = props;

  const handleConnect = useCallback(async () => {
    if (!localWallet) {
      throw new Error("Invalid state");
    }
    await localWallet.generate();
    setConnectionStatus("connecting");
    await wait(1000);
    await localWallet.connect();
    setConnectedWallet(localWallet);
    onConnect();
  }, [localWallet, setConnectedWallet, onConnect, setConnectionStatus]);

  const connecting = useRef(false);
  useEffect(() => {
    if (connecting.current || !localWallet) {
      return;
    }
    connecting.current = true;
    handleConnect();
  }, [handleConnect, localWallet]);

  return (
    <Container
      flex="row"
      center="both"
      fullHeight
      style={{
        minHeight: "300px",
      }}
    >
      <Spinner size="xl" color="accentText" />
    </Container>
  );
};
