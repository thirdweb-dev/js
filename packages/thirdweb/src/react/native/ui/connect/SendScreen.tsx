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
import { ThemedButton } from "../components/button.js";
import { type ContainerType, Header } from "../components/Header.js";
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
        onError() {
          setScreen("error");
        },
        onSuccess() {
          setScreen("success");
        },
      },
    );
  };

  if (screen === "success") {
    return (
      <>
        <Header
          containerType={containerType}
          onBack={() => setScreen("base")}
          onClose={onClose}
          theme={theme}
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
          containerType={containerType}
          onBack={() => setScreen("base")}
          onClose={onClose}
          theme={theme}
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
          containerType={containerType}
          onBack={() => setScreen("base")}
          onClose={onClose}
          theme={theme}
          title="Token to Send"
        />
        <Spacer size="xl" />
        <View style={{ flex: 1 }}>
          <TokenListScreen
            client={client}
            onTokenSelected={(t) => {
              setSelectedToken(t);
              setScreen("base");
            }}
            supportedTokens={supportedTokens}
            theme={theme}
          />
        </View>
      </>
    );
  }

  return (
    <>
      <Header
        containerType={containerType}
        onBack={onBack}
        onClose={onClose}
        theme={theme}
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
              borderRadius: radius.lg,
              borderWidth: 1,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.smd,
            }}
          >
            <TokenRow
              address={account?.address}
              chain={chain}
              client={client}
              onTokenSelected={handleTokenClicked}
              theme={theme}
              token={selectedToken}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <ThemedText theme={theme} type="subtext">
            Send to
          </ThemedText>
          <ThemedInput
            autoCapitalize="none"
            keyboardType="url"
            onChangeText={setReceiverAddress}
            placeholder="0x... / ENS name"
            textContentType="URL"
            theme={theme}
            value={receiverAddress}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedText theme={theme} type="subtext">
            Amount
          </ThemedText>
          <ThemedInput
            inputMode="numeric"
            onChangeText={setAmount}
            rightView={
              <ThemedText
                style={{ marginRight: spacing.md }}
                theme={theme}
                type="subtext"
              >
                {selectedToken?.symbol || symbol}
              </ThemedText>
            }
            theme={theme}
            value={amount}
          />
        </View>
        <View style={styles.inputContainer}>
          <ThemedButton
            disabled={sendMutation.isPending}
            onPress={handleSend}
            theme={theme}
            variant="accent"
          >
            {sendMutation.isPending ? (
              <ThemedSpinner color={theme.colors.accentButtonText} />
            ) : (
              <ThemedText
                style={{
                  color: theme.colors.accentButtonText,
                }}
                theme={theme}
                type="defaultSemiBold"
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
    flexDirection: "column",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  inputContainer: {
    gap: spacing.sm,
  },
});
