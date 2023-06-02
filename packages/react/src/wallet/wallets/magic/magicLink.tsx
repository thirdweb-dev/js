import { MagicLink, MagicLinkAdditionalOptions } from "@thirdweb-dev/wallets";
import {
  ConnectUIProps,
  SelectUIProps,
  WalletOptions,
  useConnect,
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
  const isEmailEnabled = props.walletConfig.config.emailLogin !== false;
  const isSMSEnabled = props.walletConfig.config.smsLogin !== false;

  let placeholder = "Enter your email or phone number";
  let type = "text";
  let emptyErrorMessage = "email or phone number is required";
  if (isEmailEnabled && !isSMSEnabled) {
    placeholder = "Enter your email address";
    emptyErrorMessage = "email address is required";
    type = "email";
  } else if (!isEmailEnabled && isSMSEnabled) {
    placeholder = "Enter your phone number";
    emptyErrorMessage = "phone number is required";
    type = "tel";
  }

  if (!isEmailEnabled && !isSMSEnabled) {
    throw new Error(
      'MagicLink must have either "emailLogin" or "smsLogin" enabled',
    );
  }

  return (
    <InputSelectionUI
      onSelect={props.onSelect}
      placeholder={placeholder}
      name="magic-input"
      type={type}
      emptyErrorMessage={emptyErrorMessage}
      errorMessage={(input) => {
        const isEmail = input.includes("@");
        const isPhone = Number.isInteger(Number(input[input.length - 1]));

        if (isEmail && isEmailEnabled) {
          const emailRegex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,})$/g;
          const isValidEmail = emailRegex.test(input);
          if (!isValidEmail) {
            return "Invalid email address";
          }
        } else if (isPhone && isSMSEnabled) {
          if (!input.startsWith("+")) {
            return "Phone number must start with a country code";
          }
        } else {
          if (isEmailEnabled && isSMSEnabled) {
            return "Invalid email address or phone number";
          }
          if (isEmailEnabled) {
            return "Invalid email address";
          }
          if (isSMSEnabled) {
            return "Invalid phone number";
          }
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
