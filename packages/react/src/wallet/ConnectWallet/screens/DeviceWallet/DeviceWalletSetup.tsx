import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import { Spinner } from "../../../../components/Spinner";
import { Button } from "../../../../components/buttons";
import {
  FormField,
  FormFieldWithIconButton,
} from "../../../../components/formFields";
import {
  BackButton,
  ModalDescription,
  ModalTitle,
} from "../../../../components/modalElements";
import { iconSize, media, spacing } from "../../../../design-system";
import styled from "@emotion/styled";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import {
  useCreateWalletInstance,
  useSupportedWallet,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { Wallet } from "@thirdweb-dev/react-core";
import type { DeviceWallet } from "@thirdweb-dev/wallets";
import { WalletData } from "@thirdweb-dev/wallets/src/evm/wallets/device-wallet";

function useDeviceWalletInfo() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const createWalletInstance = useCreateWalletInstance();
  const deviceWalletObj = useSupportedWallet("deviceWallet") as Wallet;
  const [deviceWallet, setDeviceWallet] = useState<DeviceWallet | null>(null);
  const [storageLoading, setStorageLoading] = useState(false);

  useEffect(() => {
    const wallet = createWalletInstance(deviceWalletObj) as DeviceWallet;
    setDeviceWallet(wallet);
    wallet.getSavedData().then((data) => {
      setStorageLoading(false);
      setWalletData(data);
    });
  }, [createWalletInstance, deviceWalletObj]);

  return {
    deviceWallet,
    storageLoading,
    walletData,
    meta: deviceWalletObj.meta,
  };
}

export const ConnectToDeviceWallet: React.FC<{
  onBack: () => void;
  onConnected: () => void;
}> = (props) => {
  const { meta, storageLoading, walletData } = useDeviceWalletInfo();

  if (storageLoading) {
    return (
      <LoadingSpinnerContainer>
        <Spinner size="lg" color="primary" />
      </LoadingSpinnerContainer>
    );
  }

  const description = !walletData ? (
    <>
      Enter a password and we{`'`}ll create a wallet for you. You{`'`}ll be able
      to access this wallet with the same password.
    </>
  ) : null;

  return (
    <>
      <BackButton onClick={props.onBack} />
      <IconContainer>
        <Img src={meta.iconURL} width={iconSize.xl} height={iconSize.xl} />
      </IconContainer>
      <Spacer y="md" />
      <ModalTitle>{meta.name}</ModalTitle>

      {description && (
        <>
          <Spacer y="md" />
          <ModalDescription>{description}</ModalDescription>
        </>
      )}

      <Spacer y="xl" />

      {!walletData ? (
        <CreateDeviceWallet onConnected={props.onConnected} />
      ) : (
        <ReconnectDeviceWallet onConnected={props.onConnected} />
      )}
    </>
  );
};

// for creating a new device wallet
export const CreateDeviceWallet: React.FC<{
  onConnected: () => void;
}> = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordMismatch = confirmPassword && password !== confirmPassword;
  const { deviceWallet } = useDeviceWalletInfo();
  const thirdwebWalletContext = useThirdwebWallet();

  const handleConnect = async () => {
    if (passwordMismatch || !deviceWallet || !thirdwebWalletContext) {
      throw new Error("Invalid state");
    }

    await deviceWallet.generate();
    deviceWallet.connect();

    await deviceWallet.save({
      strategy: "encryptedJson",
      password,
    });

    thirdwebWalletContext.handleWalletConnect(deviceWallet);

    props.onConnected();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleConnect();
      }}
    >
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
        autocomplete="current-password"
        id="current-password"
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

      <FormFooter>
        <Button variant="inverted" type="submit">
          Connect
        </Button>
      </FormFooter>
    </form>
  );
};

// for connecting to an existing device wallet
export const ReconnectDeviceWallet: React.FC<{
  onConnected: () => void;
}> = (props) => {
  const { walletData, deviceWallet } = useDeviceWalletInfo();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const thirdwebWalletContext = useThirdwebWallet();

  const handleReconnect = async () => {
    if (!deviceWallet || !thirdwebWalletContext) {
      throw new Error("Invalid state");
    }
    try {
      await deviceWallet.load({
        strategy: "encryptedJson",
        password,
      });

      await deviceWallet.connect();
      thirdwebWalletContext.handleWalletConnect(deviceWallet);

      props.onConnected();
    } catch (e) {
      setIsWrongPassword(true);
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleReconnect();
        }}
      >
        {/* Address */}
        <FormField
          autocomplete="off"
          name="account-address"
          id="account-address"
          onChange={() => {}}
          label="Wallet Address"
          type="text"
          value={walletData?.address || "Fetching..."}
        />

        <Spacer y="lg" />

        {/* Password */}
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

        {/* Connect Button */}
        <FormFooter>
          <Button variant="inverted" type="submit">
            Connect
          </Button>
        </FormFooter>
      </form>
    </>
  );
};

const LoadingSpinnerContainer = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const IconContainer = styled.div`
  display: flex;
  margin-top: ${spacing.lg};
  ${media.mobile} {
    justify-content: center;
    margin-top: 0;
  }
`;
