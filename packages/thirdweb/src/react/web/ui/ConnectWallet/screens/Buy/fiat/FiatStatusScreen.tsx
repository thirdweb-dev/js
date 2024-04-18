import { CheckCircledIcon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { useBuyWithFiatStatus } from "../../../../../../core/hooks/pay/useBuyWithFiatStatus.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { iconSize } from "../../../../design-system/index.js";
import { AccentFailIcon } from "../../../icons/AccentFailIcon.js";

export function FiatStatusScreen(props: {
  client: ThirdwebClient;
  onBack: () => void;
  quoteId: string;
}) {
  const statusQuery = useBuyWithFiatStatus({
    quoteId: props.quoteId,
    client: props.client,
  });

  const isLoading = !statusQuery.data || statusQuery.data.status === "PENDING";

  const isNotFound =
    statusQuery.data?.status === "NONE" ||
    statusQuery.data?.status === "NOT_FOUND";

  const isFailed = statusQuery.data?.status === "FAILED";

  const isCompleted = statusQuery.data?.status === "COMPLETED";

  return (
    <Container p="lg">
      <ModalHeader title="Buy" onBack={props.onBack} />
      <Spacer y="xl" />
      <Spacer y="xl" />

      {isLoading && (
        <>
          <Container flex="row" center="x">
            <Spinner size="3xl" color="accentText" />
          </Container>
          <Spacer y="xl" />
          <Text color="primaryText" size="lg" center>
            Buy Pending
          </Text>
        </>
      )}

      {(isNotFound || isFailed) && (
        <>
          <Container flex="row" center="x">
            <AccentFailIcon size={iconSize["3xl"]} />
          </Container>
          <Spacer y="xl" />
          <Text color="primaryText" size="lg" center>
            {isFailed ? "Buy Failed" : "Transaction Not Found"}
          </Text>
        </>
      )}

      {isCompleted && (
        <>
          <Container flex="row" center="x" color="success">
            <CheckCircledIcon
              width={iconSize["3xl"]}
              height={iconSize["3xl"]}
            />
          </Container>
          <Spacer y="xl" />
          <Text color="primaryText" size="lg" center>
            Buy Complete
          </Text>
          <Spacer y="xl" />
          <Button variant="accent" fullWidth onClick={props.onBack}>
            Continue Buying
          </Button>
        </>
      )}

      {!isCompleted && (
        <>
          <Spacer y="lg" />
          <Spacer y="xl" />
        </>
      )}
    </Container>
  );
}
