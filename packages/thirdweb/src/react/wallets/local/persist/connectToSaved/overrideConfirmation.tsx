import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useTWLocale } from "../../../../providers/locale-provider.js";
import type { ConnectUIProps } from "../../../../types/wallets.js";
import { Spacer } from "../../../../ui/components/Spacer.js";
import { Container, ModalHeader } from "../../../../ui/components/basic.js";
import { Button } from "../../../../ui/components/buttons.js";
import { iconSize } from "../../../../ui/design-system/index.js";
import { Text } from "../../../../ui/components/text.js";

/**
 * Shows a warning screen when the user tries to create a new local wallet when one is already saved in local storage
 * Prompts the user to backup the wallet before creating a new one
 * @internal
 */
export const OverrideConfirmation: React.FC<{
  onBackup: () => void;
  onSkip: () => void;
  onBack: () => void;
  connectUIProps: ConnectUIProps;
}> = (props) => {
  const locale = useTWLocale().wallets.localWallet.warningScreen;
  const isCompact = props.connectUIProps.screenConfig.size === "compact";
  return (
    <Container fullHeight flex="column" animate="fadein">
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title={locale.title} />
      </Container>

      <Container p={isCompact ? "lg" : "xxl"} expand center="y" flex="column">
        <Container flex="row" center="x" color="danger">
          <ExclamationTriangleIcon width={iconSize.xl} height={iconSize.xl} />
        </Container>

        <Spacer y="xl" />

        <Text multiline center balance>
          {locale.warning}
        </Text>

        <Spacer y="lg" />

        <Button variant="accent" fullWidth onClick={props.onBackup}>
          {locale.backupWallet}
        </Button>
        <Spacer y="md" />
        <Button variant="outline" fullWidth onClick={props.onSkip}>
          {locale.skip}
        </Button>
      </Container>
    </Container>
  );
};
