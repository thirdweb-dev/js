import { Container } from "../components/basic.js";
import { Link } from "../components/text.js";
import { Text } from "../components/text.js";
import { ThirdwebTextIcon } from "./icons/ThirdwebTextIcon.js";

/**
 * @internal
 */
export function PoweredByThirdweb(props: {
  link?: string;
}) {
  const link =
    props.link ||
    "https://playground.thirdweb.com/connect/sign-in/button?utm_source=cw_text";
  return (
    <Link
      color="secondaryText"
      hoverColor="primaryText"
      target="_blank"
      href={link}
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
          size="xs"
          weight={600}
          style={{
            color: "currentColor",
          }}
        >
          Powered by
        </Text>
        <ThirdwebTextIcon height={11} />
      </Container>
    </Link>
  );
}
