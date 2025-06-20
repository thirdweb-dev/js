import type { ReactNode } from "react";
import { Container } from "../../ui/components/basic.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Spinner } from "../../ui/components/Spinner.js";
import { Text } from "../../ui/components/text.js";

export function LoadingState(props: {
  title: string;
  subtitle: string;
  icon: ReactNode;
}) {
  return (
    <Container animate="fadein">
      <Spacer y="xxl" />
      <Container
        center="x"
        flex="row"
        style={{
          position: "relative",
        }}
      >
        <Spinner color="accentText" size="4xl" />
        <Container
          color="accentText"
          style={{
            left: "50%",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {props.icon}
        </Container>
      </Container>
      <Spacer y="xl" />
      <Text center color="primaryText" size="lg">
        {props.title}
      </Text>
      <Spacer y="md" />
      <Text center multiline>
        {props.subtitle}
      </Text>
      <Spacer y="xxl" />
      <Spacer y="xxl" />
    </Container>
  );
}
