import { radius } from "../../../core/design-system/index.js";
import { Container } from "./basic.js";

export function StepBar(props: { steps: number; currentStep: number }) {
  return (
    <Container
      bg="tertiaryBg"
      flex="row"
      style={{
        borderRadius: radius.lg,
        height: "8px",
      }}
    >
      <Container
        bg="accentText"
        style={{
          borderRadius: radius.lg,
          width: `${(props.currentStep / props.steps) * 95}%`,
        }}
      >
        {null}
      </Container>
    </Container>
  );
}
