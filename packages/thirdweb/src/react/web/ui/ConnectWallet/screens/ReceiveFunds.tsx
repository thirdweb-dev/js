import type { ThirdwebClient } from "../../../../../client/client.js";
import type { WalletId } from "../../../../../wallets/wallet-types.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../../core/design-system/index.js";
import { shortenString } from "../../../../core/utils/addresses.js";
import { useActiveAccount } from "../../../hooks/wallets/useActiveAccount.js";
import { CopyIcon } from "../../components/CopyIcon.js";
import { QRCode } from "../../components/QRCode.js";
import { Spacer } from "../../components/Spacer.js";
import { WalletImage } from "../../components/WalletImage.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Text } from "../../components/text.js";
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
    <Container p="lg">
      <ModalHeader title={locale.title} onBack={props.onBack} />

      <Spacer y="xl" />

      <Container flex="row" center="x">
        <QRCode
          qrCodeUri={address}
          size={310}
          QRIcon={
            props.walletId && (
              <WalletImage
                id={props.walletId}
                size={iconSize.xxl}
                client={client}
              />
            )
          }
        />
      </Container>
      <Spacer y="xl" />

      <WalletAddressContainer onClick={onCopy}>
        <Text color="primaryText" size="md">
          {shortenString(address || "")}
        </Text>
        <CopyIcon
          text={address || ""}
          tip="Copy address"
          hasCopied={hasCopied}
        />
      </WalletAddressContainer>

      <Spacer y="lg" />

      <Text multiline center balance>
        {locale.instruction}
      </Text>
    </Container>
  );
}

const WalletAddressContainer = /* @__PURE__ */ StyledButton((_) => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    width: "100%",
    boxSizing: "border-box",
    cursor: "pointer",
    padding: spacing.md,
    display: "flex",
    justifyContent: "space-between",
    border: `1px solid ${theme.colors.borderColor}`,
    borderRadius: radius.md,
    transition: "border-color 200ms ease",
    "&:hover": {
      borderColor: theme.colors.accentText,
    },
  };
});
