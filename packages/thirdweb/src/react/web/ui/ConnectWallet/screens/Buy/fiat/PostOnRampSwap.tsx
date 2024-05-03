import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import {
  type BuyWithCryptoQuote,
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
  closeModal: () => void;
}) {
  const account = useActiveAccount();

  const [lockedOnRampQuote, setLockedOnRampQuote] = useState<
    BuyWithCryptoQuote | undefined | null
  >(undefined);

  const postOnRampQuoteQuery = useQuery({
    queryKey: ["getPostOnRampQuote", props.buyWithFiatStatus],
    queryFn: async () => {
      return await getPostOnRampQuote({
        client: props.client,
        buyWithFiatStatus: props.buyWithFiatStatus,
      });
    },
    // stop fetching if a quote is already locked
    enabled: !lockedOnRampQuote,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (postOnRampQuoteQuery.data && !lockedOnRampQuote) {
      setLockedOnRampQuote(postOnRampQuoteQuery.data);
    }
  }, [postOnRampQuoteQuery.data, lockedOnRampQuote]);

  if (!lockedOnRampQuote || !account) {
    return (
      <Container fullHeight>
        <Container p="lg">
          <ModalHeader title="Buy" onBack={props.onBack} />
        </Container>

        <Container
          style={{
            minHeight: "300px",
          }}
          flex="column"
          center="both"
        >
          <Spinner size="xl" color="accentText" />
          <Spacer y="xl" />
          <Text color="primaryText">Getting price quote</Text>
        </Container>

        <Spacer y="xxl" />
      </Container>
    );
  }

  if (lockedOnRampQuote === null) {
    return (
      <Container>
        <Container p="lg">
          <ModalHeader title="Buy" onBack={props.onBack} />
        </Container>

        <Spacer y="xxl" />

        <Container flex="row" center="x">
          <AccentFailIcon size={iconSize["3xl"]} />
        </Container>
        <Spacer y="xl" />
        <Text color="primaryText" size="lg" center>
          No transaction found
        </Text>

        <Spacer y="3xl" />
      </Container>
    );
  }

  return (
    <SwapFlow
      account={account}
      buyWithCryptoQuote={lockedOnRampQuote}
      client={props.client}
      onBack={props.onBack}
      onViewPendingTx={props.onViewPendingTx}
      isFiatFlow={true}
      closeModal={props.closeModal}
    />
  );
}
