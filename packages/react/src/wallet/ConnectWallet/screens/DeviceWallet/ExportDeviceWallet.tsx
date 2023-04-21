import { Spacer } from "../../../../components/Spacer";
import { Button } from "../../../../components/buttons";
import { FormFooter, Label } from "../../../../components/formElements";
import {
  ModalTitle,
  ModalDescription,
} from "../../../../components/modalElements";
import { DeviceWalletModalHeader } from "./common";
import { Theme } from "../../../../design-system";
import styled from "@emotion/styled";
import { fontSize } from "../../../../design-system";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { FormFieldWithIconButton } from "../../../../components/formFields";
import { useEffect, useState } from "react";
import { useDeviceWalletInfo } from "./useDeviceWalletInfo";
import { isMobile } from "../../../../evm/utils/isMobile";
import { shortenAddress } from "../../../../evm/utils/addresses";
import {
  getCredentials,
  isCredentialsSupported,
} from "@thirdweb-dev/react-core";

export const ExportDeviceWallet: React.FC<{
  onBack: () => void;
  onExport: () => void;
}> = (props) => {
  const { deviceWallet, walletData } = useDeviceWalletInfo();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [address, setAddress] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isCredentialsSupported) {
      getCredentials().then((cred) => {
        if (cred) {
          setAddress(cred.id);
        }
      });
    } else {
      setAddress(walletData?.address);
    }
  }, [walletData?.address]);

  const exportFromLocalStorage = async () => {
    if (!walletData || !deviceWallet) {
      throw new Error("invalid state");
    }

    try {
      await deviceWallet.import({
        encryptedJson: walletData.data,
        password,
      });

      const json = await deviceWallet.export({
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

  const exportFromCredentials = async () => {
    if (!deviceWallet) {
      throw new Error("invalid state");
    }

    try {
      const creds = await getCredentials();
      if (!creds) {
        throw new Error("No credentials found");
      }

      await deviceWallet.import({
        privateKey: creds?.password,
        encryption: false,
      });

      const json = await deviceWallet.export({
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
      <DeviceWalletModalHeader onBack={props.onBack} />
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
          if (isCredentialsSupported) {
            exportFromCredentials();
          } else {
            exportFromLocalStorage();
          }
        }}
      >
        <Label>Wallet Address</Label>
        <Spacer y="sm" />

        <SavedWalletAddress>
          {(isMobile() ? shortenAddress(address || "") : address) ||
            "Fetching..."}
        </SavedWalletAddress>

        <Spacer y="lg" />

        {/* Hidden Account Address as Username */}
        <input
          type="text"
          name="username"
          autoComplete="off"
          value={address || ""}
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
