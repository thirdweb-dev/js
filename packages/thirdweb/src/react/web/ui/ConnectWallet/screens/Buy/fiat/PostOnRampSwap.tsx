import { useQuery } from "@tanstack/react-query";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import {
  type BuyWithFiatStatus,
  getPostOnRampQuote,
} from "../../../../../../../exports/pay.js";
import { useActiveAccount } from "../../../../../../../exports/react-native.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Text } from "../../../../components/text.js";
import { iconSize } from "../../../../design-system/index.js";
import { AccentFailIcon } from "../../../icons/AccentFailIcon.js";
import { SwapFlow } from "../swap/SwapFlow.js";

export function PostOnRampSwap(props: {
  client: ThirdwebClient;
  buyWithFiatStatus: BuyWithFiatStatus;
  onBack: () => void;
  onViewPendingTx: () => void;
}) {
  const account = useActiveAccount();
  const postOnRampQuoteQuery = useQuery({
    queryKey: ["getPostOnRampQuote", props.buyWithFiatStatus],
    queryFn: async () => {
      return await getPostOnRampQuote({
        client: props.client,
        buyWithFiatStatus: props.buyWithFiatStatus,
      });
    },
  });

  if (!postOnRampQuoteQuery.data || !account) {
    return (
      <Container fullHeight>
        <Container p="lg">
          <ModalHeader title="Buy" onBack={props.onBack} />
        </Container>

        <Container
          style={{
            minHeight: "300px",
          }}
          flex="row"
          center="both"
        >
          <Spinner size="xl" color="accentText" />
        </Container>
      </Container>
    );
  }

  if (postOnRampQuoteQuery.data === null) {
    return (
      <Container>
        <Container p="lg">
          <ModalHeader title="Buy" onBack={props.onBack} />
        </Container>
        <Container flex="row" center="x">
          <AccentFailIcon size={iconSize["3xl"]} />
        </Container>
        <Spacer y="xl" />
        <Text color="primaryText" size="lg" center>
          No transaction found
        </Text>
      </Container>
    );
  }

  return (
    <SwapFlow
      account={account}
      buyWithCryptoQuote={postOnRampQuoteQuery.data}
      client={props.client}
      onBack={props.onBack}
      onViewPendingTx={props.onViewPendingTx}
      isFiatFlow={true}
    />
  );
}
