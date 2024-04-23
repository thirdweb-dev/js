import { Container } from "./basic";
import { Spinner } from "./Spinner";

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
      <Spinner size="lg" color="secondaryText" />
    </Container>
  );
}
