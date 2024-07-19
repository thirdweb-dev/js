import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { radius, spacing } from "../../../core/design-system/index.js";
import { Text } from "../components/text.js";
import { Spacer } from "./Spacer.js";
import { Container } from "./basic.js";
import { Button } from "./buttons.js";

export default function Tabs({
  selected,
  onSelect,
  options,
  children,
}: {
  selected: string;
  onSelect: (selected: string) => void;
  options: string[];
  children: React.ReactNode;
}) {
  const theme = useCustomTheme();
  return (
    <div>
      <Container
        flex="row"
        center="y"
        style={{ width: "100%", borderRadius: radius.lg }}
        p="xxs"
        bg="secondaryButtonBg"
      >
        {options.map((option) => (
          <Button
            variant="accent"
            type="button"
            key={option}
            onClick={() => onSelect(option)}
            style={{
              flex: 1,
              paddingBlock: spacing.sm,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              borderRadius: radius.md,
              backgroundColor:
                option === selected ? theme.colors.modalBg : "transparent",
            }}
          >
            <Text
              color={option === selected ? "primaryText" : "secondaryText"}
              style={{ textAlign: "center" }}
              size="sm"
            >
              {option}
            </Text>
          </Button>
        ))}
      </Container>
      <Spacer y="sm" />
      {children}
    </div>
  );
}
