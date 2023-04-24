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
  useActiveChain,
  useConnect,
  useConnectionStatus,
  useThirdwebWallet,
  useWallet,
  WalletInstance,
} from "@thirdweb-dev/react-core";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { useSupportedWallet } from "@thirdweb-dev/react-core";
import {
  getAssociatedAccounts,
  AssociatedAccount,
  isAccountIdAvailable,
} from "@thirdweb-dev/wallets";
import { SmartWalletObj } from "../../../wallets/smartWallet";
import { Flex } from "../../../../components/basic";
import styled from "@emotion/styled";
import { useLocalWalletInfo } from "../LocalWallet/useLocalWalletInfo";

export const SmartWalletConnection: React.FC<{
  onBack: () => void;
  onConnect: () => void;
}> = (props) => {
  const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
  const [accounts, setAccounts] = useState<AssociatedAccount[] | undefined>();
  const { localWallet } = useLocalWalletInfo();
  const thirdwebWalletContext = useThirdwebWallet();
  const localWalletGenerated = useRef(false);
  const chain = useActiveChain();

  // initialize the localWallet from credentials or generate a new one
  useEffect(() => {
    if (!localWallet) {
      return;
    }

    (async () => {
      if (!localWalletGenerated.current) {
        const creds = await getCredentials();

        // generate a random one if no credentials are found
        if (!creds) {
          const address = await localWallet.generate();

          const privateKey = await localWallet.export({
            strategy: "privateKey",
            encryption: false,
          });

          // save the credentials
          await saveCredentials({
            password: privateKey,
            name: "Wallet",
            id: address,
          });
        }

        // import the private key from the credentials
        else {
          await localWallet.import({
            privateKey: creds.password,
            encryption: false,
          });
        }

        await localWallet.connect();
        thirdwebWalletContext?.handleWalletConnect(localWallet);
        localWalletGenerated.current = true;
      }
    })();
  }, [localWallet, thirdwebWalletContext]);

  // get the associated accounts
  useEffect(() => {
    if (!localWallet || !chain) {
      return;
    }

    (async () => {
      const _accounts = await getAssociatedAccounts(
        localWallet,
        walletObj.factoryAddress,
        chain,
      );
      setAccounts(_accounts);
    })();
  }, [localWallet, chain, walletObj.factoryAddress]);

  // loading state
  // we don't know whether the user has an account or not
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

  // no accounts found
  if (accounts.length === 0) {
    return <SmartWalletCreate {...props} />;
  }

  // accounts found
  return <ConnectToSmartWalletAccount {...props} accounts={accounts} />;
};

export const SmartWalletCreate: React.FC<{
  onBack: () => void;
  onConnect: () => void;
}> = (props) => {
  const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
  const activeWallet = useWallet();
  const connect = useConnect();

  const [userName, setUserName] = useState("");
  const [connectError, setConnectError] = useState(false);
  const connectionStatus = useConnectionStatus();

  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [switchError, setSwitchError] = useState(false);

  const deferredUserName = useDeferredValue(userName);
  const chain = useActiveChain();

  useEffect(() => {
    if (!chain) {
      return;
    }

    if (!deferredUserName) {
      setIsUsernameAvailable(false);
      return;
    }

    let isStale = false;

    async function checkAccountAvailable() {
      if (!chain) {
        return;
      }
      setIsValidating(true);
      const isAvailable = await isAccountIdAvailable(
        deferredUserName,
        walletObj.factoryAddress,
        chain,
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
  }, [deferredUserName, walletObj.factoryAddress, chain]);

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
