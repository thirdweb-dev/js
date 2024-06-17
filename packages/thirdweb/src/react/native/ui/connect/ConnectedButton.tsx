import { parseTheme } from "../../../core/design-system/CustomThemeProvider.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { useActiveWallet } from "../../hooks/wallets/useActiveWallet.js";
import { useDisconnect } from "../../hooks/wallets/useDisconnect.js";
import { ThemedButton } from "../components/button.js";
import { ThemedText } from "../components/text.js";

export function ConnectedButton(
  props: ConnectButtonProps & { onClose: () => void },
) {
  const theme = parseTheme(props.theme);
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  return (
    wallet && (
      <ThemedButton
        theme={theme}
        onPress={() => {
          props.onClose();
          disconnect(wallet);
        }}
      >
        <ThemedText
          theme={theme}
          type="defaultSemiBold"
          style={{ color: theme.colors.primaryButtonText }}
        >
          Disconnect
        </ThemedText>
      </ThemedButton>
    )
  );
}
