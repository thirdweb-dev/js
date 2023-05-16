import { MagicLink, MagicLinkAdditionalOptions } from "@thirdweb-dev/wallets";
import {
  ConnectUIProps,
  SelectUIProps,
  WalletOptions,
  useConnect,
  useWallets,
} from "@thirdweb-dev/react-core";
import { ConfiguredMagicLinkWallet } from "./types";
import { useRef, useEffect } from "react";
import { Spinner } from "../../../components/Spinner";
import { Flex } from "../../../components/basic";
import { InputSelectionUI } from "../InputSelectionUI";

export function magicLink(
  config: MagicLinkAdditionalOptions,
): ConfiguredMagicLinkWallet {
  return {
    id: MagicLink.id,
    meta: MagicLink.meta,
    create: (options: WalletOptions) =>
      new MagicLink({ ...options, ...config }),
    config,
    connectUI: MagicConnectionUI,
    selectUI: MagicSelectionUI,
    isInstalled() {
      return false;
    },
  };
}

const MagicSelectionUI: React.FC<
  SelectUIProps<MagicLink, MagicLinkAdditionalOptions>
> = (props) => {
  return (
    <InputSelectionUI
      onSelect={props.onSelect}
      placeholder="Enter your email or phone number"
      name="magic-input"
      type="text"
      errorMessage={(input) => {
        const isEmail = input.includes("@");
        const isPhone = Number.isInteger(Number(input[input.length - 1]));

        if (isEmail) {
          const isValidEmail = input.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
          if (!isValidEmail) {
            return "Please enter a valid email address";
          }
        } else if (isPhone) {
          if (!input.startsWith("+")) {
            return "Phone number must start with a country code";
          }
        } else {
          return "Invalid email address or phone number";
        }
      }}
      supportedWallets={props.supportedWallets}
    />
  );
};

const MagicConnectionUI: React.FC<
  ConnectUIProps<MagicLink, MagicLinkAdditionalOptions>
> = ({ close, walletConfig, open, selectionData, supportedWallets }) => {
  const connectPrompted = useRef(false);
  const singleWallet = supportedWallets.length === 1;
  const connect = useConnect();

  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }
    connectPrompted.current = true;
    const isEmail = (selectionData as string).includes("@");

    (async () => {
      close();
      try {
        await connect(
          walletConfig,
          isEmail ? { email: selectionData } : { phoneNumber: selectionData },
        );
      } catch (e) {
        if (!singleWallet) {
          open();
        }
        console.error(e);
      }
    })();
  }, [connect, selectionData, walletConfig, close, open, singleWallet]);

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
