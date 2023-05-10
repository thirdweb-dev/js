import { Spacer } from "../../../components/Spacer";
import { Button } from "../../../components/buttons";
import { FormFooter, Label } from "../../../components/formElements";
import {
  ModalTitle,
  ModalDescription,
} from "../../../components/modalElements";
import { Theme, iconSize } from "../../../design-system";
import styled from "@emotion/styled";
import { fontSize } from "../../../design-system";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { FormFieldWithIconButton } from "../../../components/formFields";
import { useEffect, useState } from "react";
import { shortenAddress } from "../../../evm/utils/addresses";
import type { LocalWallet } from "@thirdweb-dev/wallets";
import type { WalletData } from "@thirdweb-dev/wallets/evm/wallets/local-wallet";
import { Img } from "../../../components/Img";
import { Spinner } from "../../../components/Spinner";
import { Flex } from "../../../components/basic";

const localWalletIcon =
  "ipfs://QmbQzSNGvmNYZzem9jZRuYeLe9K2W4pqbdnVUp7Y6edQ8Y/local-wallet.svg";

export const ExportLocalWallet: React.FC<{
  onBack: () => void;
  onExport: () => void;
  localWallet: LocalWallet;
}> = (props) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [address, setAddress] = useState("");
  const [savedData, setSavedData] = useState<WalletData | null | "loading">(
    "loading",
  );

  useEffect(() => {
    props.localWallet.getAddress().then((add) => {
      setAddress(add);
    });
  }, [props.localWallet]);

  useEffect(() => {
    if (!address) {
      return;
    }
    props.localWallet.getSavedData().then((data) => {
      if (data) {
        if (data.address === address) {
          setSavedData(data);
        } else {
          setSavedData(null);
        }
      } else {
        setSavedData(null);
      }
    });
  }, [props.localWallet, address]);

  const exportFromLocalStorage = async () => {
    if (!props.localWallet || savedData === "loading") {
      throw new Error("invalid state");
    }

    if (savedData) {
      downloadAsFile(
        JSON.parse(savedData.data),
        "wallet.json",
        "application/json",
      );
      props.onExport();
    } else {
      try {
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
    }
  };

  if (savedData === "loading") {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        style={{
          height: "300px",
        }}
      >
        <Spinner size="md" color="link" />
      </Flex>
    );
  }

  const disabled = isWrongPassword;

  return (
    <>
      <Img src={localWalletIcon} width={iconSize.xl} height={iconSize.xl} />
      <Spacer y="lg" />
      <ModalTitle
        style={{
          textAlign: "left",
        }}
      >
        Backup Wallet
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

        {!savedData && (
          <>
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
          </>
        )}

        <FormFooter>
          <Button
            disabled={disabled}
            variant="inverted"
            style={{
              opacity: disabled ? 0.5 : 1,
            }}
            type="submit"
          >
            Backup
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
