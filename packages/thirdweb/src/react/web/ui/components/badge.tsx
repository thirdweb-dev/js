import { radius, spacing } from "../../../core/design-system/index.js";
import { Container } from "./basic.js";
import { Text } from "./text.js";

function Badge(props: { text: string }) {
  return (
    <Container
      bg="modalBg"
      color="secondaryText"
      borderColor="borderColor"
      flex="row"
      center="y"
      style={{
        borderRadius: radius.full,
        padding: `${spacing["3xs"]} ${spacing.xs}`,
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      <Text
        style={{
          fontSize: 10,
          whiteSpace: "nowrap",
        }}
      >
        {props.text}
      </Text>
    </Container>
  );
}

export function LastUsedBadge() {
  return (
    <div
      style={{
        position: "absolute",
        top: -10,
        right: -10,
        zIndex: 1,
        pointerEvents: "none",
        cursor: "default",
      }}
    >
      <Badge text="Last used" />
    </div>
  );
}

export const LAST_USED_BADGE_VERTICAL_RESERVED_SPACE = 12;
