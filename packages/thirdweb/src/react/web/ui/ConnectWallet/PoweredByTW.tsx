import { Container } from "../components/basic.js";
import { Link, Text } from "../components/text.js";
import { ThirdwebTextIcon } from "./icons/ThirdwebTextIcon.js";

/**
 * @internal
 */
export function PoweredByThirdweb(props: { link?: string }) {
  const link =
    props.link ||
    "https://playground.thirdweb.com/connect/sign-in/button?utm_source=cw_text";
  return (
    <Link
      color="secondaryText"
      hoverColor="primaryText"
      href={link}
      target="_blank"
    >
      <Container
        center="both"
        flex="row"
        style={{
          color: "currentColor",
          gap: 4,
        }}
      >
        <Text
          size="xs"
          style={{
            color: "currentColor",
          }}
          weight={600}
        >
          Powered by
        </Text>
        <ThirdwebTextIcon height={11} />
      </Container>
    </Link>
  );
}
