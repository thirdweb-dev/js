import { iconSize } from "../../../../react/core/design-system/index.js";
import { AccentFailIcon } from "../../ui/ConnectWallet/icons/AccentFailIcon.js";
import { Container } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Text } from "../../ui/components/text.js";

export function ErrorState(props: { onTryAgain: () => void; title: string }) {
  return (
    <Container animate="fadein">
      <Spacer y="xxl" />
      <Container center="x" flex="row">
        <AccentFailIcon size={iconSize["3xl"]} />
      </Container>
      <Spacer y="lg" />
      <Text center color="primaryText" size="md">
        {props.title}
      </Text>
      <Spacer y="xl" />
      <Spacer y="xxl" />
      <Button fullWidth onClick={props.onTryAgain} variant="accent">
        Try Again
      </Button>
    </Container>
  );
}
