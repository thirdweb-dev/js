import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { radius } from "../../../core/design-system/index.js";
import { Text } from "../components/text.js";
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
    <Container>
      <Container
        flex="row"
        center="y"
        style={{ width: "100%", borderRadius: radius.md, marginTop: 8 }}
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
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              borderRadius: radius.md,
              color: option === selected ? theme.colors.primaryText : "auto",
              backgroundColor:
                option === selected ? theme.colors.modalBg : "transparent",
            }}
          >
            <Text
              color={option === selected ? "primaryText" : "secondaryText"}
              style={{ textAlign: "center" }}
            >
              {option}
            </Text>
          </Button>
        ))}
      </Container>
      <Container py="sm">{children}</Container>
    </Container>
  );
}
