import { Spacer } from "../../../components/Spacer";
import { Button } from "../../../components/buttons";
import { FormFieldWithIconButton } from "../../../components/formFields";
import {
  ModalDescription,
  ModalTitle,
} from "../../../components/modalElements";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import {
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useState } from "react";
import { DragNDrop } from "../../../components/DragNDrop";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import { FormFooter } from "../../../components/formElements";
import { LocalWallet } from "@thirdweb-dev/wallets";
import { LocalWalletModalHeader } from "./common";
import { LocalConfiguredWallet } from "./types";

export const ImportLocalWallet: React.FC<{
  onConnect: () => void;
  goBack: () => void;
  localWallet: LocalConfiguredWallet;
}> = (props) => {
  const [jsonString, setJsonString] = useState<string | undefined>();
  const { setLocalWallet, meta } = useLocalWalletInfo(props.localWallet);
  const createWalletInstance = useCreateWalletInstance();
  const [password, setPassword] = useState("");
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [importedAddress, setImportedAddress] = useState<string | undefined>();

  const { setConnectedWallet } = useWalletContext();

  const handleImport = async () => {
    const localWallet = createWalletInstance(props.localWallet) as LocalWallet;
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

    await localWallet.save({
      strategy: "encryptedJson",
      password,
    });

    setConnectedWallet(localWallet);
    setLocalWallet(localWallet);
    props.onConnect();
  };

  return (
    <>
      <LocalWalletModalHeader onBack={props.goBack} meta={meta} />
      <ModalTitle
        style={{
          textAlign: "left",
        }}
      >
        Import Wallet
      </ModalTitle>
      <Spacer y="md" />

      <ModalDescription>
        The application can authorize any transactions on behalf of the wallet
        without any approvals. We recommend only connecting to trusted
        applications.
      </ModalDescription>

      <Spacer y="lg" />

      <DragNDrop
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
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              error={isWrongPassword ? "Wrong Password" : ""}
            />
            <Spacer y="xl" />
          </>
        )}

        <FormFooter>
          <Button
            variant="inverted"
            type="submit"
            disabled={!jsonString}
            style={{
              minWidth: "110px",
              opacity: jsonString ? 1 : 0.5,
            }}
          >
            Import
          </Button>
        </FormFooter>
      </form>
    </>
  );
};
