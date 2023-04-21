import { Spacer } from "../../../../components/Spacer";
import { Button } from "../../../../components/buttons";
import { FormFieldWithIconButton } from "../../../../components/formFields";
import {
  HelperLink,
  ModalDescription,
  ModalTitle,
} from "../../../../components/modalElements";
import { Theme, fontSize, iconSize, spacing } from "../../../../design-system";
import {
  EyeClosedIcon,
  EyeOpenIcon,
  InfoCircledIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { useThirdwebWallet } from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import { useDeviceWalletInfo } from "./useDeviceWalletInfo";
import { ImportDeviceWalet } from "./ImportDeviceWallet";
import styled from "@emotion/styled";
import { DeviceWalletModalHeader } from "./common";
import { Flex } from "../../../../components/basic";
import { ToolTip } from "../../../../components/Tooltip";
import { isMobile } from "../../../../evm/utils/isMobile";
import {
  saveCredentials,
  isCredentialsSupported,
} from "@thirdweb-dev/react-core";
import { UserCredentials, getCredentials } from "@thirdweb-dev/react-core";
import { shortenAddress } from "../../../../evm/utils/addresses";
import { Label } from "../../../../components/formElements";
import { Spinner } from "../../../../components/Spinner";
import { ExportDeviceWallet } from "./ExportDeviceWallet";

type DeviceWalletScreenProps = {
  onConnected: () => void;
  onBack: () => void;
};

export const CreateDeviceWallet: React.FC<DeviceWalletScreenProps> = (
  props,
) => {
  if (isCredentialsSupported) {
    return <CreateDeviceWalletCredentials {...props} />;
  }
  return <CreateDeviceWalletNoCredentials {...props} />;
};

/**
 *
 * For Browsers that support credential storage
 */
export const CreateDeviceWalletCredentials: React.FC<
  DeviceWalletScreenProps
> = (props) => {
  const { deviceWallet } = useDeviceWalletInfo();
  const thirdwebWalletContext = useThirdwebWallet();
  const [showImportScreen, setShowImportScreen] = useState(false);
  const [showCreationScreen, setShowCreationScreen] = useState(false);
  const [savedCreds, setSavedCreds] = useState<
    UserCredentials | null | undefined
  >();
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    getCredentials().then((creds) => {
      setSavedCreds(creds);
    });
  }, []);

  if (showImportScreen) {
    return (
      <ImportDeviceWalet
        onConnected={props.onConnected}
        onBack={() => {
          setShowImportScreen(false);
        }}
      />
    );
  }

  if (showExport) {
    return (
      <ExportDeviceWallet
        onBack={() => {
          setShowExport(false);
        }}
        onExport={() => {
          setShowExport(false);
        }}
      />
    );
  }

  const createNewWallet = async () => {
    if (!deviceWallet || !thirdwebWalletContext) {
      throw new Error("Invalid state");
    }

    const address = await deviceWallet.generate();
    deviceWallet.connect();

    const privateKey = await deviceWallet.export({
      strategy: "privateKey",
      encryption: false,
    });

    await saveCredentials({
      id: address,
      name: "Wallet",
      password: privateKey,
    });

    thirdwebWalletContext.handleWalletConnect(deviceWallet);
    props.onConnected();
  };

  if (showCreationScreen || savedCreds === null) {
    return (
      <>
        <DeviceWalletModalHeader onBack={props.onBack} />
        <ModalTitle>Device Wallet</ModalTitle>

        <Spacer y="md" />

        {savedCreds ? (
          <>
            <WarningContainer>
              {/* <InfoCircledIconDanger width={iconSize.sm} height={iconSize.sm} /> */}
              Creating a new wallet will delete your saved wallet
              <Button
                variant="link"
                style={{
                  padding: 0,
                  display: "inline",
                  fontWeight: "inherit",
                }}
                onClick={() => {
                  setShowExport(true);
                }}
              >
                Export saved wallet
              </Button>{" "}
              before creating a new one
            </WarningContainer>
          </>
        ) : (
          <ModalDescription>
            Create a new wallet or import an existing one.
          </ModalDescription>
        )}

        <Spacer y="lg" />

        <Button
          variant="inverted"
          onClick={createNewWallet}
          style={{
            width: "100%",
          }}
        >
          Create new wallet
        </Button>

        <Spacer y="xl" />

        <TextDivider>
          <span>OR</span>
        </TextDivider>

        <Spacer y="lg" />

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
          Import a JSON wallet
        </HelperLink>
      </>
    );
  }

  // loading creds
  if (savedCreds === undefined) {
    return (
      <Flex
        style={{
          height: "400px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner size="md" color="secondary" />
      </Flex>
    );
  }

  const connectToSaved = async () => {
    if (!deviceWallet || !thirdwebWalletContext) {
      throw new Error("Invalid state");
    }

    await deviceWallet.import({
      privateKey: savedCreds.password,
      encryption: false,
    });

    await deviceWallet.connect();
    thirdwebWalletContext.handleWalletConnect(deviceWallet);
    props.onConnected();
  };

  return (
    <>
      <DeviceWalletModalHeader onBack={props.onBack} />

      <Flex alignItems="center" gap="xs">
        <ModalTitle>Device Wallet</ModalTitle>
        {!isMobile() && (
          <ToolTip
            tip="The application can authorize any transactions on behalf of the wallet
          without any approvals. We recommend only connecting to trusted
          applications."
          >
            <InfoCircledIconSecondary
              width={iconSize.md}
              height={iconSize.md}
            />
          </ToolTip>
        )}
      </Flex>

      <Spacer y="sm" />

      <ModalDescription sm>
        Connect to saved wallet or create a new one
      </ModalDescription>
      <Spacer y="lg" />

      <Label>Saved Wallet</Label>
      <Spacer y="sm" />
      <AccountButton
        variant="secondary"
        style={{
          width: "100%",
          textAlign: "left",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        onClick={connectToSaved}
      >
        {shortenAddress(savedCreds.id)}
        <ChevronRightIcon
          style={{
            marginLeft: "auto",
          }}
        />
      </AccountButton>

      <Spacer y="xl" />

      <HelperLink
        as="button"
        onClick={() => {
          setShowCreationScreen(true);
        }}
        style={{
          textAlign: "center",
          width: "100%",
        }}
      >
        Create new wallet
      </HelperLink>
    </>
  );
};

/**
 * For Browsers that don't support Credential Storage
 */
export const CreateDeviceWalletNoCredentials: React.FC<
  DeviceWalletScreenProps
> = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordMismatch = confirmPassword && password !== confirmPassword;

  const { deviceWallet } = useDeviceWalletInfo();
  const thirdwebWalletContext = useThirdwebWallet();
  const [showImportScreen, setShowImportScreen] = useState(false);

  const [generatedAddress, setGeneratedAddress] = useState<string | null>(null);
  const isGenerated = useRef(false);

  useEffect(() => {
    if (!deviceWallet || showImportScreen) {
      return;
    }
    isGenerated.current = true;
    deviceWallet.generate().then((_address) => {
      setGeneratedAddress(_address);
    });
  }, [deviceWallet, showImportScreen]);

  if (showImportScreen) {
    return (
      <ImportDeviceWalet
        onConnected={props.onConnected}
        onBack={() => {
          setShowImportScreen(false);
        }}
      />
    );
  }

  const handleConnect = async () => {
    if (passwordMismatch || !deviceWallet || !thirdwebWalletContext) {
      throw new Error("Invalid state");
    }

    deviceWallet.connect();

    await deviceWallet.save({
      strategy: "encryptedJson",
      password,
    });

    thirdwebWalletContext.handleWalletConnect(deviceWallet);
    props.onConnected();
  };

  return (
    <>
      <DeviceWalletModalHeader onBack={props.onBack} />

      <Flex alignItems="center" gap="xs">
        <ModalTitle>Choose a password</ModalTitle>
        {!isMobile() && (
          <ToolTip
            tip="The application can authorize any transactions on behalf of the wallet
          without any approvals. We recommend only connecting to trusted
          applications."
          >
            <InfoCircledIconSecondary
              width={iconSize.md}
              height={iconSize.md}
            />
          </ToolTip>
        )}
      </Flex>

      <Spacer y="sm" />

      <ModalDescription sm>
        Enter a password and we{`'`}ll create a wallet for you. You{`'`}ll be
        able to access and export this wallet with the same password.
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

        <Button
          variant="inverted"
          type="submit"
          style={{
            width: "100%",
          }}
        >
          Create Wallet
        </Button>
      </form>

      <Spacer y="xxl" />

      <TextDivider>
        <span>OR</span>
      </TextDivider>

      <Spacer y="lg" />

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
        Import a JSON wallet
      </HelperLink>
    </>
  );
};

const TextDivider = styled.div<{ theme?: Theme }>`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.text.secondary};
  font-size: ${fontSize.sm};
  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid ${(p) => p.theme.bg.highlighted};
  }

  span {
    margin: 0 1rem;
  }
`;

const InfoCircledIconSecondary = styled(InfoCircledIcon)<{ theme?: Theme }>`
  color: ${(p) => p.theme.text.secondary};
`;

// const InfoCircledIconDanger = styled(InfoCircledIcon)<{ theme?: Theme }>`
//   color: ${(p) => p.theme.text.danger};
//   flex-shrink: 0;
// `;

const AccountButton = styled(Button)<{ theme?: Theme }>`
  &:hover {
    background-color: ${(p) => p.theme.bg.elevatedHover};
  }
`;

const WarningContainer = styled.div<{ theme?: Theme }>`
  /* display: flex; */
  /* align-items: center; */
  /* gap: ${spacing.sm}; */
  font-size: ${fontSize.md};
  line-height: 1.5;
  color: ${(p) => p.theme.text.secondary};
`;
