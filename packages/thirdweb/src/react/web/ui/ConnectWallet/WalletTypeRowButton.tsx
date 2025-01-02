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
      fullWidth
      variant="outline"
      style={{
        display: "flex",
        justifyContent: "flex-start",
        padding: spacing.sm,
      }}
      onClick={() => {
        props.onClick();
      }}
      disabled={props.disabled}
    >
      <Container flex="row" gap="sm" center="y" color="accentText">
        <props.icon size={iconSize.md} />
        <Text color="primaryText">{props.title}</Text>
      </Container>
    </Button>
  );
}
