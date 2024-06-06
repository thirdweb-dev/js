import type { ThirdwebClient } from "../../../../client/client.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { Text } from "../../ui/components/text.js";
import { Img } from "../components/Img.js";
import { Container } from "../components/basic.js";
import { Button } from "../components/buttons.js";

type WalletTypeRowProps = {
  client: ThirdwebClient;
  onClick: () => void;
  title: string;
  icon: string;
};

export function WalletTypeRowButton(props: WalletTypeRowProps) {
  return (
    <Button
      fullWidth
      variant="outline"
      style={{
        display: "flex",
        justifyContent: "flex-start",
        padding: spacing.md,
      }}
      onClick={() => {
        props.onClick();
      }}
    >
      <Container flex="row" gap="md" center="y" color="accentText">
        <Img
          client={props.client}
          src={props.icon}
          width={iconSize.md}
          height={iconSize.md}
          loading="eager"
          style={{
            borderRadius: radius.md,
          }}
        />
        <Text color="primaryText">{props.title}</Text>
      </Container>
    </Button>
  );
}
