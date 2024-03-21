import { PinBottomIcon } from "@radix-ui/react-icons";
import type { LocalWallet } from "../../../../../wallets/local/index.js";
import {
  useActiveAccount,
  useActiveWallet,
} from "../../../../core/hooks/wallets/wallet-hooks.js";
import { shortenString } from "../../../../core/utils/addresses.js";
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
import { useState, useEffect } from "react";
import { useWalletConnectionCtx } from "../../../../core/hooks/others/useWalletConnectionCtx.js";
import { getLocalWalletLocale } from "../../../wallets/local/locale/getLocalWalletLocale.js";
import type { LocalWalletLocale } from "../../../wallets/local/locale/types.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";

/**
 * Export the private key and download it as a text file for current active local wallet
 * @internal
 */
export function ExportLocalWallet(props: {
  onExport: () => void;
  onBack: () => void;
}) {
  const { locale: localeId } = useWalletConnectionCtx();
  const [locale, setLocale] = useState<LocalWalletLocale | undefined>();

  useEffect(() => {
    getLocalWalletLocale(localeId).then((_local) => {
      setLocale(_local);
    });
  }, [localeId]);

  const isWideScreen = false;
  const wallet = useActiveWallet() as LocalWallet;
  const account = useActiveAccount();

  if (!locale) {
    return <LoadingScreen />;
  }

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
