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
import { MagicWallet } from "./MagicWallet";
import { useEffect, useRef } from "react";
import Box from "../../components/base/Box";
import { TextInput } from "../../components/base/TextInput";
import Text from "../../components/base/Text";
import { ActivityIndicator } from "react-native";
import { useMagicWallet } from "../../providers/context-provider";

export const magicWallet = (
  magicLinkOptions: MagicLinkOptions,
): WalletConfig<MagicWallet> => {
  return {
    id: walletIds.magicLink,
    meta: MagicWallet.meta,
    create: (options: WalletOptions) => {
      return new MagicWallet({
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
    selectUI: (props: SelectUIProps<MagicWallet>) => {
      return (
        <Box flex={1}>
          <TextInput
            placeholder="Enter your email or phone number"
            placeholderTextColor="gray"
            onEndEditing={(
              e: (typeof TextInput)["arguments"]["onEndEditing"],
            ) => {
              props.onSelect(e.nativeEvent.text);
            }}
          />
          <Text
            marginVertical="sm"
            variant="bodySmallSecondary"
            textAlign="center"
          >
            ---- OR ----
          </Text>
        </Box>
      );
    },
    isInstalled: () => {
      return true;
    },
  };
};

const MagicConnectionUI: React.FC<
  ConnectUIProps<MagicWallet> & { magicLinkOptions: MagicLinkOptions }
> = ({ selectionData, walletConfig, close, magicLinkOptions }) => {
  const createWalletInstance = useCreateWalletInstance();
  const setConnectedWallet = useSetConnectedWallet();
  const chainToConnect = useWalletContext().chainToConnect;
  const setConnectionStatus = useSetConnectionStatus();
  const { magicWallet: ctxMagicWallet, setMagicWallet } = useMagicWallet();

  useEffect(() => {
    const inst = createWalletInstance(walletConfig);
    setMagicWallet?.(inst);
  }, [createWalletInstance, setMagicWallet, walletConfig]);

  const connectPrompted = useRef(false);

  useEffect(() => {
    if (connectPrompted.current || !ctxMagicWallet) {
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
        close();
        await ctxMagicWallet.connect(connectParams);
        await ctxMagicWallet.getMagicSDK().user.getMetadata();

        setConnectedWallet(ctxMagicWallet, connectParams);
        setConnectionStatus("connected");
      } catch (e) {
        setConnectionStatus("disconnected");
        console.error("Error connecting to magic", e);
      }
    })();
  }, [
    selectionData,
    walletConfig,
    close,
    ctxMagicWallet,
    setConnectedWallet,
    setConnectionStatus,
    chainToConnect?.chainId,
    magicLinkOptions,
  ]);

  return (
    <Box minHeight={500}>
      <ActivityIndicator size="small" />
      <TextInput placeholder="Enter the OTP sent to your email / phone number" />
    </Box>
  );
};
