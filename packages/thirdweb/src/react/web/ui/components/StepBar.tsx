import { radius } from "../../../core/design-system/index.js";
import { Container } from "./basic.js";

export function StepBar(props: { steps: number; currentStep: number }) {
  return (
    <Container
      bg="tertiaryBg"
      flex="row"
      style={{
        height: "8px",
        borderRadius: radius.lg,
      }}
    >
      <Container
        bg="accentText"
        style={{
          width: `${(props.currentStep / props.steps) * 95}%`,
          borderRadius: radius.lg,
        }}
      >
        {null}
      </Container>
    </Container>
  );
}
