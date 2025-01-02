import type { ReactNode } from "react";
import { Spacer } from "../../ui/components/Spacer.js";
import { Spinner } from "../../ui/components/Spinner.js";
import { Container } from "../../ui/components/basic.js";
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
        flex="row"
        center="x"
        style={{
          position: "relative",
        }}
      >
        <Spinner size="4xl" color="accentText" />
        <Container
          color="accentText"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
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
      <Text multiline center>
        {props.subtitle}
      </Text>
      <Spacer y="xxl" />
      <Spacer y="xxl" />
    </Container>
  );
}
