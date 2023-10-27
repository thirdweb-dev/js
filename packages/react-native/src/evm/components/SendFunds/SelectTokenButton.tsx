import { useBalance, useChain } from "@thirdweb-dev/react-core";
import { TokenInfo } from "./defaultTokens";
import { BaseButton, Box, ChainIcon, ImageSvgUri, Text } from "../base";
import LoadingTextAnimation from "../base/LoadingTextAnimation";
import { useLocale } from "../../providers/ui-context-provider";

export function SelectTokenButton(props: {
  token?: TokenInfo;
  onPress: () => void;
}) {
  const l = useLocale();
  const balanceQuery = useBalance(props.token?.address);
  const chain = useChain();
  const tokenName = props.token?.name || balanceQuery.data?.name;

  return (
    <BaseButton
      flexDirection="row"
      alignItems="center"
      onPress={props.onPress}
      mb="sm"
    >
      {props.token?.icon ? (
        <ImageSvgUri width={32} height={32} imageUrl={props.token.icon} />
      ) : (
        <ChainIcon chainIconUrl={chain?.icon?.url} size={32} />
      )}
      <Box ml="md" alignItems="flex-start" justifyContent="center">
        <Text variant="bodyLarge">{tokenName}</Text>
        {!balanceQuery.data ? (
          <LoadingTextAnimation
            text={l.common.fetching}
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
