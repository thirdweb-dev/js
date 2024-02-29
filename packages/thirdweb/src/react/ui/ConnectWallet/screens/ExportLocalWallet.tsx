import { PinBottomIcon } from "@radix-ui/react-icons";
import type { LocalWallet } from "../../../../wallets/local/index.js";
import { useTWLocale } from "../../../providers/locale-provider.js";
import {
  useActiveAccount,
  useActiveWallet,
} from "../../../providers/wallet-provider.js";
import { shortenString } from "../../../utils/addresses.js";
import { downloadTextFile } from "../../../wallets/local/utils/downloadTextFile.js";
import { Spacer } from "../../components/Spacer.js";
import {
  Container,
  ModalHeader,
  Line,
  ScreenBottomContainer,
} from "../../components/basic.js";
import { Button } from "../../components/buttons.js";
import { Label } from "../../components/formElements.js";
import { spacing, iconSize } from "../../design-system/index.js";
import { Text } from "../../components/text.js";

/**
 * Export the private key and download it as a text file for current active local wallet
 * @internal
 */
export function ExportLocalWallet(props: {
  onExport: () => void;
  onBack: () => void;
}) {
  const locale = useTWLocale().wallets.localWallet;
  const isWideScreen = false;
  const wallet = useActiveWallet() as LocalWallet;
  const account = useActiveAccount();

  const handleExport = async () => {
    const privateKey = await wallet.export({
      strategy: "privateKey",
      encryption: false,
    });
    downloadTextFile(privateKey, "privateKey.txt");
    props.onExport();
  };

  return (
    <Container fullHeight animate="fadein">
      <div>
        <Container p="lg">
          <ModalHeader
            onBack={props.onBack}
            title={locale.exportScreen.title}
          />
        </Container>
        <Line />
        <Container expand p="lg">
          <Text multiline>{locale.exportScreen.downloadMessage}</Text>
          <Spacer y="xl" />
          <Label>{locale.exportScreen.walletAddress}</Label>
          <Spacer y="sm" />
          <Text>{shortenString(account?.address || "")}</Text>
        </Container>

        <Spacer y="lg" />

        <ScreenBottomContainer
          style={{
            borderTop: isWideScreen ? "none" : undefined,
          }}
        >
          <Button
            variant="accent"
            fullWidth
            style={{
              display: "flex",
              gap: spacing.sm,
            }}
            type="submit"
            onClick={handleExport}
          >
            <PinBottomIcon width={iconSize.sm} height={iconSize.sm} />
            {locale.exportScreen.download}
          </Button>
        </ScreenBottomContainer>
      </div>
    </Container>
  );
}
