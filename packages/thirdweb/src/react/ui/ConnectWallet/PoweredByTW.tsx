import { Container } from "../components/basic.js";
import { Link } from "../components/text.js";
import { Text } from "../components/text.js";
import { ThirdwebTextIcon } from "./icons/ThirdwebTextIcon.js";

/**
 * @internal
 */
export function PoweredByThirdweb() {
  return (
    <Link
      color="secondaryText"
      hoverColor="primaryText"
      target="_blank"
      href="https://thirdweb.com/connect?utm_source=cw_text"
    >
      <Container
        flex="row"
        center="both"
        style={{
          color: "currentColor",
          gap: 4,
        }}
      >
        <Text
          size="sm"
          weight={600}
          style={{
            color: "currentColor",
          }}
        >
          {"Powered by"}
        </Text>
        <ThirdwebTextIcon height={13} />
      </Container>
    </Link>
  );
}
