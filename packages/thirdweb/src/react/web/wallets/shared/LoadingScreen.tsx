import { Container } from "../../ui/components/basic.js";
import { Spinner } from "../../ui/components/Spinner.js";

/**
 * @internal
 */
export function LoadingScreen(props: { height?: string }) {
  return (
    <Container
      center="both"
      flex="row"
      fullHeight
      style={{
        minHeight: props.height || "350px",
      }}
    >
      <Spinner color="secondaryText" size="xl" />
    </Container>
  );
}
