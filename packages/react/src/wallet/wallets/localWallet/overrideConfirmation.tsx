import { Button } from "../../../components/buttons";
import { Text } from "../../../components/text";
import { Spacer } from "../../../components/Spacer";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { Container, ModalHeader } from "../../../components/basic";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { iconSize } from "../../../design-system";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const OverrideConfirmation: React.FC<{
  onBackup: () => void;
  onBack: () => void;
  meta: WalletConfig["meta"];
  modalSize: "wide" | "compact";
}> = (props) => {
  const locale = useTWLocale().wallets.localWallet.warningScreen;
  const isCompact = props.modalSize === "compact";
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

        <Container
          flex="row"
          style={{
            justifyContent: "flex-end",
          }}
        >
          <Button variant="accent" fullWidth onClick={props.onBackup}>
            {locale.backupWallet}
          </Button>
        </Container>
      </Container>
    </Container>
  );
};
