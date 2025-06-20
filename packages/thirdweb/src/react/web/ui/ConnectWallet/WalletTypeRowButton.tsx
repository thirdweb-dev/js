import type { ThirdwebClient } from "../../../../client/client.js";
import { iconSize, spacing } from "../../../core/design-system/index.js";
import { Text } from "../../ui/components/text.js";
import { Container } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import type { IconFC } from "./icons/types.js";

type WalletTypeRowProps = {
  client: ThirdwebClient;
  onClick: () => void;
  title: string;
  icon: IconFC;
  disabled?: boolean;
};

export function WalletTypeRowButton(props: WalletTypeRowProps) {
  return (
    <Button
      disabled={props.disabled}
      fullWidth
      onClick={() => {
        props.onClick();
      }}
      style={{
        display: "flex",
        justifyContent: "flex-start",
        padding: spacing.sm,
      }}
      variant="outline"
    >
      <Container center="y" color="accentText" flex="row" gap="sm">
        <props.icon size={iconSize.md} />
        <Text color="primaryText">{props.title}</Text>
      </Container>
    </Button>
  );
}
