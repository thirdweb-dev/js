import { useGlobalTheme } from "../../providers/ui-context-provider";
import BaseButton from "./BaseButton";
import Box from "./Box";
import ImageSvgUri from "./ImageSvgUri";
import Text from "./Text";

type WalletButtonSquareProps = {
  onPress: () => void;
  walletIconUrl: string;
  size: number;
  name: string;
} & (typeof BaseButton)["arguments"];

export const WalletButtonSquare = ({
  onPress,
  walletIconUrl,
  name,
  size,
}: WalletButtonSquareProps) => {
  const theme = useGlobalTheme();

  const marginVertical = theme.spacing.xs;
  return (
    <BaseButton
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      marginVertical="xxs"
      borderWidth={0}
      borderRadius="sm"
      width={size - marginVertical * 2}
      height={size - marginVertical * 2}
      onPress={onPress}
    >
      <Box borderWidth={0} borderRadius="lg">
        <ImageSvgUri
          imageUrl={walletIconUrl}
          width={size * 0.6}
          height={size * 0.6}
        />
      </Box>
      <Text
        variant="bodySmallSecondary"
        numberOfLines={1}
        mt="xs"
        fontSize={14}
        lineHeight={16}
      >
        {name}
      </Text>
    </BaseButton>
  );
};
