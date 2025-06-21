import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import { Container } from "../../../../components/basic.js";

export function StepConnectorArrow() {
  const theme = useCustomTheme();
  return (
    <Container
      center="both"
      flex="row"
      style={{
        marginBottom: "-10px",
        marginTop: "-10px",
        position: "relative",
        width: "100%",
        zIndex: 1000,
      }}
    >
      <Container
        center="both"
        color="primaryText"
        flex="row"
        style={{
          backgroundColor: theme.colors.modalBg,
          border: `1px solid ${theme.colors.borderColor}`,
          borderRadius: "100%",
          height: "30px",
          width: "30px",
        }}
      >
        <ChevronDownIcon height={16} width={16} />
      </Container>
    </Container>
  );
}
