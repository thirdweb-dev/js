import { walletIds } from "@thirdweb-dev/wallets";
import {
  ConnectUIProps,
  SelectUIProps,
  WalletConfig,
  WalletOptions,
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { MagicLinkOptions } from "../connectors/magic/types";
import { MagicLink } from "./MagicLink";
import { useEffect, useRef } from "react";
import Box from "../../components/base/Box";
import { TextInput } from "../../components/base/TextInput";
import Text from "../../components/base/Text";
import { useMagicLink } from "../../providers/context-provider";
import BaseButton from "../../components/base/BaseButton";
import React from "react";
import { ConnectingWallet } from "../../components/ConnectWalletFlow/ConnectingWallet/ConnectingWallet";
import { useGlobalTheme, useLocale } from "../../providers/ui-context-provider";

export const magicLink = (
  magicLinkOptions: MagicLinkOptions & { recommended?: boolean },
): WalletConfig<MagicLink> => {
  return {
    id: walletIds.magicLink,
    meta: MagicLink.meta,
    create: (options: WalletOptions) => {
      return new MagicLink({
        ...options,
        ...magicLinkOptions,
        chainId: options.chain.chainId,
      });
    },
    /**
     * UI for connecting wallet
     */
    connectUI(props) {
      return (
        <MagicConnectionUI {...props} magicLinkOptions={magicLinkOptions} />
      );
    },
    /**
     * UI for selecting wallet - this UI is rendered in the wallet selection screen
     */
    selectUI: MagicSelectionUI,
    isInstalled: () => {
      return true;
    },
    recommended: magicLinkOptions?.recommended,
  };
};

const MagicSelectionUI: React.FC<SelectUIProps<MagicLink>> = (props) => {
  const l = useLocale();
  const theme = useGlobalTheme();
  const [email, setEmail] = React.useState("");

  const onContinuePress = () => {
    if (!email) {
      return;
    }
    props.onSelect(email);
  };

  return (
    <Box paddingHorizontal="xl" mt="lg">
      <TextInput
        textInputProps={{
          placeholder: "Enter your email address",
          placeholderTextColor: theme.colors.textSecondary,
          onChangeText: (text: string) => {
            setEmail(text);
          },
          style: {
            fontSize: 14,
            color: theme.colors.textPrimary,
            // fontFamily: theme.textVariants.defaults.fontFamily,
            lineHeight: 16,
            padding: 0,
          },
        }}
        containerProps={{
          paddingHorizontal: "sm",
          paddingVertical: "sm",
        }}
      />
      <BaseButton
        mt="md"
        paddingVertical="md"
        borderRadius="lg"
        borderWidth={1}
        borderColor="border"
        backgroundColor="accentButtonColor"
        onPress={onContinuePress}
      >
        <Text
          variant="bodySmall"
          color="accentButtonTextColor"
          fontWeight="700"
        >
          {l.common.continue}
        </Text>
      </BaseButton>
    </Box>
  );
};

const MagicConnectionUI: React.FC<
  ConnectUIProps<MagicLink> & { magicLinkOptions: MagicLinkOptions }
> = ({ selectionData, walletConfig, connected, goBack, magicLinkOptions }) => {
  const createWalletInstance = useCreateWalletInstance();
  const setConnectedWallet = useSetConnectedWallet();
  const chainToConnect = useWalletContext().chainToConnect;
  const setConnectionStatus = useSetConnectionStatus();
  const { magicLink: ctxMagicLink, setMagicLink } = useMagicLink();

  useEffect(() => {
    const inst = createWalletInstance(walletConfig);
    setMagicLink?.(inst);
  }, [createWalletInstance, setMagicLink, walletConfig]);

  const connectPrompted = useRef(false);

  useEffect(() => {
    if (connectPrompted.current || !ctxMagicLink) {
      return;
    }
    connectPrompted.current = true;
    const isEmail = (selectionData as string).includes("@");

    (async () => {
      // close();
      try {
        setConnectionStatus("connecting");
        const connectParams = {
          chainId: chainToConnect?.chainId,
          ...magicLinkOptions,
          ...(isEmail
            ? { email: selectionData }
            : { phoneNumber: selectionData }),
        };
        connected();
        await ctxMagicLink.connect(connectParams);
        await ctxMagicLink.getMagicSDK().user.getMetadata();

        setConnectedWallet(ctxMagicLink, connectParams);
        setConnectionStatus("connected");
      } catch (e) {
        setConnectionStatus("disconnected");
        console.error("Error connecting to magic", e);
      }
    })();
  }, [
    selectionData,
    walletConfig,
    connected,
    ctxMagicLink,
    setConnectedWallet,
    setConnectionStatus,
    chainToConnect?.chainId,
    magicLinkOptions,
  ]);

  return (
    <ConnectingWallet
      subHeaderText=""
      wallet={walletConfig}
      onClose={connected}
      onBackPress={goBack}
    />
  );
};

/**
 * @deprecated Use `magicLink()` instead
 *
 * Renamed for consistency with our React package
 */
export const magicWallet = magicLink;
