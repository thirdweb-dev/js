import { useTWLocale } from "../../../providers/locale-provider.js";
import { shortenString } from "../../../utils/addresses.js";
import { Img } from "../../components/Img.js";
import { QRCode } from "../../components/QRCode.js";
import { Spacer } from "../../components/Spacer.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { useCustomTheme } from "../../design-system/CustomThemeProvider.js";
import { StyledButton } from "../../design-system/elements.js";
import { iconSize, spacing, radius } from "../../design-system/index.js";
import { useClipboard } from "../../hooks/useCopyClipboard.js";
import { useActiveAccount } from "../../../providers/wallet-provider.js";
import { Text } from "../../components/text.js";
import { CopyIcon } from "../../components/CopyIcon.js";

/**
 *
 * @internal
 */
export function ReceiveFunds(props: { iconUrl: string; onBack: () => void }) {
  const account = useActiveAccount();
  const address = account?.address;
  const { hasCopied, onCopy } = useClipboard(address || "");
  const locale = useTWLocale().connectWallet.receiveFundsScreen;

  return (
    <Container p="lg">
      <ModalHeader title={locale.title} onBack={props.onBack} />

      <Spacer y="xl" />

      <Container flex="row" center="x">
        <QRCode
          qrCodeUri={address}
          size={310}
          QRIcon={
            <Img
              src={props.iconUrl}
              width={iconSize.xxl}
              height={iconSize.xxl}
            />
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

const WalletAddressContainer = /* @__PURE__ */ StyledButton(() => {
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
