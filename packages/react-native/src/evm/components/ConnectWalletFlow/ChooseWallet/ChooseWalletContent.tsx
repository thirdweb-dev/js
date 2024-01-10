import {
  useAddress,
  useConnect,
  useWalletContext,
  type WalletConfig,
} from "@thirdweb-dev/react-core";
import { Dimensions, ScrollView, View } from "react-native";
import { WalletButton } from "../../base/WalletButton";
import Box from "../../base/Box";
import { useTheme } from "@shopify/restyle";

interface ChooseWalletContentProps {
  wallets: WalletConfig[];
  onChooseWallet: (wallet: WalletConfig, data?: any) => void;
}

const MAX_HEIGHT = Dimensions.get("window").height * 0.3;

export const ChooseWalletContent = ({
  wallets,
  onChooseWallet,
}: ChooseWalletContentProps) => {
  const theme = useTheme();
  const connect = useConnect();
  const address = useAddress();
  const {
    setConnectedWallet,
    setConnectionStatus,
    connectionStatus,
    createWalletInstance,
    activeWallet,
  } = useWalletContext();

  return (
    <View style={{ flexDirection: "column", maxHeight: MAX_HEIGHT }}>
      <ScrollView
        style={{
          marginTop: 16,
          paddingBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        {wallets.map((item, index) => {
          const marginBottom = index === wallets.length - 1 ? "none" : "xxs";
          return (
            <Box key={item.id}>
              {item.selectUI ? (
                <Box
                  mb={marginBottom}
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  borderRadius="sm"
                >
                  <item.selectUI
                    modalSize="compact"
                    theme={theme}
                    supportedWallets={wallets}
                    onSelect={(data) => {
                      onChooseWallet(item, data);
                    }}
                    walletConfig={item}
                    // TEMPORARY BUILD FIX
                    connect={(options: any) => connect(item, options)}
                    connectedWallet={activeWallet}
                    connectedWalletAddress={address}
                    connectionStatus={connectionStatus}
                    createWalletInstance={() => createWalletInstance(item)}
                    setConnectedWallet={setConnectedWallet}
                    setConnectionStatus={setConnectionStatus}
                  />
                </Box>
              ) : (
                <WalletButton
                  walletIconUrl={item.meta.iconURL}
                  name={item.meta.name}
                  recommended={item.recommended}
                  onPress={() => onChooseWallet(item)}
                  mb={marginBottom}
                  paddingVertical="xxs"
                />
              )}
            </Box>
          );
        })}
      </ScrollView>
    </View>
  );
};
