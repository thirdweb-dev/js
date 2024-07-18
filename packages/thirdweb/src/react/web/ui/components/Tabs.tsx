import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { Text } from "../components/text.js";
import { Container, Line } from "./basic.js";

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
      <Container flex="row" center="y" style={{ width: "100%" }}>
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onSelect(option)}
            style={{
              flex: 1,
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Text
              color={option === selected ? "primaryText" : "secondaryText"}
              style={{ textAlign: "center" }}
            >
              {option}
            </Text>
            <Line
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                backgroundColor:
                  option === selected ? "white" : theme.colors.separatorLine,
              }}
            />
          </button>
        ))}
      </Container>
      <Container py="sm">{children}</Container>
    </Container>
  );
}
