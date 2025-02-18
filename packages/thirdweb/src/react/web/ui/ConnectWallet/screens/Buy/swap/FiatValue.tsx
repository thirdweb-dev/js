import { useQuery } from "@tanstack/react-query";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { convertCryptoToFiat } from "../../../../../../../pay/convert/cryptoToFiat.js";
import { formatNumber } from "../../../../../../../utils/formatNumber.js";
import { fontSize } from "../../../../../../core/design-system/index.js";
import { Skeleton } from "../../../../components/Skeleton.js";
import { Text } from "../../../../components/text.js";
import type { TextProps } from "../../../../components/text.js";
import { useDebouncedValue } from "../../../../hooks/useDebouncedValue.js";
import type { ERC20OrNativeToken } from "../../nativeToken.js";
import { getTokenAddress } from "../../nativeToken.js";

export function FiatValue(
  props: {
    tokenAmount: string;
    token: ERC20OrNativeToken;
    chain: Chain;
    client: ThirdwebClient;
  } & TextProps,
) {
  const deferredTokenAmount = useDebouncedValue(props.tokenAmount, 500);
  const cryptoToFiatQuery = useQuery({
    queryKey: [
      "cryptoToFiat",
      props.chain.id,
      getTokenAddress(props.token),
      deferredTokenAmount,
    ],
    queryFn: () =>
      convertCryptoToFiat({
        client: props.client,
        chain: props.chain,
        fromTokenAddress: getTokenAddress(props.token),
        fromAmount: Number(deferredTokenAmount),
        to: "USD",
      }),
  });

  if (cryptoToFiatQuery.isLoading) {
    return <Skeleton width={"50px"} height={fontSize.lg} />;
  }

  return cryptoToFiatQuery.data?.result ? (
    <Text {...props}>
      ${formatNumber(cryptoToFiatQuery.data.result, 2).toFixed(2)}
    </Text>
  ) : null;
}
