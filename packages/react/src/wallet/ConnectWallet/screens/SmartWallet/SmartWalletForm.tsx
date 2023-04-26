import { Img } from "../../../../components/Img";
import { Spacer } from "../../../../components/Spacer";
import { Spinner } from "../../../../components/Spinner";
import { Button } from "../../../../components/buttons";
import { FormFooter } from "../../../../components/formElements";
import { FormField } from "../../../../components/formFields";
import {
  BackButton,
  ModalDescription,
  ModalTitle,
} from "../../../../components/modalElements";
import { iconSize, fontSize, spacing } from "../../../../design-system";
import {
  useConnect,
  useConnectionStatus,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSupportedWallet } from "@thirdweb-dev/react-core";
import {
  LocalWallet,
  getAssociatedAccounts,
  isAccountIdAvailable,
} from "@thirdweb-dev/wallets";
import { isValidPrivateKey } from "@thirdweb-dev/wallets/evm/wallets/local-wallet";
import { SmartWalletObj } from "../../../wallets/smartWallet";
import { Flex } from "../../../../components/basic";
import { useLocalWalletInfo } from "../LocalWallet/useLocalWalletInfo";
import {
  UserCredentials,
  getCredentials,
  isCredentialsSupported,
  saveCredentials,
} from "../LocalWallet/credentials";
import { SecondaryText } from "../../../../components/text";
import { ImportLocalWallet } from "../LocalWallet/ImportLocalWallet";
import { Chain } from "@thirdweb-dev/chains";

export const SmartWalletConnection: React.FC<{
  onBack: () => void;
  onConnect: () => void;
  username: string;
}> = (props) => {
  if (!isCredentialsSupported) {
    return <p> Credential storage not supported </p>;
  }

  return <SmartWalletConnection_CredsWrapper {...props} />;
};

function useInitializeLocalWalletWithCreds() {
  const { localWallet, walletData } = useLocalWalletInfo();
  const thirdwebWalletContext = useThirdwebWallet();
  const localWalletInitialized = useRef(false);
  const gettingCreds = useRef(false);
  const [generatedRandom, setGeneratedRandom] = useState(false);

  // initialize the localWallet from credentials or generate a new one
  useEffect(() => {
    if (
      !localWallet ||
      localWalletInitialized.current ||
      !isCredentialsSupported
    ) {
      return;
    }

    (async () => {
      if (gettingCreds.current) {
        return;
      }

      let creds: UserCredentials | null = null;
      try {
        gettingCreds.current = true;
        creds = await getCredentials();
        gettingCreds.current = false;
      } catch (e) {
        console.log("failed to get creds");
        console.error(e);
      }

      // import the private key from the credentials
      if (creds && isValidPrivateKey(creds.password)) {
        setGeneratedRandom(false);
        await localWallet.import({
          privateKey: creds.password,
          encryption: false,
        });
      }

      // generate a random one if no credentials are found
      else {
        const address = await localWallet.generate();
        setGeneratedRandom(true);

        const privateKey = await localWallet.export({
          strategy: "privateKey",
          encryption: false,
        });

        // save the credentials
        const cred = await saveCredentials({
          password: privateKey,
          name: "Wallet",
          id: address,
        });

        if (!cred) {
          console.log("cred is not saved");
        }
      }

      await localWallet.connect();
      // thirdwebWalletContext?.handleWalletConnect(localWallet);
      localWalletInitialized.current = true;
    })();
  }, [localWallet, thirdwebWalletContext, walletData]);

  return { generatedRandom, localWallet };
}

const SmartWalletConnection_CredsWrapper: React.FC<{
  onBack: () => void;
  onConnect: () => void;
  username: string;
}> = (props) => {
  const { localWallet, generatedRandom } = useInitializeLocalWalletWithCreds();
  const chain = useThirdwebWallet()?.activeChain;

  if (!localWallet || !chain) {
    return (
      <Flex
        style={{
          height: "350px",
          alignItems: "center",
          gap: spacing.lg,
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {generatedRandom ? (
          <SecondaryText> Generating Wallet </SecondaryText>
        ) : (
          <SecondaryText> Connecting Wallet </SecondaryText>
        )}
        <Spinner size="lg" color="secondary" />
      </Flex>
    );
  }

  return (
    <SmartWalletConnection_Creds
      {...props}
      localWallet={localWallet}
      chain={chain}
    />
  );
};

export const SmartWalletConnection_Creds: React.FC<{
  onBack: () => void;
  onConnect: () => void;
  username: string;
  chain: Chain;
  localWallet: LocalWallet;
}> = (props) => {
  const { localWallet, chain } = props;
  const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
  const connect = useConnect();
  const [userName, setUserName] = useState(props.username);
  const userNameNow = useRef(userName);
  const connectionStatus = useConnectionStatus();
  const [canConnect, setCanConnect] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [validateOnMount, setValidateOnMount] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const isConnected = useRef(false);

  const handleConnect = useCallback(async () => {
    if (isConnected.current || isConnecting) {
      return;
    }

    setIsConnecting(true);

    try {
      await connect(walletObj, {
        accountId: userName,
        personalWallet: localWallet,
      });
      props.onConnect();
      isConnected.current = true;
    } catch (e) {
      console.error(e);
      setIsConnecting(false);
    }
  }, [connect, isConnecting, localWallet, props, userName, walletObj]);

  const handleUserNameChange = useCallback(
    async (name: string) => {
      if (!chain || !localWallet) {
        return;
      }
      setIsValidating(true);
      console.log("checking if available....");
      const isAvailable = await isAccountIdAvailable(
        name,
        walletObj.factoryAddress,
        chain,
      );

      // if username has since changed, ignore
      if (name !== userNameNow.current) {
        return;
      }

      if (isAvailable) {
        setIsValidating(false);
        setCanConnect(true);
        return true;
      } else {
        // this is slow
        const accounts = await getAssociatedAccounts(
          localWallet,
          walletObj.factoryAddress,
          chain,
        );

        // if username has since changed, ignore
        if (name !== userNameNow.current) {
          return;
        }

        const ownsAccount = accounts.some(
          (a) => a.accountId === userNameNow.current,
        );

        setIsValidating(false);
        setCanConnect(ownsAccount);
        return ownsAccount;
      }
    },
    [chain, localWallet, walletObj.factoryAddress],
  );

  useEffect(() => {
    if (!validateOnMount) {
      return;
    }

    setValidateOnMount(false);
    handleUserNameChange(props.username).then((_canConnect) => {
      if (_canConnect) {
        handleConnect();
      }
    });
  }, [validateOnMount, handleUserNameChange, props.username, handleConnect]);

  const showError = !isValidating && userName && !canConnect;
  const disableConnect = !userName || isValidating || !canConnect;

  if (showImport) {
    return (
      <ImportLocalWallet
        meta={walletObj.meta}
        onBack={() => {
          setShowImport(false);
        }}
        onConnected={() => {
          // reset state to show loading skeleton
          setValidateOnMount(true);
          setIsValidating(true);
          setShowImport(false);
        }}
      />
    );
  }

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

      <ModalTitle>Choose account</ModalTitle>
      <Spacer y="sm" />
      <ModalDescription>
        Connect your existing account or create a new one
      </ModalDescription>

      <Spacer y="xl" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleConnect();
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
              showError ? (
                <>
                  Username is not available <br />
                </>
              ) : undefined
            }
            autocomplete="on"
            onChange={(value) => {
              setUserName(value);
              userNameNow.current = value;
              handleUserNameChange(value);
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

        {showError && (
          <>
            <Spacer y="sm" />
            <SecondaryText
              style={{
                fontSize: fontSize.sm,
              }}
            >
              Choose a different username if you want to create a new account OR
              import the wallet that owns this username
            </SecondaryText>
          </>
        )}

        <Spacer y="xl" />

        <FormFooter>
          {showError && (
            <Button
              variant="inverted"
              type="button"
              onClick={() => {
                setShowImport(true);
              }}
            >
              Import wallet
            </Button>
          )}
          <Button
            variant="inverted"
            type="submit"
            disabled={disableConnect}
            style={{
              display: "flex",
              alignItems: "center",
              gap: spacing.sm,
              opacity: disableConnect ? 0.5 : 1,
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
