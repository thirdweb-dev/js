import { Spacer } from "../../../../components/Spacer";
import { Button } from "../../../../components/buttons";
import { FormFooter, Label } from "../../../../components/formElements";
import {
  ModalTitle,
  ModalDescription,
} from "../../../../components/modalElements";
import { LocalWalletModalHeader } from "./common";
import { Theme } from "../../../../design-system";
import styled from "@emotion/styled";
import { fontSize } from "../../../../design-system";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { FormFieldWithIconButton } from "../../../../components/formFields";
import { useState } from "react";
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import { isMobile } from "../../../../evm/utils/isMobile";
import { shortenAddress } from "../../../../evm/utils/addresses";

export const ExportLocalWallet: React.FC<{
  onBack: () => void;
  onExport: () => void;
}> = (props) => {
  const { localWallet, walletData } = useLocalWalletInfo();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);

  const handleLocalWalletExport = async () => {
    if (!walletData || !localWallet) {
      throw new Error("invalid state");
    }

    try {
      await localWallet.import({
        encryptedJson: walletData.data,
        password,
      });

      const json = await localWallet.export({
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
      <LocalWalletModalHeader onBack={props.onBack} />
      <ModalTitle
        style={{
          textAlign: "left",
        }}
      >
        Export Wallet
      </ModalTitle>

      <Spacer y="md" />

      <ModalDescription sm>
        This will download a JSON file containing your wallet information onto
        your device encrypted with the password.
      </ModalDescription>

      <Spacer y="xl" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLocalWalletExport();
        }}
      >
        <Label>Wallet Address</Label>
        <Spacer y="sm" />

        <SavedWalletAddress>
          {(isMobile()
            ? shortenAddress(walletData?.address || "")
            : walletData?.address) || "Fetching..."}
        </SavedWalletAddress>

        <Spacer y="lg" />

        {/* Hidden Account Address as Username */}
        <input
          type="text"
          name="username"
          autoComplete="off"
          value={walletData?.address || ""}
          disabled
          style={{ display: "none" }}
        />

        {/* password */}
        <FormFieldWithIconButton
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
