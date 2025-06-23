import type React from "react";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { radius, spacing } from "../../../core/design-system/index.js";
import { Text } from "../components/text.js";
import { Container } from "./basic.js";
import { Button } from "./buttons.js";
import { Spacer } from "./Spacer.js";

export default function Tabs({
  selected,
  onSelect,
  options,
  children,
}: {
  selected: string;
  onSelect: (selected: string) => void;
  options: { label: React.ReactNode; value: string }[];
  children: React.ReactNode;
}) {
  const theme = useCustomTheme();
  return (
    <div>
      <Container
        bg="secondaryButtonBg"
        center="y"
        flex="row"
        p="xxs"
        style={{ borderRadius: radius.lg, width: "100%" }}
      >
        {options.map((option) => (
          <Button
            key={option.value}
            onClick={() => onSelect(option.value)}
            style={{
              alignItems: "center",
              backgroundColor:
                option.value === selected
                  ? theme.colors.modalBg
                  : "transparent",
              borderRadius: radius.md,
              display: "flex",
              flex: 1,
              justifyContent: "center",
              paddingBlock: spacing.sm,
              position: "relative",
            }}
            type="button"
            variant="accent"
          >
            <Text
              color={
                option.value === selected ? "primaryText" : "secondaryText"
              }
              size="sm"
              style={{ textAlign: "center" }}
            >
              {option.label}
            </Text>
          </Button>
        ))}
      </Container>
      <Spacer y="sm" />
      {children}
    </div>
  );
}
