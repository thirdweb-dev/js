import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../core/hooks/wallets/useActiveWallet.js";
import { shortenString } from "../../../core/utils/addresses.js";
import type { ConnectLocale } from "../ConnectWallet/locale/types.js";
import { CopyIcon } from "../components/CopyIcon.js";
import { QRCode } from "../components/QRCode.js";
import { Spacer } from "../components/Spacer.js";
import { WalletImage } from "../components/WalletImage.js";
import { Container, ModalHeader } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Text } from "../components/text.js";
import { StyledButton } from "../design-system/elements.js";
import { useClipboard } from "../hooks/useCopyClipboard.js";

/**
 *
 * @internal
 */
export function DepositScreen(props: {
  onBack: (() => void) | undefined;
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
  chain: Chain;
  onDone: () => void;
}) {
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const address = account?.address;
  const { hasCopied, onCopy } = useClipboard(address || "");
  const { connectLocale, client } = props;
  const locale = connectLocale.receiveFundsScreen;
  const isTestnet = props.chain.testnet === true;

  const openFaucetLink = () => {
    window.open(`https://thirdweb.com/${props.chain.id}`);
  };

  // TODO poll for receied funds, then enable the continue button

  return (
    <Container p="lg">
      <ModalHeader title={locale.title} onBack={props.onBack} />

      <Spacer y="xl" />

      <Container flex="row" center="x">
        <QRCode
          qrCodeUri={address}
          size={310}
          QRIcon={
            wallet && (
              <WalletImage id={wallet.id} size={iconSize.xxl} client={client} />
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

      <Text
        multiline
        center
        balance
        className="receive_fund_screen_instruction"
      >
        {locale.instruction}
      </Text>
      {isTestnet && (
        <Button variant={"accent"} onClick={openFaucetLink}>
          Get testnet funds
        </Button>
      )}
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
