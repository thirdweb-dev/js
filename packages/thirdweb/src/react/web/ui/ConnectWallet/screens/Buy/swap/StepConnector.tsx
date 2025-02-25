import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import { Container } from "../../../../components/basic.js";

export function StepConnectorArrow(props: {
  active: boolean;
}) {
  const theme = useCustomTheme();
  return (
    <Container
      flex="row"
      center="both"
      style={{
        width: "100%",
        height: "12px",
        position: "relative",
        marginTop: "-1px",
        zIndex: 1000,
      }}
    >
      <svg
        role="presentation"
        width="32"
        height="16"
        viewBox="0 0 32 16"
        fill="none"
        style={{
          display: "block",
        }}
      >
        <path
          d="M1 0L16 15L31 0"
          fill={theme.colors.tertiaryBg}
          stroke={
            props.active ? theme.colors.accentText : theme.colors.borderColor
          }
          strokeWidth="1"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          d="M8 0L16 7.5L24 0"
          fill="none"
          stroke={
            props.active
              ? theme.colors.accentText
              : theme.colors.secondaryIconColor
          }
          strokeWidth="1"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
    </Container>
  );
}
