import { useQuery } from "@tanstack/react-query";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { convertCryptoToFiat } from "../../../../../../../pay/convert/cryptoToFiat.js";
import type { SupportedFiatCurrency } from "../../../../../../../pay/convert/type.js";
import { fontSize } from "../../../../../../core/design-system/index.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import type { TextProps } from "../../../../components/text.js";
import { Text } from "../../../../components/text.js";
import { useDebouncedValue } from "../../../../hooks/useDebouncedValue.js";
import { formatCurrencyAmount } from "../../formatTokenBalance.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { getTokenAddress } from "../../nativeToken.js";

export function FiatValue(
  props: {
    tokenAmount: string;
    token: ERC20OrNativeToken;
    chain: Chain;
    client: ThirdwebClient;
    currency?: SupportedFiatCurrency;
  } & TextProps,
) {
  const deferredTokenAmount = useDebouncedValue(props.tokenAmount, 500);
  const cryptoToFiatQuery = useQuery({
    queryFn: () =>
      convertCryptoToFiat({
        chain: props.chain,
        client: props.client,
        fromAmount: Number(deferredTokenAmount),
        fromTokenAddress: getTokenAddress(props.token),
        to: props.currency || "USD",
      }),
    queryKey: [
      "cryptoToFiat",
      props.chain.id,
      getTokenAddress(props.token),
      deferredTokenAmount,
    ],
  });

  if (cryptoToFiatQuery.isLoading) {
    return <Skeleton height={fontSize.lg} width={"50px"} />;
  }

  return cryptoToFiatQuery.data?.result ? (
    <Text {...props}>
      {formatCurrencyAmount(
        props.currency || "USD",
        cryptoToFiatQuery.data.result,
      )}
    </Text>
  ) : null;
}
