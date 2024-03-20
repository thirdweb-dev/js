import { Container } from "../../ui/components/basic.js";
import { Spinner } from "../../ui/components/Spinner.js";

/**
 * @internal
 */
export function LoadingScreen(props: { height?: string }) {
  return (
    <Container
      style={{
        height: props.height || "350px",
      }}
      fullHeight
      flex="row"
      center="both"
    >
      <Spinner size="lg" color="secondaryText" />
    </Container>
  );
}
