import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getCachedChain } from "../../../../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { getContract } from "../../../../../../../contract/contract.js";
import { allowance } from "../../../../../../../extensions/erc20/__generated__/IERC20/read/allowance.js";
import type { BuyWithCryptoQuote } from "../../../../../../../pay/buyWithCrypto/getQuote.js";
import type { BuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import { getPostOnRampQuote } from "../../../../../../../pay/buyWithFiat/getPostOnRampQuote.js";
import type { BuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";
import { iconSize } from "../../../../../../core/design-system/index.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Text } from "../../../../components/text.js";
import { AccentFailIcon } from "../../../icons/AccentFailIcon.js";
import { SwapFlow } from "../swap/SwapFlow.js";
import type { PayerInfo } from "../types.js";

export function PostOnRampSwap(props: {
  title: string;
  client: ThirdwebClient;
  buyWithFiatStatus: BuyWithFiatStatus;
  onBack?: () => void;
  onDone: () => void;
  transactionMode: boolean;
  isEmbed: boolean;
  payer: PayerInfo;
  onSuccess: ((status: BuyWithCryptoStatus) => void) | undefined;
}) {
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

  const allowanceQuery = useQuery({
    queryKey: [
      "allowance",
      props.payer.account.address,
      postOnRampQuoteQuery.data?.approvalData,
    ],
    queryFn: () => {
      if (!postOnRampQuoteQuery.data?.approvalData) {
        return null;
      }
      return allowance({
        contract: getContract({
          client: props.client,
          address: postOnRampQuoteQuery.data.swapDetails.fromToken.tokenAddress,
          chain: getCachedChain(
            postOnRampQuoteQuery.data.swapDetails.fromToken.chainId,
          ),
        }),
        spender: postOnRampQuoteQuery.data.approvalData.spenderAddress,
        owner: props.payer.account.address,
      });
    },
    enabled: !!postOnRampQuoteQuery.data?.approvalData,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (
      postOnRampQuoteQuery.data &&
      !lockedOnRampQuote &&
      !postOnRampQuoteQuery.isRefetching &&
      !allowanceQuery.isLoading
    ) {
      setLockedOnRampQuote(postOnRampQuoteQuery.data);
    }
  }, [
    postOnRampQuoteQuery.data,
    lockedOnRampQuote,
    postOnRampQuoteQuery.isRefetching,
    allowanceQuery.isLoading,
  ]);

  if (postOnRampQuoteQuery.isError) {
    return (
      <Container fullHeight>
        <Container p="lg">
          <ModalHeader title={props.title} onBack={props.onBack} />
        </Container>

        <Container
          style={{
            minHeight: "300px",
          }}
          flex="column"
          center="both"
          p="lg"
        >
          <AccentFailIcon size={iconSize["3xl"]} />
          <Spacer y="xl" />
          <Text color="primaryText">Failed to get a price quote</Text>
          <Spacer y="lg" />

          <Button
            fullWidth
            variant="primary"
            onClick={() => {
              postOnRampQuoteQuery.refetch();
            }}
          >
            Try Again
          </Button>
        </Container>

        <Spacer y="xxl" />
      </Container>
    );
  }

  if (!lockedOnRampQuote) {
    return (
      <Container fullHeight>
        <Container p="lg">
          <ModalHeader title={props.title} onBack={props.onBack} />
        </Container>

        <Container
          style={{
            minHeight: "300px",
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

  return (
    <SwapFlow
      title={props.title}
      payer={props.payer}
      buyWithCryptoQuote={lockedOnRampQuote}
      client={props.client}
      onBack={props.onBack}
      isFiatFlow={true}
      onDone={props.onDone}
      onTryAgain={() => {
        setLockedOnRampQuote(undefined);
        postOnRampQuoteQuery.refetch();
      }}
      transactionMode={props.transactionMode}
      isEmbed={props.isEmbed}
      onSuccess={props.onSuccess}
      approvalAmount={allowanceQuery.data ?? undefined}
    />
  );
}
