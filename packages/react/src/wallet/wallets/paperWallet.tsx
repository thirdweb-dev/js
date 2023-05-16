import { PaperWallet } from "@thirdweb-dev/wallets";
import {
  WalletConfig,
  WalletOptions,
  SelectUIProps,
  ConnectUIProps,
  useConnect,
  useWallets,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef } from "react";
import { Spinner } from "../../components/Spinner";
import { Flex } from "../../components/basic";
import { useWalletModalConfig } from "../../evm/providers/wallet-ui-states-provider";
import { InputSelectionUI } from "./InputSelectionUI";

type PaperConfig = { clientId: string };

export const paperWallet = (
  config: PaperConfig,
): WalletConfig<PaperWallet, PaperConfig> => {
  return {
    id: PaperWallet.id,
    meta: PaperWallet.meta,
    create(options: WalletOptions) {
      return new PaperWallet({ ...options, ...config });
    },
    config,
    selectUI: PaperSelectionUI,
    connectUI: PaperConnectionUI,
  };
};

const PaperSelectionUI: React.FC<SelectUIProps<PaperWallet, PaperConfig>> = (
  props,
) => {
  return (
    <InputSelectionUI
      onSelect={props.onSelect}
      placeholder="Enter your email address"
      name="email"
      type="email"
      errorMessage={(input) => {
        const isValidEmail = input.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        if (!isValidEmail) {
          return "Please enter a valid email address";
        }
      }}
    />
  );
};

const PaperConnectionUI: React.FC<ConnectUIProps<PaperWallet, PaperConfig>> = ({
  close,
  walletConfig,
  open,
}) => {
  const { data } = useWalletModalConfig();
  const connectPrompted = useRef(false);
  const connect = useConnect();
  const singleWallet = useWallets().length === 1;
  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }
    connectPrompted.current = true;

    (async () => {
      close();
      try {
        await connect(walletConfig, { email: data });
      } catch (e) {
        if (!singleWallet) {
          open();
        }
        console.error(e);
      }
    })();
  }, [connect, data, walletConfig, close, open, singleWallet]);

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
