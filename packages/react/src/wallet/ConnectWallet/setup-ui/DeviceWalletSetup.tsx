import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { Button } from "../../../components/buttons";
import {
  FormField,
  FormFieldWithIconButton,
} from "../../../components/formFields";
import { iconSize } from "../../../design-system";
import { DeviceWalletIcon } from "../icons/DeviceWalletIcon";
import {
  BackButton,
  ModalDescription,
  ModalTitle,
} from "../shared/modalElements";
import styled from "@emotion/styled";
import { blue } from "@radix-ui/colors";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useConnect, useDeviceWalletStorage } from "@thirdweb-dev/react-core";
import { DeviceBrowserWallet } from "@thirdweb-dev/wallets";
import { useEffect, useState } from "react";

export const ConnectToDeviceWallet: React.FC<{ onBack: () => void }> = (
  props,
) => {
  const deviceStorage = useDeviceWalletStorage();

  if (!deviceStorage) {
    return (
      <LoadingSpinnerContainer>
        <Spinner size="lg" color={blue.blue10} />
      </LoadingSpinnerContainer>
    );
  }

  const isDeviceWalletSaved = !!deviceStorage.address;

  const description = !isDeviceWalletSaved ? (
    <>
      Enter a password and we{`'`}ll create a wallet for you. You{`'`}ll be able
      to access this wallet with the same password.
    </>
  ) : null;

  return (
    <>
      <BackButton onClick={props.onBack} />
      <Spacer y="lg" />
      <DeviceWalletIcon width={iconSize.xl} height={iconSize.xl} />
      <Spacer y="md" />
      <ModalTitle>Device Wallet</ModalTitle>

      {description && (
        <>
          <Spacer y="md" />
          <ModalDescription>{description}</ModalDescription>
        </>
      )}

      <Spacer y="xl" />

      {!isDeviceWalletSaved ? (
        <CreateDeviceWallet />
      ) : (
        <ReconnectDeviceWallet />
      )}
    </>
  );
};

// for creating a new device wallet
export const CreateDeviceWallet = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const connect = useConnect();
  const passwordMismatch = confirmPassword && password !== confirmPassword;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        connect(DeviceBrowserWallet, {
          password,
        });
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
export const ReconnectDeviceWallet = () => {
  const deviceStorage = useDeviceWalletStorage();
  const [address, setAddress] = useState("Fetching...");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const connect = useConnect();
  const [isWrongPassword, setIsWrongPassword] = useState(false);

  useEffect(() => {
    if (deviceStorage?.address) {
      setAddress(deviceStorage.address);
    }
  }, [deviceStorage]);

  const handleSubmit = async () => {
    try {
      await connect(DeviceBrowserWallet, {
        password,
      });
    } catch (e) {
      setIsWrongPassword(true);
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
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
          value={address}
        />

        <Spacer y="lg" />

        {/* Password */}
        <FormFieldWithIconButton
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
