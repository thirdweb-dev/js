import { useAddress } from "@thirdweb-dev/react-core";
import { Spacer } from "../../components/Spacer";
import { Container, ModalHeader } from "../../components/basic";
import { Text } from "../../components/text";
import { CopyIcon } from "../../components/CopyIcon";
import { iconSize, radius, spacing } from "../../design-system";
import { QRCode } from "../../components/QRCode";
import { Img } from "../../components/Img";
import { useClipboard } from "../../evm/components/hooks/useCopyClipboard";
import { useTWLocale } from "../../evm/providers/locale-provider";
import { shortenString } from "@thirdweb-dev/react-core";
import { StyledButton } from "../../design-system/elements";
import { useCustomTheme } from "../../design-system/CustomThemeProvider";

export function ReceiveFunds(props: { iconUrl: string }) {
  const address = useAddress();
  const { hasCopied, onCopy } = useClipboard(address || "");
  const locale = useTWLocale().connectWallet.receiveFundsScreen;

  return (
    <Container p="lg">
      <ModalHeader title={locale.title} />

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
