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
import { useLocalWalletInfo } from "./useLocalWalletInfo";
import { ImportLocalWallet } from "./ImportLocalWallet";
import styled from "@emotion/styled";
import { LocalWalletModalHeader } from "./common";
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
import { ExportLocalWallet } from "./ExportLocalWallet";
import { localWallet } from "../../../..";

type LocalWalletScreenProps = {
  onConnected: () => void;
  onBack: () => void;
};

export const CreateLocalWallet: React.FC<LocalWalletScreenProps> = (props) => {
  if (isCredentialsSupported) {
    return <CreateLocalWalletCredentials {...props} />;
  }
  return <CreateLocalWalletNoCredentials {...props} />;
};

/**
 *
 * For Browsers that support credential storage
 */
export const CreateLocalWalletCredentials: React.FC<LocalWalletScreenProps> = (
  props,
) => {
  const { localWallet } = useLocalWalletInfo();
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
      <ImportLocalWallet
        onConnected={props.onConnected}
        onBack={() => {
          setShowImportScreen(false);
        }}
      />
    );
  }

  if (showExport) {
    return (
      <ExportLocalWallet
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
    if (!localWallet || !thirdwebWalletContext) {
      throw new Error("Invalid state");
    }

    const address = await localWallet.generate();
    localWallet.connect();

    const privateKey = await localWallet.export({
      strategy: "privateKey",
      encryption: false,
    });

    await saveCredentials({
      id: address,
      name: "Wallet",
      password: privateKey,
    });

    thirdwebWalletContext.handleWalletConnect(localWallet);
    props.onConnected();
  };

  if (showCreationScreen || savedCreds === null) {
    return (
      <>
        <LocalWalletModalHeader onBack={props.onBack} />
        <ModalTitle>Local Wallet</ModalTitle>

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
    if (!localWallet || !thirdwebWalletContext) {
      throw new Error("Invalid state");
    }

    await localWallet.import({
      privateKey: savedCreds.password,
      encryption: false,
    });

    await localWallet.connect();
    thirdwebWalletContext.handleWalletConnect(localWallet);
    props.onConnected();
  };

  return (
    <>
      <LocalWalletModalHeader onBack={props.onBack} />

      <Flex alignItems="center" gap="xs">
        <ModalTitle>Local Wallet</ModalTitle>
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
export const CreateLocalWalletNoCredentials: React.FC<
  LocalWalletScreenProps
> = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordMismatch = confirmPassword && password !== confirmPassword;

  const { localWallet } = useLocalWalletInfo();
  const thirdwebWalletContext = useThirdwebWallet();
  const [showImportScreen, setShowImportScreen] = useState(false);

  const [generatedAddress, setGeneratedAddress] = useState<string | null>(null);
  const isGenerated = useRef(false);

  useEffect(() => {
    if (!localWallet || showImportScreen) {
      return;
    }
    isGenerated.current = true;
    localWallet.generate().then((_address) => {
      setGeneratedAddress(_address);
    });
  }, [localWallet, showImportScreen]);

  if (showImportScreen) {
    return (
      <ImportLocalWallet
        onConnected={props.onConnected}
        onBack={() => {
          setShowImportScreen(false);
        }}
      />
    );
  }

  const handleConnect = async () => {
    if (passwordMismatch || !localWallet || !thirdwebWalletContext) {
      throw new Error("Invalid state");
    }

    localWallet.connect();

    await localWallet.save({
      strategy: "encryptedJson",
      password,
    });

    thirdwebWalletContext.handleWalletConnect(localWallet);
    props.onConnected();
  };

  return (
    <>
      <LocalWalletModalHeader onBack={props.onBack} />

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

const AccountButton = styled(Button)<{ theme?: Theme }>`
  &:hover {
    background-color: ${(p) => p.theme.bg.elevatedHover};
  }
`;

const WarningContainer = styled.div<{ theme?: Theme }>`
  font-size: ${fontSize.md};
  line-height: 1.5;
  color: ${(p) => p.theme.text.secondary};
`;
