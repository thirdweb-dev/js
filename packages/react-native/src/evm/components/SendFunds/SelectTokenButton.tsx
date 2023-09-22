import { useBalance, useChain } from "@thirdweb-dev/react-core";
import { TokenInfo } from "./defaultTokens";
import { BaseButton, Box, ChainIcon, ImageSvgUri, Text } from "../base";
import LoadingTextAnimation from "../base/LoadingTextAnimation";

export function SelectTokenButton(props: {
  token?: TokenInfo;
  onPress: () => void;
}) {
  const balanceQuery = useBalance(props.token?.address);
  const chain = useChain();
  const tokenName = props.token?.name || balanceQuery.data?.name;

  return (
    <BaseButton flexDirection="row" alignItems="center" onPress={props.onPress}>
      {props.token?.icon ? (
        <ImageSvgUri width={32} height={32} imageUrl={props.token.icon} />
      ) : (
        <ChainIcon chainIconUrl={chain?.icon?.url} size={32} active={false} />
      )}
      <Box ml="md" alignItems="flex-start" justifyContent="center" height={36}>
        <Text variant="bodySmall">{tokenName}</Text>
        {!balanceQuery.data ? (
          <LoadingTextAnimation
            text="Fetching..."
            textVariant={"bodySmallSecondary"}
          />
        ) : (
          <Text variant="bodySmallSecondary" fontSize={12}>
            {Number(balanceQuery.data?.displayValue).toFixed(3)}{" "}
            {balanceQuery.data.symbol}
          </Text>
        )}
      </Box>
    </BaseButton>
  );
}
