import { useAddress, useWalletConfig } from "@thirdweb-dev/react-core";
import { Spacer } from "../../components/Spacer";
import { Container, ModalHeader } from "../../components/basic";
import { Text } from "../../components/text";
import { shortenString } from "../../evm/utils/addresses";
import { IconButton } from "../../components/buttons";
import { CopyIcon } from "../../components/CopyIcon";
import styled from "@emotion/styled";
import { Theme, iconSize, radius, spacing } from "../../design-system";
import { QRCode } from "../../components/QRCode";
import { isMobile } from "../../evm/utils/isMobile";
import { Img } from "../../components/Img";
import { useClipboard } from "../../evm/components/hooks/useCopyClipboard";

export function ReceiveFunds() {
  const address = useAddress();
  const walletConfig = useWalletConfig();
  const isMob = isMobile();
  const { hasCopied, onCopy } = useClipboard(address || "");

  return (
    <Container p="lg">
      <ModalHeader title="Receive Funds" />

      <Spacer y="xl" />

      {!isMob && (
        <>
          <Container flex="row" center="x">
            <QRCode
              qrCodeUri={address}
              size={310}
              QRIcon={
                walletConfig?.meta.iconURL ? (
                  <Img
                    src={walletConfig?.meta.iconURL}
                    width={iconSize.xxl}
                    height={iconSize.xxl}
                  />
                ) : undefined
              }
            />
          </Container>
          <Spacer y="xl" />
        </>
      )}

      <WalletAddressContianer onClick={onCopy}>
        <Text color="primaryText" size="md">
          {shortenString(address || "")}
        </Text>
        <IconButton>
          <CopyIcon
            text={address || ""}
            tip="Copy address"
            hasCopied={hasCopied}
          />
        </IconButton>
      </WalletAddressContianer>

      <Spacer y="lg" />

      {!isMob ? (
        <Text multiline center>
          Copy the wallet address or scan the <br /> QR code to send funds to
          this wallet.
        </Text>
      ) : (
        <>
          <Text multiline center>
            Copy the wallet address to <br />
            send funds to this wallet
          </Text>
          <Spacer y="xl" />
        </>
      )}
    </Container>
  );
}

const WalletAddressContianer = styled.button<{ theme?: Theme }>`
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
