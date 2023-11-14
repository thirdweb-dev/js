import { useAddress } from "@thirdweb-dev/react-core";
import { Spacer } from "../../components/Spacer";
import { Container, ModalHeader } from "../../components/basic";
import { Text } from "../../components/text";
import { CopyIcon } from "../../components/CopyIcon";
import styled from "@emotion/styled";
import { Theme, iconSize, radius, spacing } from "../../design-system";
import { QRCode } from "../../components/QRCode";
import { Img } from "../../components/Img";
import { useClipboard } from "../../evm/components/hooks/useCopyClipboard";
import { useTWLocale } from "../../evm/providers/locale-provider";
import { shortenString } from "@thirdweb-dev/react-core";

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

const WalletAddressContainer = styled.button<{ theme?: Theme }>`
  all: unset;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  padding: ${spacing.md};
  display: flex;
  justify-content: space-between;
  border: 1px solid ${(p) => p.theme.colors.borderColor};
  border-radius: ${radius.md};
  transition: border-color 200ms ease;
  &:hover {
    border-color: ${(p) => p.theme.colors.accentText};
  }
`;
