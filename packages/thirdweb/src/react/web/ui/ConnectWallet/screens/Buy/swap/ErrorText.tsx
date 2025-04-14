import { CrossCircledIcon } from "@radix-ui/react-icons";
import { iconSize } from "../../../../../../core/design-system/index.js";
import { Container } from "../../../../components/basic.js";
import { Text } from "../../../../components/text.js";

export function ErrorText(props: {
  title: string;
  message: string;
}) {
  return (
    <Container gap="xxs" flex="column">
      <Container flex="row" gap="xxs" center="both" color="danger">
        <CrossCircledIcon width={iconSize.sm} height={iconSize.sm} />
        <Text color="danger" size="sm">
          {props.title}
        </Text>
      </Container>
      <Text center size="xs">
        {props.message}
      </Text>
    </Container>
  );
}
