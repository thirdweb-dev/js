import { Spacer } from "../../../components/Spacer";
import { Button } from "../../../components/buttons";
import { FormFieldWithIconButton } from "../../../components/formFields";
import { ModalDescription } from "../../../components/modalElements";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import {
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useState } from "react";
import { DragNDrop } from "../../../components/DragNDrop";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import { LocalWallet } from "@thirdweb-dev/wallets";
import type { LocalWalletConfig } from "./types";
import { Container, Line, ModalHeader } from "../../../components/basic";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const ImportLocalWallet: React.FC<{
  onConnect: () => void;
  goBack: () => void;
  localWalletConf: LocalWalletConfig;
  persist: boolean;
}> = (props) => {
  const locale = useTWLocale().wallets.localWallet;
  const [jsonString, setJsonString] = useState<string | undefined>();
  const { setLocalWallet } = useLocalWalletInfo(
    props.localWalletConf,
    props.persist,
  );
  const createWalletInstance = useCreateWalletInstance();
  const [password, setPassword] = useState("");
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [importedAddress, setImportedAddress] = useState<string | undefined>();

  const { setConnectedWallet, setConnectionStatus } = useWalletContext();

  const handleImport = async () => {
    const localWallet = createWalletInstance(
      props.localWalletConf,
    ) as LocalWallet;
    if (!localWallet || !jsonString) {
      throw new Error("Invalid state");
    }

    try {
      await localWallet.import({
        encryptedJson: jsonString,
        password,
      });
    } catch (e) {
      console.error(e);
      setIsWrongPassword(true);
      return;
    }

    setConnectionStatus("connecting");
    await localWallet.connect();

    await localWallet.save({
      strategy: "encryptedJson",
      password,
    });

    setConnectedWallet(localWallet);
    setLocalWallet(localWallet);
    props.onConnect();
  };

  return (
    <Container animate="fadein">
      <Container p="lg">
        <ModalHeader onBack={props.goBack} title={locale.importScreen.title} />
      </Container>
      <Line />

      <Container p="lg">
        <ModalDescription>{locale.importScreen.description1}</ModalDescription>

        <Spacer y="xs" />

        <ModalDescription>{locale.importScreen.description2}</ModalDescription>

        <Spacer y="lg" />

        <DragNDrop
          locale={{
            uploadedSuccessfully: locale.importScreen.uploadedSuccessfully,
            wrongFileError: locale.importScreen.uploadJSON,
          }}
          extension="JSON"
          accept="application/json"
          onUpload={(file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              setJsonString(event.target?.result as string);
              const obj = JSON.parse(event.target?.result as string);
              setImportedAddress(obj.address);
            };
            reader.readAsText(file, "utf-8");
          }}
        />

        <Spacer y="lg" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleImport();
          }}
        >
          {/* Password */}
          {jsonString && (
            <>
              {/* Hidden Account Address as Username */}
              <input
                type="text"
                name="username"
                autoComplete="off"
                value={importedAddress || ""}
                disabled
                style={{ display: "none" }}
              />

              <FormFieldWithIconButton
                required
                noSave={true}
                name="password"
                autocomplete="off"
                id="password"
                onChange={(value) => {
                  setPassword(value);
                  setIsWrongPassword(false);
                }}
                right={{
                  onClick: () => setShowPassword(!showPassword),
                  icon: showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />,
                }}
                label={locale.passwordLabel}
                type={showPassword ? "text" : "password"}
                value={password}
                error={isWrongPassword ? "Wrong Password" : ""}
              />
              <Spacer y="xl" />
            </>
          )}

          <Container
            flex="row"
            style={{
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="accent"
              type="submit"
              disabled={!jsonString}
              style={{
                minWidth: "110px",
                opacity: jsonString ? 1 : 0.5,
              }}
            >
              {locale.importScreen.import}
            </Button>
          </Container>
        </form>
      </Container>
    </Container>
  );
};
