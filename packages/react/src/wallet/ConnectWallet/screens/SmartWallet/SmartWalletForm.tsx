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
  useChainId,
  // WalletInstance,
  useConnect,
  useConnectionStatus,
  useSupportedWallet,
  useWallet,
  WalletInstance,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { Steps } from "../Safe/Steps";
import {
  AssociatedAccount,
  getAssociatedAccounts,
} from "@thirdweb-dev/wallets";
import { SmartWalletObj } from "../../../wallets/smartWallet";
import { Flex } from "../../../../components/basic";
import styled from "@emotion/styled";

export const SmartWalletConnection: React.FC<{
  onBack: () => void;
  onConnect: () => void;
}> = (props) => {
  const walletObj = useSupportedWallet("SmartWallet") as SmartWalletObj;
  const activeWallet = useWallet();
  const [accounts, setAccounts] = useState<AssociatedAccount[] | undefined>();

  useEffect(() => {
    if (!activeWallet) {
      return;
    }

    (async () => {
      const _accounts = await getAssociatedAccounts(
        activeWallet,
        walletObj.factoryAddress,
        walletObj.chain,
      );
      setAccounts(_accounts);
    })();
  }, [activeWallet, walletObj.chain, walletObj.factoryAddress]);

  if (!accounts) {
    return (
      <Flex
        style={{
          height: "400px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner size="lg" color="secondary" />
      </Flex>
    );
  }

  if (accounts.length === 0) {
    return <SmartWalletCreate {...props} />;
  }

  return <ConnectToSmartWalletAccount {...props} accounts={accounts} />;
};

// TODO (sw) remove this in favor of gnosis flow
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

  const [switchError, setSwitchError] = useState(false);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);

  const handleSubmit = async () => {
    if (!activeWallet) {
      return;
    }
    setConnectError(false);

    try {
      await connect(walletObj, {
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

      <Spacer y="lg" />
      <Steps step={2} />

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
            errorMessage={undefined}
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

  const handleConnect = async () => {
    await connect(walletObj, {
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
              onClick={() => handleConnect()}
            >
              {account.account}
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
