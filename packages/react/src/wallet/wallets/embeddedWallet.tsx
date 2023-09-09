import {
  ConnectUIProps,
  SelectUIProps,
  WalletConfig,
  WalletOptions,
  useConnect,
} from "@thirdweb-dev/react-core";
import {
  EmbeddedWallet,
  EmbeddedWalletAdditionalOptions,
} from "@thirdweb-dev/wallets";
import { useEffect, useRef } from "react";
import { Spinner } from "../../components/Spinner";
import { Flex } from "../../components/basic";
import { InputSelectionUI } from "./InputSelectionUI";

type EmbeddedWalletConfig = Omit<
  EmbeddedWalletAdditionalOptions,
  "chain"|
  "clientId"
>;

export const embeddedWallet = (
  config?: EmbeddedWalletConfig,
): WalletConfig<EmbeddedWallet> => {
  return {
    id: EmbeddedWallet.id,
    meta: EmbeddedWallet.meta,
    create(options: WalletOptions) {
      return new EmbeddedWallet({ ...options, ...config });
    },
    selectUI: EmbeddedWalletSelectionUI,
    connectUI: EmbeddedWalletConnectionUI,
  };
};

const EmbeddedWalletSelectionUI: React.FC<SelectUIProps<EmbeddedWallet>> = (
  props,
) => {
  return (
    <InputSelectionUI
      onSelect={props.onSelect}
      placeholder="Enter your email address"
      name="email"
      type="email"
      errorMessage={(_input) => {
        const input = _input.replace(/\+/g, "");
        const emailRegex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,})$/g;
        const isValidEmail = emailRegex.test(input);
        if (!isValidEmail) {
          return "Invalid email address";
        }
      }}
      emptyErrorMessage="email address is required"
      supportedWallets={props.supportedWallets}
    />
  );
};

const EmbeddedWalletConnectionUI: React.FC<ConnectUIProps<EmbeddedWallet>> = ({
  close,
  walletConfig,
  open,
  selectionData,
  supportedWallets,
}) => {
  const connectPrompted = useRef(false);
  const connect = useConnect();
  const singleWallet = supportedWallets.length === 1;
  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }
    connectPrompted.current = true;

    (async () => {
      close();
      try {
        await connect(walletConfig, { email: selectionData });
      } catch (e) {
        if (!singleWallet) {
          open();
        }
        console.error(e);
      }
    })();
  }, [connect, walletConfig, close, open, singleWallet, selectionData]);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: "250px",
      }}
    >
      <Spinner size="md" color="primary" />
    </Flex>
  );
};
