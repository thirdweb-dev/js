import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import { Spinner } from "../../../../components/Spinner";
import { Button } from "../../../../components/buttons";
import { ErrorMessage, FormFooter } from "../../../../components/formElements";
import { FormField } from "../../../../components/formFields";
import {
  BackButton,
  ModalDescription,
  ModalTitle,
} from "../../../../components/modalElements";
import {
  iconSize,
  fontSize,
  Theme,
  spacing,
  radius,
} from "../../../../design-system";
import { CaretRightIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  getCredentials,
  saveCredentials,
  useChainId,
  useConnect,
  useConnectionStatus,
  useThirdwebWallet,
  useWallet,
  WalletInstance,
} from "@thirdweb-dev/react-core";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { useSupportedWallet } from "../useSupportedWallet";
import {
  getAssociatedAccounts,
  AssociatedAccount,
  isAccountIdAvailable,
} from "@thirdweb-dev/wallets";
import { SmartWalletObj } from "../../../wallets/smartWallet";
import { Flex } from "../../../../components/basic";
import styled from "@emotion/styled";
import { useDeviceWalletInfo } from "../DeviceWallet/useDeviceWalletInfo";

export const SmartWalletConnection: React.FC<{
  onBack: () => void;
  onConnect: () => void;
}> = (props) => {
  const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
  const [accounts, setAccounts] = useState<AssociatedAccount[] | undefined>();
  const { deviceWallet } = useDeviceWalletInfo();
  const thirdwebWalletContext = useThirdwebWallet();
  const deviceWalletGenerated = useRef(false);

  useEffect(() => {
    if (!deviceWallet) {
      return;
    }

    (async () => {
      if (!deviceWalletGenerated.current) {
        const creds = await getCredentials();

        // generate a random one if no credentials are found
        if (!creds) {
          const address = await deviceWallet.generate();

          const privateKey = await deviceWallet.export({
            strategy: "privateKey",
            encryption: false,
          });

          // save the credentials
          await saveCredentials({
            password: privateKey,
            name: "Wallet",
            id: address,
          });
        } else {
          // import
          await deviceWallet.import({
            privateKey: creds.password,
            encryption: false,
          });
        }

        await deviceWallet.connect();
        thirdwebWalletContext?.handleWalletConnect(deviceWallet);
        deviceWalletGenerated.current = true;
      }

      const _accounts = await getAssociatedAccounts(
        deviceWallet,
        walletObj.factoryAddress,
        walletObj.chain,
      );
      setAccounts(_accounts);
    })();
  }, [
    deviceWallet,
    thirdwebWalletContext,
    walletObj.chain,
    walletObj.factoryAddress,
  ]);

  if (!accounts) {
    return (
      <>
        <Flex
          style={{
            height: "350px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner size="lg" color="secondary" />
        </Flex>
      </>
    );
  }

  if (accounts.length === 0) {
    return <SmartWalletCreate {...props} />;
  }

  return <ConnectToSmartWalletAccount {...props} accounts={accounts} />;
};

export const SmartWalletCreate: React.FC<{
  onBack: () => void;
  onConnect: () => void;
}> = (props) => {
  const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
  const activeWallet = useWallet();
  const connect = useConnect();
  const chainId = useChainId();

  const [userName, setUserName] = useState("");
  const [connectError, setConnectError] = useState(false);
  const connectionStatus = useConnectionStatus();

  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [switchError, setSwitchError] = useState(false);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);

  const deferredUserName = useDeferredValue(userName);

  useEffect(() => {
    if (!deferredUserName) {
      setIsUsernameAvailable(false);
      return;
    }

    let isStale = false;

    async function checkAccountAvailable() {
      setIsValidating(true);
      const isAvailable = await isAccountIdAvailable(
        deferredUserName,
        walletObj.factoryAddress,
        walletObj.chain,
      );
      if (isStale) {
        return;
      }
      setIsUsernameAvailable(isAvailable);
      setIsValidating(false);
    }

    checkAccountAvailable();
    return () => {
      isStale = true;
    };
  }, [deferredUserName, walletObj.factoryAddress, walletObj.chain]);

  const handleSubmit = async () => {
    if (!activeWallet) {
      return;
    }
    setConnectError(false);

    try {
      await connect(walletObj, {
        accountId: userName,
        personalWallet: activeWallet,
      });
      props.onConnect();
    } catch (e) {
      console.error(e);
      setConnectError(true);
    }
  };

  const mismatch = chainId !== walletObj.chain.chainId;

  return (
    <>
      <BackButton onClick={props.onBack} />
      <Spacer y="md" />
      <Img
        src={walletObj.meta.iconURL}
        width={iconSize.xl}
        height={iconSize.xl}
      />
      <Spacer y="lg" />

      <ModalTitle>Create account</ModalTitle>
      <Spacer y="sm" />
      <ModalDescription>
        Create your account by choosing a unique username
      </ModalDescription>

      <Spacer y="xl" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/*  User Name */}
        <div
          style={{
            position: "relative",
          }}
        >
          <FormField
            name="accountId"
            id="accountId"
            errorMessage={
              !isValidating && userName && !isUsernameAvailable
                ? "Username not available"
                : undefined
            }
            autocomplete="on"
            onChange={(value) => {
              setSwitchError(false);
              setConnectError(false);
              setUserName(value);
            }}
            label="Username"
            type="text"
            value={userName}
            required
          />

          {isValidating && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: spacing.md,
              }}
            >
              <Spinner size="sm" color="link" />
            </div>
          )}
        </div>

        <Spacer y="sm" />

        {connectError && (
          <ErrorMessage
            style={{
              display: "flex",
              gap: spacing.sm,
              alignItems: "center",
              fontSize: fontSize.sm,
            }}
          >
            <ExclamationTriangleIcon width={iconSize.sm} height={iconSize.sm} />
            <span>
              Could not connect to Smart Wallet <br />
            </span>
          </ErrorMessage>
        )}

        {switchError && (
          <ErrorMessage
            style={{
              display: "flex",
              gap: spacing.sm,
              alignItems: "center",
              fontSize: fontSize.sm,
            }}
          >
            <ExclamationTriangleIcon width={iconSize.sm} height={iconSize.sm} />
            <span>Failed to switch network.</span>
          </ErrorMessage>
        )}

        <Spacer y="xl" />

        <FormFooter>
          {mismatch ? (
            <Button
              type="button"
              variant="secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.sm,
              }}
              onClick={async () => {
                setConnectError(false);
                setSwitchError(false);
                setSwitchingNetwork(true);

                if (!activeWallet) {
                  throw new Error("No active wallet");
                }

                try {
                  await activeWallet.switchChain(walletObj.chain.chainId);
                } catch (e) {
                  console.error(e);
                  setSwitchError(true);
                } finally {
                  setSwitchingNetwork(false);
                }
              }}
            >
              {" "}
              {switchingNetwork ? "Switching" : "Switch Network"}
              {switchingNetwork && <Spinner size="sm" color="primary" />}
            </Button>
          ) : (
            <Button
              variant="inverted"
              type="submit"
              disabled={isValidating || !isUsernameAvailable}
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              {connectionStatus === "connecting" ? "Connecting" : "Connect"}
              {connectionStatus === "connecting" && (
                <Spinner size="sm" color="inverted" />
              )}
            </Button>
          )}
        </FormFooter>
      </form>
    </>
  );
};

export const ConnectToSmartWalletAccount: React.FC<{
  onBack: () => void;
  onConnect: () => void;
  accounts: AssociatedAccount[];
}> = (props) => {
  const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
  const connect = useConnect();
  const activeWallet = useWallet() as WalletInstance;
  const [showCreateScreen, setShowCreateScreen] = useState(false);

  if (showCreateScreen) {
    return (
      <SmartWalletCreate
        onBack={() => {
          setShowCreateScreen(false);
        }}
        onConnect={props.onConnect}
      />
    );
  }

  const handleConnect = async (account: AssociatedAccount) => {
    await connect(walletObj, {
      accountId: account.accountId,
      personalWallet: activeWallet,
    });
    props.onConnect();
  };

  return (
    <>
      <BackButton onClick={props.onBack} />
      <Spacer y="md" />
      <Img
        src={walletObj.meta.iconURL}
        width={iconSize.xl}
        height={iconSize.xl}
      />
      <Spacer y="lg" />
      <ModalTitle> Choose your account </ModalTitle>
      <Spacer y="sm" />
      <ModalDescription>
        Connect to an existing account or create a new one
      </ModalDescription>
      <Spacer y="xl" />
      <Flex gap="sm" flexDirection="column">
        {props.accounts.map((account) => {
          return (
            <AccountButton
              key={account.account}
              onClick={() => handleConnect(account)}
            >
              {account.accountId}
              <CaretRightIcon width={iconSize.md} height={iconSize.md} />
            </AccountButton>
          );
        })}
      </Flex>

      <Spacer y="lg" />
      <Button
        onClick={() => {
          setShowCreateScreen(true);
        }}
        variant="link"
        style={{
          textAlign: "center",
          width: "100%",
        }}
      >
        Create a new account
      </Button>
    </>
  );
};

const AccountButton = styled.button<{ theme?: Theme }>`
  padding: ${spacing.md};
  border: none;
  border-radius: ${radius.md};
  background: ${({ theme }) => theme.bg.elevated};
  text-align: left;
  font-size: ${fontSize.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    background: ${({ theme }) => theme.bg.elevatedHover};
  }
`;
