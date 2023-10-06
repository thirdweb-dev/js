import { Button } from "../../../components/buttons";
import { Text } from "../../../components/text";
import { Spacer } from "../../../components/Spacer";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { Container, ModalHeader } from "../../../components/basic";
import { useContext } from "react";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { iconSize } from "../../../design-system";

export const OverrideConfirmation: React.FC<{
  onBackup: () => void;
  onBack: () => void;
  meta: WalletConfig["meta"];
}> = (props) => {
  const isCompact = useContext(ModalConfigCtx).modalSize === "compact";
  return (
    <Container fullHeight flex="column">
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title="Warning" />
      </Container>

      <Container p={isCompact ? "lg" : "xxl"} expand center="y" flex="column">
        <Container flex="row" center="x" color="danger">
          <ExclamationTriangleIcon width={iconSize.xl} height={iconSize.xl} />
        </Container>

        <Spacer y="xl" />

        <Text multiline center>
          Your current wallet will be deleted if you create a new wallet. Backup
          wallet to your device before creating a new wallet
        </Text>

        <Spacer y="lg" />

        <Container
          flex="row"
          style={{
            justifyContent: "flex-end",
          }}
        >
          <Button variant="accent" fullWidth onClick={props.onBackup}>
            Backup wallet
          </Button>
        </Container>
      </Container>
    </Container>
  );
};
