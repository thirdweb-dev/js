import { useState } from "react";
import { StyleSheet, View } from "react-native";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Theme } from "../../../core/design-system/index.js";
import { useChainSymbol } from "../../../core/hooks/others/useChainQuery.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWalletChain } from "../../../core/hooks/wallets/useActiveWalletChain.js";
import { useSendToken } from "../../../core/hooks/wallets/useSendToken.js";
import type {
  SupportedTokens,
  TokenInfo,
} from "../../../core/utils/defaultTokens.js";
import { radius, spacing } from "../../design-system/index.js";
import { type ContainerType, Header } from "../components/Header.js";
import { ThemedButton } from "../components/button.js";
import { ThemedInput } from "../components/input.js";
import { Spacer } from "../components/spacer.js";
import { ThemedSpinner } from "../components/spinner.js";
import { ThemedText } from "../components/text.js";
import { ErrorView } from "./ErrorView.js";
import { SuccessView } from "./SuccessView.js";
import { TokenListScreen, TokenRow } from "./TokenListScreen.js";

type SendScreenProps = {
  theme: Theme;
  client: ThirdwebClient;
  onClose?: () => void;
  onBack?: () => void;
  containerType: ContainerType;
  supportedTokens?: SupportedTokens;
};

export const SendScreen = (props: SendScreenProps) => {
  const { theme, client, onClose, onBack, containerType, supportedTokens } =
    props;
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("0");
  const [selectedToken, setSelectedToken] = useState<TokenInfo>();
  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const { symbol } = useChainSymbol(chain);
  const sendMutation = useSendToken(client);
  const [screen, setScreen] = useState<
    "base" | "tokenList" | "success" | "error"
  >("base");

  const handleTokenClicked = () => {
    setScreen("tokenList");
  };

  const handleSend = async () => {
    sendMutation.mutate(
      {
        amount,
        receiverAddress,
        tokenAddress: selectedToken?.address,
      },
      {
        onSuccess() {
          setScreen("success");
        },
        onError() {
          setScreen("error");
        },
      },
    );
  };

  if (screen === "success") {
    return (
      <>
        <Header
          theme={theme}
          onClose={onClose}
          onBack={() => setScreen("base")}
          containerType={containerType}
          title="Funds Sent"
        />
        <Spacer size="xl" />
        <View style={{ flex: 1 }}>
          <SuccessView theme={theme} title="Transaction Successful" />
        </View>
      </>
    );
  }

  if (screen === "error") {
    return (
      <>
        <Header
          theme={theme}
          onClose={onClose}
          onBack={() => setScreen("base")}
          containerType={containerType}
          title="Error Sending Funds"
        />
        <Spacer size="xl" />
        <View style={{ flex: 1 }}>
          <ErrorView
            theme={theme}
            title={sendMutation.error?.message || "Unknown error"}
          />
        </View>
      </>
    );
  }

  if (screen === "tokenList") {
    return (
      <>
        <Header
          theme={theme}
          onClose={onClose}
          onBack={() => setScreen("base")}
          containerType={containerType}
          title="Token to Send"
        />
        <Spacer size="xl" />
        <View style={{ flex: 1 }}>
          <TokenListScreen
            theme={theme}
            client={client}
            supportedTokens={supportedTokens}
            onTokenSelected={(t) => {
              setSelectedToken(t);
              setScreen("base");
            }}
          />
        </View>
      </>
    );
  }

  return (
    <>
      <Header
        theme={theme}
        onClose={onClose}
        onBack={onBack}
        containerType={containerType}
        title="Send Funds"
      />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <ThemedText theme={theme} type="subtext">
            Token
          </ThemedText>
          <View
            style={{
              borderColor: theme.colors.borderColor,
              borderWidth: 1,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.smd,
              borderRadius: radius.lg,
            }}
          >
            <TokenRow
              theme={theme}
              client={client}
              address={account?.address}
              chain={chain}
              token={selectedToken}
              onTokenSelected={handleTokenClicked}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <ThemedText theme={theme} type="subtext">
            Send to
          </ThemedText>
          <ThemedInput
            theme={theme}
            onChangeText={setReceiverAddress}
            value={receiverAddress}
            placeholder="0x... / ENS name"
            textContentType="URL"
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedText theme={theme} type="subtext">
            Amount
          </ThemedText>
          <ThemedInput
            theme={theme}
            onChangeText={setAmount}
            value={amount}
            inputMode="numeric"
            rightView={
              <ThemedText
                theme={theme}
                type="subtext"
                style={{ marginRight: spacing.md }}
              >
                {selectedToken?.symbol || symbol}
              </ThemedText>
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedButton
            theme={theme}
            variant="accent"
            onPress={handleSend}
            disabled={sendMutation.isPending}
          >
            {sendMutation.isPending ? (
              <ThemedSpinner color={theme.colors.accentButtonText} />
            ) : (
              <ThemedText
                theme={theme}
                type="defaultSemiBold"
                style={{
                  color: theme.colors.accentButtonText,
                }}
              >
                Send
              </ThemedText>
            )}
          </ThemedButton>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: "column",
    gap: spacing.md,
  },
  inputContainer: {
    gap: spacing.sm,
  },
});
