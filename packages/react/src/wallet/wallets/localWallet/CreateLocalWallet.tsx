import { Spacer } from "../../../components/Spacer";
import { Button } from "../../../components/buttons";
import { FormFieldWithIconButton } from "../../../components/formFields";
import {
  ModalDescription,
  ModalTitle,
} from "../../../components/modalElements";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useThirdwebWallet } from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import { ImportLocalWallet } from "./ImportLocalWallet";
import { LocalWalletModalHeader } from "./common";
import { Flex } from "../../../components/basic";
import { TextDivider } from "../../../components/TextDivider";
import { Spinner } from "../../../components/Spinner";
import { spacing } from "../../../design-system";
import { LocalConfiguredWallet } from "./types";

export const CreateLocalWallet_Password: React.FC<{
  onConnect: () => void;
  goBack: () => void;
  localWallet: LocalConfiguredWallet;
}> = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordMismatch = confirmPassword && password !== confirmPassword;
  const [isConnecting, setIsConnecting] = useState(false);

  const { localWallet, meta } = useLocalWalletInfo(props.localWallet);

  const thirdwebWalletContext = useThirdwebWallet();
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
        localWallet={props.localWallet}
        onConnect={props.onConnect}
        goBack={() => {
          setShowImportScreen(false);
        }}
      />
    );
  }

  const handleConnect = async () => {
    if (passwordMismatch || !localWallet) {
      throw new Error("Invalid state");
    }

    setIsConnecting(true);
    localWallet.connect();

    await localWallet.save({
      strategy: "encryptedJson",
      password,
    });

    thirdwebWalletContext.handleWalletConnect(localWallet);
    setIsConnecting(false);
    props.onConnect();
  };

  return (
    <>
      <LocalWalletModalHeader onBack={props.goBack} meta={meta} />

      <Flex alignItems="center" gap="xs">
        <ModalTitle>Guest Wallet</ModalTitle>
      </Flex>

      <Spacer y="sm" />
      <ModalDescription>
        Choose a password for your wallet, you{`'`}ll be able to access and
        export this wallet with the same password.
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
        />

        <Spacer y="xl" />

        {/* Create */}
        <Button
          variant="inverted"
          type="submit"
          style={{
            width: "100%",
            gap: spacing.sm,
          }}
        >
          {isConnecting ? "Connecting" : "Create new wallet"}
          {isConnecting && <Spinner size="sm" color="inverted" />}
        </Button>
      </form>

      <Spacer y="xxl" />

      <TextDivider>
        <span>OR</span>
      </TextDivider>

      <Spacer y="lg" />

      {/* Import */}
      <Flex justifyContent="center">
        <Button
          variant="link"
          onClick={() => {
            setShowImportScreen(true);
          }}
        >
          Import wallet
        </Button>
      </Flex>
    </>
  );
};

export const CreateLocalWallet_Guest: React.FC<{
  onConnect: () => void;
  goBack: () => void;
  localWallet: LocalConfiguredWallet;
}> = (props) => {
  const { localWallet } = useLocalWalletInfo(props.localWallet);
  const thirdwebWalletContext = useThirdwebWallet();

  const handleConnect = useCallback(async () => {
    if (!localWallet) {
      throw new Error("Invalid state");
    }
    await localWallet.generate();
    await localWallet.connect();
    thirdwebWalletContext.handleWalletConnect(localWallet);
    props.onConnect();
  }, [localWallet, thirdwebWalletContext, props]);

  const connecting = useRef(false);
  useEffect(() => {
    if (connecting.current || !localWallet) {
      return;
    }
    connecting.current = true;
    handleConnect();
  }, [handleConnect, localWallet]);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      style={{
        height: "300px",
      }}
    >
      <Spinner size="lg" color="link" />
    </Flex>
  );
};
