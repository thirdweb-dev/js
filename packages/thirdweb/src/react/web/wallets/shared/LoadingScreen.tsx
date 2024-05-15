import { Spinner } from "../../ui/components/Spinner.js";
import { Container } from "../../ui/components/basic.js";

/**
 * @internal
 */
export function LoadingScreen(props: { height?: string }) {
  return (
    <Container
      style={{
        minHeight: props.height || "350px",
      }}
      fullHeight
      flex="row"
      center="both"
    >
      <Spinner size="xl" color="secondaryText" />
    </Container>
  );
}
