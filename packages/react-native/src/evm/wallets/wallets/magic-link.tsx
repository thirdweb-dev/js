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
import { ActivityIndicator } from "react-native";
import { useMagicLink } from "../../providers/context-provider";

export const magicLink = (
  magicLinkOptions: MagicLinkOptions,
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
    selectUI: (props: SelectUIProps<MagicLink>) => {
      return (
        <Box flex={1}>
          <TextInput
            placeholder="Enter your email or phone number"
            placeholderTextColor="gray"
            onEndEditing={(e: any) => {
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
  ConnectUIProps<MagicLink> & { magicLinkOptions: MagicLinkOptions }
> = ({ selectionData, walletConfig, close, magicLinkOptions }) => {
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
        close();
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
    close,
    ctxMagicLink,
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

/**
 * @deprecated Use `magicLink()` instead
 *
 * Renamed for consistency with our React package
 */
export const magicWallet = magicLink;
