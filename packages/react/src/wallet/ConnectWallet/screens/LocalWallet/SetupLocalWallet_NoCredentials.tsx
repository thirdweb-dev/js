import { Spacer } from "../../../../components/Spacer";
import { Button } from "../../../../components/buttons";
import { FormFieldWithIconButton } from "../../../../components/formFields";
import {
  HelperLink,
  ModalDescription,
  ModalTitle,
} from "../../../../components/modalElements";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useThirdwebWallet } from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import { ImportLocalWallet } from "./ImportLocalWallet";
import { LocalWalletModalHeader } from "./common";
import { Flex } from "../../../../components/basic";
import { TextDivider } from "../../../../components/TextDivider";

export const CreateLocalWallet_NoCreds: React.FC<{
  onConnected: () => void;
  onBack: () => void;
}> = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordMismatch = confirmPassword && password !== confirmPassword;

  const { localWallet } = useLocalWalletInfo();
  const thirdwebWalletContext = useThirdwebWallet();
  const [showImportScreen, setShowImportScreen] = useState(false);

  const [generatedAddress, setGeneratedAddress] = useState<string | null>(null);

  // generate random local wallet
  const isGenerated = useRef(false);
  useEffect(() => {
    if (!localWallet || showImportScreen) {
      return;
    }
    isGenerated.current = true;
    localWallet.generate().then((_address) => {
      setGeneratedAddress(_address);
    });
  }, [localWallet, showImportScreen]);

  if (showImportScreen) {
    return (
      <ImportLocalWallet
        onConnected={props.onConnected}
        onBack={() => {
          setShowImportScreen(false);
        }}
      />
    );
  }

  const handleConnect = async () => {
    if (passwordMismatch || !localWallet || !thirdwebWalletContext) {
      throw new Error("Invalid state");
    }

    localWallet.connect();

    await localWallet.save({
      strategy: "encryptedJson",
      password,
    });

    thirdwebWalletContext.handleWalletConnect(localWallet);
    props.onConnected();
  };

  return (
    <>
      <LocalWalletModalHeader onBack={props.onBack} />

      <Flex alignItems="center" gap="xs">
        <ModalTitle>Create new wallet</ModalTitle>
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
          }}
        >
          Create new wallet
        </Button>
      </form>

      <Spacer y="xxl" />

      <TextDivider>
        <span>OR</span>
      </TextDivider>

      <Spacer y="lg" />

      {/* Import */}
      <HelperLink
        as="button"
        onClick={() => {
          setShowImportScreen(true);
        }}
        style={{
          textAlign: "center",
          width: "100%",
        }}
      >
        Import wallet
      </HelperLink>
    </>
  );
};
