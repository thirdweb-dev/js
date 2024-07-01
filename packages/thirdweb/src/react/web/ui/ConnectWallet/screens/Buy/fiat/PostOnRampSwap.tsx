import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import { getPostOnRampQuote } from "../../../../../../../pay/buyWithFiat/getPostOnRampQuote.js";
import type { BuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";
import type { Wallet } from "../../../../../../../wallets/interfaces/wallet.js";
import { iconSize } from "../../../../../../core/design-system/index.js";
import { useActiveAccount } from "../../../../../hooks/wallets/useActiveAccount.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { AccentFailIcon } from "../../../icons/AccentFailIcon.js";
import { SwapFlow } from "../swap/SwapFlow.js";

export function PostOnRampSwap(props: {
  client: ThirdwebClient;
  buyWithFiatStatus: BuyWithFiatStatus;
  onBack: null | (() => void);
  onViewPendingTx: () => void;
  onDone: () => void;
  isBuyForTx: boolean;
  isEmbed: boolean;
  activeChain: Chain;
  activeWallet: Wallet;
}) {
  const account = useActiveAccount();

  const [lockedOnRampQuote, setLockedOnRampQuote] = useState<
    BuyWithCryptoQuote | undefined
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
    if (
      postOnRampQuoteQuery.data &&
      !lockedOnRampQuote &&
      !postOnRampQuoteQuery.isRefetching
    ) {
      setLockedOnRampQuote(postOnRampQuoteQuery.data);
    }
  }, [
    postOnRampQuoteQuery.data,
    lockedOnRampQuote,
    postOnRampQuoteQuery.isRefetching,
  ]);

  if (postOnRampQuoteQuery.isError) {
    return (
      <PostOnrampQuoteFailed
        onBack={props.onBack}
        onRetry={() => {
          postOnRampQuoteQuery.refetch();
        }}
      />
    );
  }

  if (!lockedOnRampQuote || !account) {
    return <GettingPostOnRampQuote onBack={props.onBack} />;
  }

  return (
    <SwapFlow
      account={account}
      buyWithCryptoQuote={lockedOnRampQuote}
      client={props.client}
      onBack={props.onBack}
      onDone={props.onDone}
      onTryAgain={() => {
        setLockedOnRampQuote(undefined);
        postOnRampQuoteQuery.refetch();
      }}
      isEmbed={props.isEmbed}
      activeChain={props.activeChain}
      activeWallet={props.activeWallet}
    />
  );
}

export function GettingPostOnRampQuote(props: {
  onBack: null | (() => void);
}) {
  return (
    <Container fullHeight>
      <Container p="lg">
        <ModalHeader title="Buy" onBack={props.onBack} />
      </Container>

      <Container
        style={{
          minHeight: "280px",
        }}
        flex="column"
        center="both"
      >
        <Spinner size="xxl" color="accentText" />
        <Spacer y="xl" />
        <Text color="primaryText">Getting price quote</Text>
      </Container>

      <Spacer y="xxl" />
    </Container>
  );
}

export function PostOnrampQuoteFailed(props: {
  onBack: null | (() => void);
  onRetry: () => void;
}) {
  return (
    <Container fullHeight>
      <Container p="lg">
        <ModalHeader title="Buy" onBack={props.onBack} />
      </Container>

      <Container
        style={{
          minHeight: "280px",
        }}
        flex="column"
        center="both"
        p="lg"
      >
        <AccentFailIcon size={iconSize["3xl"]} />
        <Spacer y="xl" />
        <Text color="primaryText">Failed to get a price quote</Text>
        <Spacer y="lg" />

        <Button fullWidth variant="primary" onClick={props.onRetry}>
          Try Again
        </Button>
      </Container>

      <Spacer y="lg" />
    </Container>
  );
}
