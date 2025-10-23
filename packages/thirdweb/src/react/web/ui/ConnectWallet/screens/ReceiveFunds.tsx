import type { ThirdwebClient } from "../../../../../client/client.js";
import type { WalletId } from "../../../../../wallets/wallet-types.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { useActiveAccount } from "../../../../core/hooks/wallets/useActiveAccount.js";
import { shortenString } from "../../../../core/utils/addresses.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { CopyIcon } from "../../components/CopyIcon.js";
import { QRCode } from "../../components/QRCode.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";
import { WalletImage } from "../../components/WalletImage.js";
import { StyledButton } from "../../design-system/elements.js";
import { useClipboard } from "../../hooks/useCopyClipboard.js";
import type { ConnectLocale } from "../locale/types.js";

/**
 *
 * @internal
 */
export function ReceiveFunds(props: {
  walletId?: WalletId;
  onBack: () => void;
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
}) {
  const account = useActiveAccount();
  const address = account?.address;
  const { hasCopied, onCopy } = useClipboard(address || "");
  const { connectLocale, client } = props;
  const locale = connectLocale.receiveFundsScreen;

  return (
    <Container p="lg" className="tw-receive-funds-screen">
      <ModalHeader onBack={props.onBack} title={locale.title} />

      <Spacer y="xl" />

      <Container center="x" flex="row">
        <QRCode
          QRIcon={
            props.walletId && (
              <WalletImage
                client={client}
                id={props.walletId}
                size={iconSize.xxl}
              />
            )
          }
          qrCodeUri={address}
          size={350}
        />
      </Container>
      <Spacer y="xl" />

      <WalletAddressContainer
        onClick={onCopy}
        className="tw-copy-address-button"
      >
        <Text color="primaryText" size="md">
          {shortenString(address || "", false)}
        </Text>
        <CopyIcon
          hasCopied={hasCopied}
          text={address || ""}
          tip="Copy address"
        />
      </WalletAddressContainer>

      <Spacer y="lg" />

      <Text
        balance
        center
        size="sm"
        className="receive_fund_screen_instruction"
        multiline
      >
        {locale.instruction}
      </Text>
    </Container>
  );
}

const WalletAddressContainer = /* @__PURE__ */ StyledButton((_) => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    "&:hover": {
      borderColor: theme.colors.accentText,
    },
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: radius.md,
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    padding: spacing.md,
    transition: "border-color 200ms ease",
    width: "100%",
  };
});
