import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import { Container } from "../../../../components/basic.js";

export function StepConnectorArrow() {
  const theme = useCustomTheme();
  return (
    <Container
      flex="row"
      center="both"
      style={{
        width: "100%",
        position: "relative",
        marginTop: "-10px",
        marginBottom: "-10px",
        zIndex: 1000,
      }}
    >
      <Container
        flex="row"
        center="both"
        style={{
          borderRadius: "100%",
          width: "30px",
          height: "30px",
          backgroundColor: theme.colors.modalBg,
          border: `1px solid ${theme.colors.borderColor}`,
        }}
      >
        <ChevronDownIcon width={16} height={16} />
      </Container>
    </Container>
  );
}
