import { Spacer } from "../../../components/Spacer";
import { Button } from "../../../components/buttons";
import { Label } from "../../../components/formElements";
import { ModalDescription } from "../../../components/modalElements";
import { Theme, iconSize, spacing } from "../../../design-system";
import styled from "@emotion/styled";
import { fontSize } from "../../../design-system";
import {
  EyeClosedIcon,
  EyeOpenIcon,
  PinBottomIcon,
} from "@radix-ui/react-icons";
import { FormFieldWithIconButton } from "../../../components/formFields";
import { useEffect, useRef, useState } from "react";
import { shortenAddress } from "../../../evm/utils/addresses";
import { LocalWallet } from "@thirdweb-dev/wallets";
import type { WalletData } from "@thirdweb-dev/wallets/evm/wallets/local-wallet";
import { Spinner } from "../../../components/Spinner";
import {
  Container,
  Line,
  ModalHeader,
  ScreenBottomContainer,
} from "../../../components/basic";
import {
  useAddress,
  useCreateWalletInstance,
  useWallet,
} from "@thirdweb-dev/react-core";
import type { LocalWalletConfig } from "./types";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const ExportLocalWallet: React.FC<{
  onBack?: () => void;
  onExport: () => void;
  localWalletConfig: LocalWalletConfig;
  modalSize: "wide" | "compact";
}> = (props) => {
  const locale = useTWLocale().wallets.localWallet.exportWallet;
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [passwordIsRequired, setPasswordIsRequired] = useState(false);

  const wallet = useWallet();
  const address = useAddress();
  const [savedAddress, setSavedAddress] = useState("");
  const createWalletInstance = useCreateWalletInstance();

  // set savedAddress and passwordIsRequired on mount
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) {
      return;
    }
    mounted.current = true;

    (async () => {
      // if local wallet is connected - show the address of the connected wallet
      if (wallet && wallet instanceof LocalWallet) {
        if (address) {
          setSavedAddress(address);
        }

        // if walletData of it is not already saved - password is required
        const savedData = await wallet.getSavedData();
        if (savedData?.address !== address) {
          setPasswordIsRequired(true);
        }
      }

      // if localWallet is not connected - get address from storage, password is not required
      else {
        const localWallet = createWalletInstance(props.localWalletConfig);
        const data = await localWallet.getSavedData();
        if (data) {
          setSavedAddress(data.address);
        }
      }
    })();
  }, [
    wallet,
    props.localWalletConfig,
    createWalletInstance,
    password,
    address,
  ]);

  const exportFromLocalStorage = async () => {
    // if a local wallet is connected - export it
    if (wallet && wallet instanceof LocalWallet) {
      const savedData = await wallet.getSavedData();

      // if already saved - no password required
      if (savedData && savedData.address === address) {
        downloadJsonWalletFile(savedData.data);
        props.onExport();
      }

      // if not already saved - password is required
      else {
        try {
          const dataStr = await wallet.export({
            password,
            strategy: "encryptedJson",
          });
          downloadJsonWalletFile(dataStr);
          props.onExport();
        } catch (e) {
          console.error(e);
          setIsWrongPassword(true);
        }
      }
    }

    // if local wallet is not connected - get data from storage
    else {
      const localWallet = createWalletInstance(props.localWalletConfig);
      const savedData = (await localWallet.getSavedData()) as WalletData;
      downloadJsonWalletFile(savedData.data);
      props.onExport();
    }
  };

  if (!savedAddress) {
    return (
      <Container
        animate="fadein"
        flex="row"
        center="both"
        style={{
          height: "300px",
        }}
      >
        <Spinner size="md" color="accentText" />
      </Container>
    );
  }

  const exportDisabled = isWrongPassword;

  return (
    <Container fullHeight animate="fadein">
      <form
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          exportFromLocalStorage();
        }}
      >
        <Container p="lg">
          <ModalHeader onBack={props.onBack} title="Backup Wallet" />
        </Container>
        <Line />
        <Container expand p="lg">
          <ModalDescription>{locale.description1}</ModalDescription>

          <Spacer y="sm" />

          <ModalDescription>{locale.description2}</ModalDescription>

          <Spacer y="xl" />

          <Label>{locale.walletAddress}</Label>
          <Spacer y="sm" />

          <SavedWalletAddress>
            {shortenAddress(savedAddress)}
          </SavedWalletAddress>

          {passwordIsRequired && (
            <>
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
                dataTest="current-password"
              />
              <Spacer y="md" />
            </>
          )}
        </Container>

        <ScreenBottomContainer
          style={{
            borderTop: props.modalSize === "wide" ? "none" : undefined,
          }}
        >
          <Button
            disabled={exportDisabled}
            variant="accent"
            fullWidth
            style={{
              opacity: exportDisabled ? 0.5 : 1,
              display: "flex",
              gap: spacing.sm,
            }}
            type="submit"
          >
            <PinBottomIcon width={iconSize.sm} height={iconSize.sm} />
            {locale.download}
          </Button>
        </ScreenBottomContainer>
      </form>
    </Container>
  );
};

function downloadJsonWalletFile(data: string) {
  const dataObj = JSON.parse(data);
  const blob = new Blob([JSON.stringify(dataObj, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wallet.json";
  document.body.appendChild(a);
  a.style.display = "none";
  a.click();
  URL.revokeObjectURL(a.href);
}

const SavedWalletAddress = styled.p<{ theme?: Theme }>`
  font-size: ${fontSize.md};
  color: ${(props) => props.theme.colors.secondaryText};
  margin: 0;
`;
