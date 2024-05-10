import { Spacer } from "../../../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { iconSize } from "../../../../design-system/index.js";
import { type CurrencyMeta, currencies } from "./currencies.js";

export function CurrencySelection(props: {
  onSelect: (currency: CurrencyMeta) => void;
  onBack: () => void;
}) {
  return (
    <Container>
      <Container p="lg">
        <ModalHeader title="Select Currency" onBack={props.onBack} />
      </Container>

      <Line />
      <Spacer y="lg" />

      <Container flex="column" gap="xs" px="md">
        {currencies.map((c) => {
          return (
            <Button
              fullWidth
              variant="ghost"
              key={c.shorthand}
              onClick={() => props.onSelect(c)}
              gap="sm"
            >
              <c.icon size={iconSize.lg} />
              <Container flex="column" gap="xxs">
                <Text color="primaryText">{c.shorthand}</Text>
                <Text>{c.name}</Text>
              </Container>
            </Button>
          );
        })}
      </Container>

      <Spacer y="lg" />
    </Container>
  );
}
