import { Spacer } from "../../../../components/Spacer";
import { Button } from "../../../../components/buttons";
import { FormFooter, Label } from "../../../../components/formElements";
import {
  ModalTitle,
  ModalDescription,
} from "../../../../components/modalElements";
import { Theme, iconSize } from "../../../../design-system";
import styled from "@emotion/styled";
import { fontSize } from "../../../../design-system";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { FormFieldWithIconButton } from "../../../../components/formFields";
import { useEffect, useState } from "react";
import { shortenAddress } from "../../../../evm/utils/addresses";
import { LocalWallet } from "@thirdweb-dev/wallets";
import { GenericWalletIcon } from "../../icons/GenericWalletIcon";

export const ExportLocalWallet: React.FC<{
  onBack: () => void;
  onExport: () => void;
  localWallet: LocalWallet;
}> = (props) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    props.localWallet.getAddress().then((add) => {
      setAddress(add);
    });
  }, [props.localWallet]);

  const exportFromLocalStorage = async () => {
    if (!props.localWallet) {
      throw new Error("invalid state");
    }

    try {
      // await props.localWallet.import({
      //   encryptedJson: walletData.data,
      //   password,
      // });

      const json = await props.localWallet.export({
        strategy: "encryptedJson",
        password,
      });

      downloadAsFile(JSON.parse(json), "wallet.json", "application/json");
      props.onExport();
    } catch (e) {
      setIsWrongPassword(true);
      return;
    }
  };

  return (
    <>
      <GenericWalletIcon size={iconSize.xl} />
      <Spacer y="lg" />
      <ModalTitle
        style={{
          textAlign: "left",
        }}
      >
        Export Wallet
      </ModalTitle>

      <Spacer y="md" />

      <ModalDescription>
        This will download a JSON file containing your wallet information onto
        your device encrypted with the password.
      </ModalDescription>

      <Spacer y="xl" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          exportFromLocalStorage();
        }}
      >
        <Label>Wallet Address</Label>
        <Spacer y="sm" />

        <SavedWalletAddress>
          {address ? shortenAddress(address) : "Loading"}
        </SavedWalletAddress>

        <Spacer y="lg" />

        {/* Hidden Account Address as Username */}
        <input
          type="text"
          name="username"
          autoComplete="off"
          value={address}
          disabled
          style={{ display: "none" }}
        />

        {/* password */}
        <FormFieldWithIconButton
          noSave
          required
          name="current-password"
          autocomplete="current-password"
          id="current-password"
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

        <FormFooter>
          <Button disabled={isWrongPassword} variant="inverted" type="submit">
            Export
          </Button>
        </FormFooter>
      </form>
    </>
  );
};

function downloadAsFile(data: any, fileName: string, fileType: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: fileType,
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = "none";
  a.click();
  URL.revokeObjectURL(a.href);
}

const SavedWalletAddress = styled.p<{ theme?: Theme }>`
  font-size: ${fontSize.md};
  color: ${(props) => props.theme.text.secondary};
  margin: 0;
`;
